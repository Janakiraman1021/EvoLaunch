/**
 * @module grokService
 * @dev Sends structured market prompts to Grok AI and parses the response
 *      into a deterministic numeric payload. On failure, returns null so
 *      the orchestrator can skip the cycle — we never fallback to random values.
 */

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';
const GROK_MODEL = 'grok-beta';

const SYSTEM_PROMPT = `You are a blockchain market stability analyst for the EvoLaunch Protocol on BNB Smart Chain.
Your job is to analyze token market metrics and output a strict JSON payload. No prose, no markdown.
Output ONLY valid JSON with these exact keys:
{
  "mssAdjustment": <integer -10 to +10>,
  "riskLevel": <float 0.0 to 1.0>,
  "phaseRecommendation": <integer 0=Protective, 1=Growth, 2=Expansion>,
  "analysis": <string max 120 chars>
}`;

/**
 * Analyze market metrics with Grok AI.
 * @param {Object} metrics - Rolling window metrics from marketData.js
 * @param {number} rawMSS - Deterministically computed MSS
 * @returns {Object|null} Parsed Grok output or null on failure
 */
const analyzeWithGrok = async (metrics, rawMSS) => {
    if (!process.env.GROK_API_KEY) {
        console.warn('[GrokService] No GROK_API_KEY — skipping AI analysis');
        return null;
    }

    const userMessage = `Market Metrics:
- Raw MSS: ${rawMSS}
- Buy Pressure: ${metrics.buyPressure}%
- Buy Count: ${metrics.buyCount} | Sell Count: ${metrics.sellCount}
- Whale Transactions: ${metrics.whaleCount}
- Unique Buyers (rolling): ${metrics.uniqueBuyers}
- Buy Volume: ${metrics.buyVolume}
- Sell Volume: ${metrics.sellVolume}

Analyze these metrics and return your structured JSON payload.`;

    const isGroq = process.env.GROK_API_KEY.startsWith('gsk_');
    const apiUrl = isGroq ? 'https://api.groq.com/openai/v1/chat/completions' : GROK_API_URL;
    const model = isGroq ? 'llama-3.1-70b-versatile' : GROK_MODEL;

    try {
        const response = await axios.post(apiUrl, {
            model: model,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.1,  // Low temp for deterministic output
            max_tokens: 200
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 15000
        });

        const raw = response.data?.choices?.[0]?.message?.content;
        if (!raw) throw new Error('Empty Grok response');

        // Parse strictly — if malformed, we get null
        const parsed = JSON.parse(raw.trim());

        // Validate required fields and clamp values
        const result = {
            mssAdjustment: Math.max(-10, Math.min(10, Number(parsed.mssAdjustment) || 0)),
            riskLevel: Math.max(0, Math.min(1, Number(parsed.riskLevel) || 0.5)),
            phaseRecommendation: [0, 1, 2].includes(Number(parsed.phaseRecommendation))
                ? Number(parsed.phaseRecommendation) : null,
            analysis: String(parsed.analysis || '').slice(0, 120)
        };

        console.log(`[GrokService] Analysis complete: risk=${result.riskLevel} adj=${result.mssAdjustment}`);
        return result;
    } catch (err) {
        console.error('[GrokService] Failed:', err.message);
        return null; // Caller must handle null — no fallback to random values
    }
};

module.exports = { analyzeWithGrok };
