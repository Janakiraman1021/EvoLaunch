/**
 * @module governanceMonitor
 * @dev Subscribes to GovernanceModule events and manages the global freeze state.
 *      All agent transitions check isGovernanceFrozen() before proceeding.
 */

const { getContract } = require('./blockchain');
const { setGovernanceFreeze } = require('./healthMonitor');
const GovernanceEvent = require('../models/GovernanceEvent');
const dotenv = require('dotenv');
dotenv.config();

const GOVERNANCE_ABI = [
    'event Paused(address account)',
    'event Unpaused(address account)',
    'function paused() view returns (bool)'
];

const startGovernanceMonitor = async () => {
    const governanceAddress = process.env.GOVERNANCE_MODULE_ADDRESS;
    if (!governanceAddress) {
        console.warn('[GovernanceMonitor] No GOVERNANCE_MODULE_ADDRESS — skipping');
        return;
    }

    const tokenAddress = process.env.ADAPTIVE_TOKEN_ADDRESS;
    const governance = getContract(governanceAddress, GOVERNANCE_ABI);

    // Sync initial state from chain
    try {
        const currentlyPaused = await governance.paused();
        setGovernanceFreeze(currentlyPaused);
        console.log(`[GovernanceMonitor] Initial freeze state: ${currentlyPaused}`);
    } catch (err) {
        console.warn('[GovernanceMonitor] Could not read initial pause state:', err.message);
    }

    // Live event subscriptions
    governance.on('Paused', async (account, event) => {
        console.warn('[GovernanceMonitor] 🔒 Governance freeze ACTIVATED by', account);
        setGovernanceFreeze(true);
        try {
            await GovernanceEvent.create({
                tokenAddress,
                type: 'freeze',
                proposerAddress: account,
                description: 'Contract paused by governance',
                txHash: event?.log?.transactionHash || null
            });
        } catch (e) { }
    });

    governance.on('Unpaused', async (account, event) => {
        console.log('[GovernanceMonitor] 🔓 Governance freeze LIFTED by', account);
        setGovernanceFreeze(false);
        try {
            await GovernanceEvent.create({
                tokenAddress,
                type: 'unfreeze',
                proposerAddress: account,
                description: 'Contract unpaused by governance',
                txHash: event?.log?.transactionHash || null
            });
        } catch (e) { }
    });

    console.log('[GovernanceMonitor] ✅ Governance event subscriptions active');
};

module.exports = { startGovernanceMonitor };
