/**
 * @module phaseAgent
 * @dev Phase Evolution Agent — determines phase transition based on MSS,
 *      liquidity stress, and volatility risk. Respects governance freeze.
 */

const PHASE_NAMES = ['Protective', 'Growth', 'Expansion', 'Governance'];

/**
 * Evaluates whether a phase transition should occur.
 * @param {number} currentPhase - Current phase index (0–3)
 * @param {number} mss - Adjusted MSS (0–100)
 * @param {number} volatilityRisk - 0.0–1.0 (higher = more volatile)
 * @param {number} liquidityStress - 0.0–1.0 (higher = more stressed)
 * @param {boolean} governanceFrozen
 * @returns {{ nextPhase, shouldTransition, reason }}
 */
const evaluatePhaseTransition = (
    currentPhase, mss, volatilityRisk = 0.3, liquidityStress = 0.3, governanceFrozen = false
) => {
    if (governanceFrozen) {
        return {
            nextPhase: currentPhase,
            shouldTransition: false,
            reason: 'Governance freeze active — no transitions permitted'
        };
    }

    // High risk conditions force downgrade regardless of MSS
    if (volatilityRisk > 0.75 || liquidityStress > 0.8) {
        return {
            nextPhase: 0, // Force Protective
            shouldTransition: currentPhase !== 0,
            reason: `Emergency downgrade: volatility=${volatilityRisk.toFixed(2)} liquidityStress=${liquidityStress.toFixed(2)}`
        };
    }

    // Standard MSS-based transitions (matching contract thresholds)
    let targetPhase;
    if (mss < 40) {
        targetPhase = 0; // Protective
    } else if (mss < 70) {
        targetPhase = 1; // Growth
    } else if (mss < 90) {
        targetPhase = 2; // Expansion
    } else {
        targetPhase = 3; // Governance — only at high sustained stability
    }

    // No skipping phases upward (can only go up 1 at a time)
    const nextPhase = Math.min(targetPhase, currentPhase + 1);

    return {
        nextPhase,
        shouldTransition: nextPhase !== currentPhase,
        reason: `MSS ${mss}: ${PHASE_NAMES[currentPhase]} → ${PHASE_NAMES[nextPhase]}`
    };
};

module.exports = { evaluatePhaseTransition };
