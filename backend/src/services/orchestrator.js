/**
 * @module orchestrator
 * @dev Main agent coordination engine for EvoLaunch Protocol.
 *
 * Execution order per cycle:
 *   1. Check system health + governance freeze
 *   2. Market Intelligence Agent → compute MSS
 *   3. Phase Evolution Agent → determine phase
 *   4. Tx Broadcaster → submit signal to EvolutionController
 *   5. Liquidity Service → check/unlock tranches
 *   6. Persist cycle log to MongoDB
 */

const { callPythonAgent } = require('./pythonBridge');
const { broadcastSignal } = require('./txBroadcaster');
const { checkAndUnlockTranches } = require('./liquidityService');
const { isSystemHealthy, isGovernanceFrozen } = require('./healthMonitor');
const { getContract } = require('./blockchain');
const AgentLog = require('../models/AgentLog');
const MSSHistory = require('../models/MSSHistory');
const dotenv = require('dotenv');
dotenv.config();

const CONTROLLER_ABI = [
    'function currentPhase() view returns (uint8)',
    'function currentMSS() view returns (uint256)'
];

const PHASE_NAMES = ['Protective', 'Growth', 'Expansion', 'Governance'];

// Tax parameters per phase (in basis points)
const PHASE_PARAMS = {
    0: { sellTax: 1500, buyTax: 500 },
    1: { sellTax: 500, buyTax: 200 },
    2: { sellTax: 200, buyTax: 100 },
    3: { sellTax: 100, buyTax: 100 },
};

const MAX_TX_AMT = '10000000000000000000000';
const MAX_WALLET = '20000000000000000000000';

let _isRunning = false;

const runEvaluationCycle = async () => {
    if (_isRunning) return;
    _isRunning = true;

    try {
        if (!isSystemHealthy() || isGovernanceFrozen()) {
            console.warn('[Orchestrator] System unhealthy or frozen — skipping');
            return;
        }

        const tokenAddress = process.env.ADAPTIVE_TOKEN_ADDRESS;
        const pairAddress = process.env.AMM_PAIR_ADDRESS;
        const controllerAddress = process.env.EVOLUTION_CONTROLLER_ADDRESS;

        const { getRollingMetrics } = require('./marketData');
        const metrics = getRollingMetrics(tokenAddress, pairAddress);

        // ─── Phase 1: Market Intelligence (Python) ──────────────
        console.log('[Orchestrator] Running Market Intelligence...');
        const marketResult = await callPythonAgent('mss_agent.py', [
            '--metrics', JSON.stringify(metrics),
            '--mss', '50' // Seed value
        ]);
        if (marketResult.error) throw new Error(`MarketAgent failed: ${marketResult.error}`);

        // ─── Phase 2: Phase Evolution (Python) ──────────────────
        console.log('[Orchestrator] Running Phase Evolution...');
        const phaseResult = await callPythonAgent('phase_agent.py', [
            '--mss', marketResult.mss.toString(),
            '--volatility', marketResult.volatilityRisk.toString(),
            '--stress', marketResult.liquidityStress.toString()
        ]);
        if (phaseResult.error) throw new Error(`PhaseAgent failed: ${phaseResult.error}`);

        // ─── Phase 3: Liquidity Orchestration (Python) ──────────
        console.log('[Orchestrator] Running Liquidity Orchestration...');
        const liqResult = await callPythonAgent('liquidity_agent.py', [
            '--mss', marketResult.mss.toString(),
            '--phase', phaseResult.nextPhase.toString()
        ]);

        // ─── On-Chain Execution ────────────────────────────────
        const controller = getContract(controllerAddress, CONTROLLER_ABI);
        const onChainMSS = await controller.currentMSS();

        const mssDiff = Math.abs(marketResult.mss - Number(onChainMSS));
        const phaseChanged = phaseResult.nextPhase !== phaseResult.currentPhase;
        const autoSubmit = process.env.AUTO_SUBMIT === 'true';

        let txResult = null;
        if ((phaseChanged || mssDiff >= 5) && autoSubmit) {
            const params = PHASE_PARAMS[phaseResult.nextPhase] || PHASE_PARAMS[0];
            txResult = await broadcastSignal({
                mss: marketResult.mss,
                sellTax: params.sellTax,
                buyTax: params.buyTax,
                maxTxAmt: MAX_TX_AMT,
                maxWallet: MAX_WALLET
            });
        }

        // ─── Persist ───────────────────────────────────────────
        await AgentLog.create({
            tokenAddress,
            mss: marketResult.mss,
            rawMSS: marketResult.rawMSS,
            phase: PHASE_NAMES[phaseResult.nextPhase],
            analysis: marketResult.analysis,
            txHash: txResult?.txHash || null,
            volatilityRisk: marketResult.volatilityRisk,
            liquidityStress: marketResult.liquidityStress
        });

        // ─── Phase 4: Persistence ───────────────────────────
        await MSSHistory.create({
            tokenAddress,
            mss: marketResult.mss,
            timestamp: Math.floor(Date.now() / 1000)
        });

        console.log(`[Orchestrator] Cycle complete. MSS: ${marketResult.mss}`);
    } catch (err) {
        console.error('[Orchestrator] ❌ Cycle error:', err.message);
    } finally {
        _isRunning = false;
    }
};

const startOrchestrator = () => {
    // Default to 5 minutes (300,000ms) if not set in .env
    const intervalMs = parseInt(process.env.UPDATE_INTERVAL_MS) || 300000;
    console.log(`[Orchestrator] Starting with ${intervalMs / 1000}s interval (High Frequency Prevention)`);
    runEvaluationCycle(); // Immediate first cycle
    setInterval(runEvaluationCycle, intervalMs);
};

module.exports = { startOrchestrator, runEvaluationCycle };
