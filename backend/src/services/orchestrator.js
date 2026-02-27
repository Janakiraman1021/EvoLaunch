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

const { analyzeMarket } = require('../agents/marketAgent');
const { evaluatePhaseTransition } = require('../agents/phaseAgent');
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

// Tax parameters per phase (in basis points: 100 = 1%)
const PHASE_PARAMS = {
    0: { sellTax: 1500, buyTax: 500 },   // Protective: 15% sell, 5% buy
    1: { sellTax: 500, buyTax: 200 },   // Growth: 5% sell, 2% buy
    2: { sellTax: 200, buyTax: 100 },   // Expansion: 2% sell, 1% buy
    3: { sellTax: 100, buyTax: 100 },   // Governance: 1%/1%
};

// Transaction limits in wei (token units × 1e18)
const MAX_TX_AMT = '10000000000000000000000';  // 10k tokens
const MAX_WALLET = '20000000000000000000000';  // 20k tokens

let _isRunning = false;

const runEvaluationCycle = async () => {
    if (_isRunning) {
        console.log('[Orchestrator] Cycle already running — skipping');
        return;
    }
    _isRunning = true;

    const cycleStart = Date.now();
    console.log(`\n[Orchestrator] ═══ Cycle started at ${new Date().toISOString()} ═══`);

    try {
        // ── Guard: System health & governance ────────────────────
        if (!isSystemHealthy()) {
            console.warn('[Orchestrator] ⚠️  System unhealthy — cycle aborted, keeping last state');
            return;
        }
        if (isGovernanceFrozen()) {
            console.warn('[Orchestrator] 🔒 Governance freeze active — cycle aborted');
            return;
        }

        const tokenAddress = process.env.ADAPTIVE_TOKEN_ADDRESS;
        const pairAddress = process.env.AMM_PAIR_ADDRESS;
        const controllerAddress = process.env.EVOLUTION_CONTROLLER_ADDRESS;

        if (!tokenAddress || !controllerAddress) {
            throw new Error('Missing ADAPTIVE_TOKEN_ADDRESS or EVOLUTION_CONTROLLER_ADDRESS in .env');
        }

        // ── Step 1: Get current on-chain state ───────────────────
        const controller = getContract(controllerAddress, CONTROLLER_ABI);
        const [currentPhaseIdx, onChainMSS] = await Promise.all([
            controller.currentPhase(),
            controller.currentMSS()
        ]);
        const currentPhase = Number(currentPhaseIdx);
        console.log(`[Orchestrator] On-chain: Phase=${PHASE_NAMES[currentPhase]} MSS=${Number(onChainMSS)}`);

        // ── Step 2: Market Intelligence Agent ────────────────────
        const marketData = await analyzeMarket(tokenAddress, pairAddress);
        console.log(`[Orchestrator] MarketAgent: MSS=${marketData.mss} risk=${marketData.volatilityRisk} liquidityStress=${marketData.liquidityStress}`);

        // ── Step 3: Phase Evolution Agent ────────────────────────
        const phaseDecision = evaluatePhaseTransition(
            currentPhase, marketData.mss,
            marketData.volatilityRisk, marketData.liquidityStress,
            isGovernanceFrozen()
        );
        console.log(`[Orchestrator] PhaseAgent: ${phaseDecision.reason}`);

        // ── Step 4: Determine token parameters ───────────────────
        const targetPhase = phaseDecision.nextPhase;
        const params = PHASE_PARAMS[targetPhase] || PHASE_PARAMS[0];

        // ── Step 5: Broadcast signal to EvolutionController ──────
        let txResult = null;
        try {
            txResult = await broadcastSignal({
                mss: marketData.mss,
                sellTax: params.sellTax,
                buyTax: params.buyTax,
                maxTxAmt: MAX_TX_AMT,
                maxWallet: MAX_WALLET
            });
            if (txResult) {
                console.log(`[Orchestrator] ✅ Signal submitted: ${txResult.txHash}`);
            }
        } catch (txErr) {
            console.error('[Orchestrator] TX failed:', txErr.message);
            // Do not crash — preserve last valid on-chain state
        }

        // ── Step 6: Liquidity Agent + unlock check ────────────────
        await checkAndUnlockTranches(marketData.mss, targetPhase, tokenAddress);

        // ── Step 7: Persist cycle results ────────────────────────
        const cycleDuration = Date.now() - cycleStart;
        await AgentLog.create({
            tokenAddress,
            mss: marketData.mss,
            rawMSS: marketData.rawMSS,
            phase: PHASE_NAMES[targetPhase],
            sellTax: params.sellTax,
            buyTax: params.buyTax,
            maxTxAmt: MAX_TX_AMT,
            maxWallet: MAX_WALLET,
            volatilityRisk: marketData.volatilityRisk,
            liquidityStress: marketData.liquidityStress,
            analysis: marketData.analysis,
            txHash: txResult?.txHash || null
        });

        await MSSHistory.create({
            tokenAddress,
            mss: marketData.mss,
            timestamp: Math.floor(Date.now() / 1000)
        });

        console.log(`[Orchestrator] ═══ Cycle complete in ${cycleDuration}ms ═══\n`);
    } catch (err) {
        console.error('[Orchestrator] ❌ Cycle error:', err.message);
    } finally {
        _isRunning = false;
    }
};

const startOrchestrator = () => {
    const intervalMs = parseInt(process.env.UPDATE_INTERVAL_MS) || 300000; // Default: 5 minutes
    console.log(`[Orchestrator] Starting with ${intervalMs / 1000}s interval`);
    runEvaluationCycle(); // Immediate first cycle
    setInterval(runEvaluationCycle, intervalMs);
};

module.exports = { startOrchestrator, runEvaluationCycle };
