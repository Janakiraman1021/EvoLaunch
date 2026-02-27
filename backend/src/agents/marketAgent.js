const axios = require('axios');
const { computeMSS } = require('../services/mssEngine');
const dotenv = require('dotenv');

dotenv.config();

/**
 * @dev Market Intelligence Agent (Grok-powered)
 */
const analyzeMarket = async (tokenAddress, pairAddress) => {
    const rawMSS = await computeMSS(tokenAddress, pairAddress);

    // Qualitative analysis via Grok
    let grokAnalysis = "Deterministic fallback used.";
    let finalMSS = rawMSS;

    if (process.env.GROK_API_KEY) {
        try {
            const response = await axios.post('https://api.x.ai/v1/chat/completions', {
                model: "grok-beta",
                messages: [
                    { role: "system", content: "You are a senior blockchain market analyst." },
                    { role: "user", content: `Analyze the market stability for a token with MSS: ${rawMSS}. Provide a suggested adjustment (0-100).` }
                ]
            }, {
                headers: { 'Authorization': `Bearer ${process.env.GROK_API_KEY}` }
            });

            grokAnalysis = response.data.choices[0].message.content;
            // Parse Grok's suggestion if possible, otherwise use rawMSS
        } catch (error) {
            console.error("Grok API Error:", error.message);
        }
    }

    return {
        mss: finalMSS,
        analysis: grokAnalysis,
        volatilityIndex: 20, // Low volatility
        liquidityStress: 10 // Low stress
    };
};

module.exports = {
    analyzeMarket
};
