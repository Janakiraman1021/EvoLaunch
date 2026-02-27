/**
 * @dev Phase Evolution Agent
 */
const evaluatePhaseTransition = (currentPhase, mss) => {
    let nextPhase = currentPhase;

    // Logic matches Evolutionary state machine in contracts
    if (mss < 40) {
        nextPhase = 0; // Protective
    } else if (mss >= 40 && mss < 70) {
        nextPhase = 1; // Growth
    } else if (mss >= 70) {
        nextPhase = 2; // Expansion
    }

    return {
        nextPhase,
        shouldTransition: nextPhase !== currentPhase,
        reason: `MSS is ${mss}`
    };
};

module.exports = {
    evaluatePhaseTransition
};
