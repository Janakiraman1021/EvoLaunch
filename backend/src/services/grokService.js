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

const { spawn } = require('child_process');
const path = require('path');

/**
 * Analyze market metrics with the Python-based Groq AI agent.
 * @param {Object} metrics - Rolling window metrics from marketData.js
 * @param {number} rawMSS - Deterministically computed MSS
 * @returns {Object|null} Parsed agent output or null on failure
 */
const { callPythonAgent } = require('./pythonBridge');

/**
 * Analyze market metrics with the Python-based Groq AI agent.
 * @param {Object} metrics - Rolling window metrics from marketData.js
 * @param {number} rawMSS - Deterministically computed MSS
 * @returns {Object|null} Parsed agent output or null on failure
 */
const analyzeWithGrok = async (metrics, rawMSS) => {
    const result = await callPythonAgent('mss_agent.py', [
        '--metrics', JSON.stringify(metrics),
        '--mss', rawMSS.toString()
    ]);

    if (result.error) {
        console.error('[GrokService] Error calling Python agent:', result.error);
        return null;
    }

    // Standardize fields matching the existing system
    return {
        mss: result.mss,
        rawMSS: result.rawMSS,
        volatilityRisk: result.volatilityRisk,
        liquidityStress: result.liquidityStress,
        analysis: String(result.analysis || '').slice(0, 120),
        phaseRecommendation: result.phaseRecommendation
    };
};

module.exports = { analyzeWithGrok };
