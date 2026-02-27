/**
 * @module liquidityService
 * @dev Evaluates and executes liquidity tranche unlock on LiquidityVault.
 *      Only executes when the liquidity agent explicitly approves.
 */

const { getContractWithSigner } = require('./blockchain');
const { evaluateLiquidityUnlock } = require('../agents/liquidityAgent');
const LiquidityUnlock = require('../models/LiquidityUnlock');
const dotenv = require('dotenv');
dotenv.config();

const VAULT_ABI = [
    'function releaseTranche(uint256 index, uint256 currentMSS, uint8 currentPhase) external',
    'function tranches(uint256) view returns (uint256 amount, bool released, uint256 mssThreshold, uint8 phaseRequired)',
    'function isFrozen() view returns (bool)',
    'function lpToken() view returns (address)'
];

// Read how many tranches exist by trying indices until revert
const getUnreleasedTranches = async (vault) => {
    const unreleased = [];
    let idx = 0;
    while (true) {
        try {
            const t = await vault.tranches(idx);
            if (!t.released) {
                unreleased.push({
                    index: idx,
                    amount: t.amount.toString(),
                    mssThreshold: Number(t.mssThreshold),
                    phaseRequired: Number(t.phaseRequired)
                });
            }
            idx++;
        } catch {
            break; // No more tranches
        }
    }
    return unreleased;
};

/**
 * Checks eligibility of each tranche via the liquidity agent.
 * Calls releaseTranche for each approved unlock.
 */
const checkAndUnlockTranches = async (currentMSS, currentPhaseIdx, tokenAddress) => {
    const vaultAddress = process.env.LIQUIDITY_VAULT_ADDRESS;
    if (!vaultAddress) return;

    try {
        const vault = getContractWithSigner(vaultAddress, VAULT_ABI);

        const frozen = await vault.isFrozen();
        if (frozen) {
            console.log('[LiquidityService] Vault is frozen — skipping unlock check');
            return;
        }

        const unreleased = await getUnreleasedTranches(vault);
        if (unreleased.length === 0) {
            console.log('[LiquidityService] No unreleased tranches');
            return;
        }

        for (const tranche of unreleased) {
            const decision = evaluateLiquidityUnlock(
                currentMSS, tranche.index, unreleased.length,
                tranche.mssThreshold, tranche.phaseRequired, currentPhaseIdx
            );

            if (decision.shouldUnlock) {
                console.log(`[LiquidityService] Agent approved unlock for tranche ${tranche.index} — reason: ${decision.reason}`);
                try {
                    const tx = await vault.releaseTranche(tranche.index, currentMSS, currentPhaseIdx, { gasLimit: 300000 });
                    console.log(`[LiquidityService] Unlock TX: ${tx.hash}`);
                    await tx.wait();

                    await LiquidityUnlock.create({
                        tokenAddress,
                        trancheIndex: tranche.index,
                        amount: tranche.amount,
                        mssAtUnlock: currentMSS,
                        txHash: tx.hash
                    });
                } catch (txErr) {
                    console.error(`[LiquidityService] Unlock failed for tranche ${tranche.index}:`, txErr.message);
                }
            } else if (decision.shouldFreeze) {
                console.log(`[LiquidityService] Agent recommends FREEZE — reason: ${decision.reason}`);
            }
        }
    } catch (err) {
        console.error('[LiquidityService] Error:', err.message);
    }
};

module.exports = { checkAndUnlockTranches };
