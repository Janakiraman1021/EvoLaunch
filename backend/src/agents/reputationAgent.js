/**
 * @module reputationAgent
 * @dev Computes a wallet's reputation score from historical behavior data.
 *      Score is used to compute allocation weight during token sales.
 */

/**
 * Compute reputation score from wallet behavior history.
 * @param {string} walletAddress
 * @param {{ holdingHours, dumpCount, isBotSuspect, previousScore }} history
 * @returns {{ wallet, score, allocationWeight, breakdown }}
 */
const analyzeReputation = (walletAddress, history = {}) => {
    let score = 50; // Neutral baseline

    const {
        holdingHours = 0,
        dumpCount = 0,
        isBotSuspect = false,
        previousScore = null
    } = history;

    // Holding duration rewards long-term alignment
    if (holdingHours > 168) score += 30;      // > 1 week
    else if (holdingHours > 72) score += 20;  // > 3 days
    else if (holdingHours > 24) score += 10;  // > 1 day
    else if (holdingHours > 1) score += 5;

    // Dump behavior penalties
    score -= Math.min(40, dumpCount * 10);    // Max -40 for 4+ dumps

    // Bot penalty
    if (isBotSuspect) score -= 40;

    // Momentum: blend 30% previous score for stability
    if (previousScore !== null) {
        score = Math.round(score * 0.7 + previousScore * 0.3);
    }

    score = Math.max(0, Math.min(100, score));

    return {
        wallet: walletAddress,
        score,
        allocationWeight: parseFloat((score / 100).toFixed(4)),
        breakdown: { holdingHours, dumpCount, isBotSuspect }
    };
};

module.exports = { analyzeReputation };
