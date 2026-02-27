/**
 * @module eventListener
 * @dev Real-time Ethers.js event subscriptions for all deployed contracts.
 *      Feeds data into marketData.js rolling buffer and triggers orchestrator.
 *      Uses HTTP polling (filter-based) compatible with standard JSON-RPC endpoints.
 */

const { provider, getContract } = require('./blockchain');
const { recordTransfer } = require('./marketData');
const { markGoodBlock, setGovernanceFreeze } = require('./healthMonitor');
const MSSHistoryModel = require('../models/MSSHistory');
const PhaseTransition = require('../models/PhaseTransition');
const GovernanceEvent = require('../models/GovernanceEvent');
const LiquidityUnlock = require('../models/LiquidityUnlock');
const dotenv = require('dotenv');
dotenv.config();

// Minimal ABIs for event subscriptions
const TOKEN_ABI = [
    'event Transfer(address indexed from, address indexed to, uint256 value)'
];

const CONTROLLER_ABI = [
    'event MSSUpdated(uint256 newMSS)',
    'event PhaseTransitioned(uint8 from, uint8 to, uint256 mss)',
    'event ParametersUpdated(uint256 sellTax, uint256 buyTax, uint256 maxTxAmt, uint256 maxWallet)'
];

const VAULT_ABI = [
    'event TrancheReleased(uint256 index, uint256 amount)',
    'event VaultFrozen(bool frozen)'
];

const GOVERNANCE_ABI = [
    'event Paused(address account)',
    'event Unpaused(address account)'
];

const PHASE_NAMES = ['Protective', 'Growth', 'Expansion', 'Governance'];

let _orchestratorCallback = null;

/** Register a callback to trigger the agent evaluation cycle */
const onTriggerOrchestrator = (cb) => { _orchestratorCallback = cb; };

const startEventListener = () => {
    const tokenAddress = process.env.ADAPTIVE_TOKEN_ADDRESS;
    const pairAddress = process.env.AMM_PAIR_ADDRESS;
    const controllerAddress = process.env.EVOLUTION_CONTROLLER_ADDRESS;
    const vaultAddress = process.env.LIQUIDITY_VAULT_ADDRESS;
    const governanceAddress = process.env.GOVERNANCE_MODULE_ADDRESS;

    if (!tokenAddress || !controllerAddress) {
        console.warn('[EventListener] Missing contract addresses — skipping event subscriptions');
        return;
    }

    console.log('[EventListener] Starting blockchain event subscriptions...');

    // ─── AdaptiveToken: Transfer events ───────────────────────────
    const token = getContract(tokenAddress, TOKEN_ABI);
    token.on('Transfer', (from, to, value, event) => {
        markGoodBlock();
        recordTransfer(tokenAddress, { from, to, value, blockNumber: event.log?.blockNumber });
        console.log(`[EventListener] Transfer: ${from} → ${to}  value=${value.toString()}`);
    });

    // ─── EvolutionController events ───────────────────────────────
    const controller = getContract(controllerAddress, CONTROLLER_ABI);

    controller.on('MSSUpdated', async (newMSS) => {
        markGoodBlock();
        const mssValue = Number(newMSS);
        console.log(`[EventListener] MSSUpdated: ${mssValue}`);
        try {
            await MSSHistoryModel.create({
                tokenAddress,
                mss: mssValue,
                timestamp: Math.floor(Date.now() / 1000)
            });
        } catch (e) { console.error('[EventListener] DB error on MSSUpdated:', e.message); }
    });

    controller.on('PhaseTransitioned', async (from, to, mss, event) => {
        markGoodBlock();
        const fromName = PHASE_NAMES[Number(from)] || String(from);
        const toName = PHASE_NAMES[Number(to)] || String(to);
        console.log(`[EventListener] PhaseTransitioned: ${fromName} → ${toName} (MSS=${Number(mss)})`);
        try {
            await PhaseTransition.create({
                tokenAddress,
                fromPhase: fromName,
                toPhase: toName,
                mss: Number(mss),
                txHash: event?.log?.transactionHash || null
            });
        } catch (e) { console.error('[EventListener] DB error on PhaseTransitioned:', e.message); }
        // Note: Orchestrator trigger disabled to prevent feedback loops for on-chain changes initiated by the agent.
        // if (_orchestratorCallback) setImmediate(_orchestratorCallback);
    });

    controller.on('ParametersUpdated', (sellTax, buyTax, maxTxAmt, maxWallet) => {
        markGoodBlock();
        console.log(`[EventListener] ParametersUpdated: sell=${Number(sellTax) / 100}% buy=${Number(buyTax) / 100}%`);
    });

    // ─── LiquidityVault events ────────────────────────────────────
    if (vaultAddress) {
        const vault = getContract(vaultAddress, VAULT_ABI);

        vault.on('TrancheReleased', async (index, amount, event) => {
            markGoodBlock();
            console.log(`[EventListener] TrancheReleased: index=${Number(index)}`);
            try {
                await LiquidityUnlock.create({
                    tokenAddress,
                    trancheIndex: Number(index),
                    amount: amount.toString(),
                    txHash: event?.log?.transactionHash || null
                });
            } catch (e) { console.error('[EventListener] DB error on TrancheReleased:', e.message); }
        });

        vault.on('VaultFrozen', (frozen) => {
            markGoodBlock();
            console.log(`[EventListener] VaultFrozen: ${frozen}`);
        });
    }

    // ─── GovernanceModule events ──────────────────────────────────
    if (governanceAddress) {
        const governance = getContract(governanceAddress, GOVERNANCE_ABI);

        governance.on('Paused', async (account, event) => {
            markGoodBlock();
            console.warn('[EventListener] 🔒 Governance FREEZE activated!');
            setGovernanceFreeze(true);
            try {
                await GovernanceEvent.create({
                    tokenAddress,
                    type: 'freeze',
                    proposerAddress: account,
                    description: 'Governance pause activated',
                    txHash: event?.log?.transactionHash || null
                });
            } catch (e) { console.error('[EventListener] DB error on Paused:', e.message); }
        });

        governance.on('Unpaused', async (account, event) => {
            markGoodBlock();
            console.log('[EventListener] 🔓 Governance freeze lifted');
            setGovernanceFreeze(false);
            try {
                await GovernanceEvent.create({
                    tokenAddress,
                    type: 'unfreeze',
                    proposerAddress: account,
                    description: 'Governance pause lifted',
                    txHash: event?.log?.transactionHash || null
                });
            } catch (e) { console.error('[EventListener] DB error on Unpaused:', e.message); }
        });
    }

    console.log('[EventListener] ✅ All event subscriptions active');
};

module.exports = { startEventListener, onTriggerOrchestrator };
