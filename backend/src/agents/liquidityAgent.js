/**
 * @dev Liquidity Orchestrator Agent
 */
const evaluateLiquidityUnlock = (mss, currentTrancheIndex, totalTranches) => {
    let shouldUnlock = false;
    let shouldFreeze = false;

    if (mss < 30) {
        shouldFreeze = true;
    } else if (mss >= 60 && currentTrancheIndex < totalTranches) {
        shouldUnlock = true;
    }

    return {
        shouldUnlock,
        shouldFreeze,
        reason: mss < 30 ? "High instability" : (mss >= 60 ? "Stable growth" : "Neutral state")
    };
};

module.exports = {
    evaluateLiquidityUnlock
};
