/**
 * @module marketAgent
 * @dev Market Intelligence Agent — computes MSS from live rolling metrics
 *      and qualifies the result with Grok AI analysis.
 */

const { provider, getContract } = require('../services/blockchain');
const { getRollingMetrics } = require('../services/marketData');
const { analyzeWithGrok } = require('../services/grokService');

const PAIR_ABI = [
    'function getReserves() view returns (uint112, uint112, uint32)',
    'function token0() view returns (address)'
];

/**
 * Computes the Market Stability Score from live on-chain data.
 * MSS = (L*0.4) + (V*0.3) + (D*0.2) + (P*0.1), clamped 0–100.
 */
const analyzeMarket = async (tokenAddress, pairAddress) => {
    const metrics = getRollingMetrics(tokenAddress, pairAddress);

    // ─── 1. Liquidity Score (40%) ─────────────────────────────────
    let lScore = 50; // Default mid
    try {
        const pair = getContract(pairAddress, PAIR_ABI);
        const [token0, reserves] = await Promise.all([
            pair.token0(),
            pair.getReserves()
        ]);

        // Find which reserve is WBNB (assuming token0 is not the protocol token usually works, 
        // but let's be absolute: if token0 is ADAPTIVE_TOKEN, then reserve1 is WBNB)
        const isToken0 = token0.toLowerCase() === tokenAddress.toLowerCase();
        const wbnbReserveRaw = isToken0 ? reserves[1] : reserves[0];

        const wbnbReserve = Number(wbnbReserveRaw) / 1e18;
        lScore = Math.min(100, (wbnbReserve / 50) * 100); // 50 BNB = full score
    } catch (e) {
        console.warn('[MarketAgent] Liquidity fetch error:', e.message);
    }

    // ─── 2. Volatility Score (30%) ────────────────────────────────
    // Buy pressure close to 50 = balanced, away from 50 = volatile
    const deviation = Math.abs(metrics.buyPressure - 50);
    const vScore = Math.max(0, 100 - deviation * 2); // 0 deviation = 100, 50 deviation = 0

    // ─── 3. Distribution Score (20%) ─────────────────────────────
    // Fewer whale txns relative to total = better distribution
    const totalEvents = metrics.buyCount + metrics.sellCount || 1;
    const whaleRatio = metrics.whaleCount / totalEvents;
    const dScore = Math.max(0, 100 - whaleRatio * 200); // 0 whales = 100

    // ─── 4. Participation Score (10%) ────────────────────────────
    // More unique buyers = healthier participation
    const pScore = Math.min(100, metrics.uniqueBuyers * 5); // 20 unique buyers = 100

    const rawMSS = Math.round(
        (lScore * 0.4) + (vScore * 0.3) + (dScore * 0.2) + (pScore * 0.1)
    );

    console.log(`[MarketAgent] L:${lScore.toFixed(1)} V:${vScore.toFixed(1)} D:${dScore.toFixed(1)} P:${pScore.toFixed(1)} => rawMSS:${rawMSS}`);

    // ─── Grok Qualification ───────────────────────────────────────
    let finalMSS = rawMSS;
    let analysis = 'Deterministic scoring used.';
    let volatilityRisk = parseFloat(((100 - vScore) / 100).toFixed(2));
    let liquidityStress = parseFloat(((100 - lScore) / 100).toFixed(2));

    const grokResult = await analyzeWithGrok(metrics, rawMSS);
    if (grokResult) {
        // Grok can adjust MSS within ±10 of deterministic value
        finalMSS = Math.max(0, Math.min(100, rawMSS + grokResult.mssAdjustment));
        analysis = grokResult.analysis;
        volatilityRisk = grokResult.riskLevel;
        console.log(`[MarketAgent] Grok adjusted MSS from ${rawMSS} to ${finalMSS}`);
    }

    return { mss: finalMSS, rawMSS, analysis, volatilityRisk, liquidityStress };
};

module.exports = { analyzeMarket };
