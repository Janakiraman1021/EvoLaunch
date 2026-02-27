/**
 * @module liquidityAgent
 * @dev Evaluates whether a liquidity tranche should be unlocked.
 *      Decisions are based on MSS, phase, and tranche-specific thresholds.
 */

/**
 * Evaluate unlock eligibility for a single tranche.
 * @param {number} mss - Current MSS (0–100)
 * @param {number} trancheIndex
 * @param {number} totalTranches
 * @param {number} mssThreshold - Tranche's required MSS
 * @param {number} phaseRequired - Tranche's required phase index
 * @param {number} currentPhase - Current on-chain phase index
 * @returns {{ shouldUnlock, shouldFreeze, reason }}
 */
const evaluateLiquidityUnlock = (
    mss, trancheIndex, totalTranches,
    mssThreshold, phaseRequired, currentPhase
) => {
    // Hard freeze threshold
    if (mss < 30) {
        return {
            shouldUnlock: false,
            shouldFreeze: true,
            reason: `MSS ${mss} is critically low — vault freeze recommended`
        };
    }

    // Check tranche-specific thresholds
    if (mss < mssThreshold) {
        return {
            shouldUnlock: false,
            shouldFreeze: false,
            reason: `MSS ${mss} below tranche threshold ${mssThreshold}`
        };
    }

    if (currentPhase < phaseRequired) {
        return {
            shouldUnlock: false,
            shouldFreeze: false,
            reason: `Current phase ${currentPhase} below required phase ${phaseRequired}`
        };
    }

    // All conditions met
    return {
        shouldUnlock: true,
        shouldFreeze: false,
        reason: `MSS ${mss} ≥ ${mssThreshold} and phase ${currentPhase} ≥ ${phaseRequired}`
    };
};

module.exports = { evaluateLiquidityUnlock };
