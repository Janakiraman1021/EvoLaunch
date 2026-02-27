/**
 * @module api
 * @dev REST API routes for the EvoLaunch Protocol dashboard.
 *      Rate limiting applied to sensitive endpoints.
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const Launch = require('../models/Launch');
const MSSHistory = require('../models/MSSHistory');
const AgentLog = require('../models/AgentLog');
const PhaseTransition = require('../models/PhaseTransition');
const Reputation = require('../models/Reputation');
const LiquidityUnlock = require('../models/LiquidityUnlock');
const GovernanceEvent = require('../models/GovernanceEvent');
const { getHealthStatus } = require('../services/healthMonitor');
const { computeReputation } = require('../services/reputationService');
const { getRollingMetrics } = require('../services/marketData');

// ─── Rate Limiters ────────────────────────────────────────────────
const generalLimiter = rateLimit({ windowMs: 60000, max: 100 });
const reputationLimiter = rateLimit({ windowMs: 60000, max: 20, message: { error: 'Rate limit exceeded' } });

router.use(generalLimiter);

// ─── Health ───────────────────────────────────────────────────────
router.get('/health', (req, res) => {
    res.json(getHealthStatus());
});

// ─── Rolling Market Metrics ───────────────────────────────────────
router.get('/metrics/:address', (req, res) => {
    const pairAddress = process.env.AMM_PAIR_ADDRESS;
    const metrics = getRollingMetrics(req.params.address, pairAddress);
    res.json(metrics);
});

// ─── Launch Status ────────────────────────────────────────────────
router.get('/status/:address', async (req, res) => {
    try {
        const [launch, latestMSS, recentLogs] = await Promise.all([
            Launch.findOne({ tokenAddress: req.params.address }),
            MSSHistory.findOne({ tokenAddress: req.params.address }).sort({ timestamp: -1 }),
            AgentLog.find({ tokenAddress: req.params.address }).sort({ timestamp: -1 }).limit(10)
        ]);
        res.json({
            launch,
            mss: latestMSS?.mss ?? 0,
            logs: recentLogs
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── MSS History (for charts) ─────────────────────────────────────
router.get('/history/:address', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 100, 500);
        const history = await MSSHistory.find({ tokenAddress: req.params.address })
            .sort({ timestamp: 1 }).limit(limit);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Agent Logs ───────────────────────────────────────────────────
router.get('/agent-logs/:address', async (req, res) => {
    try {
        const logs = await AgentLog.find({ tokenAddress: req.params.address })
            .sort({ timestamp: -1 }).limit(50);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Phase Transition History ─────────────────────────────────────
router.get('/phase-history/:address', async (req, res) => {
    try {
        const phases = await PhaseTransition.find({ tokenAddress: req.params.address })
            .sort({ timestamp: -1 }).limit(50);
        res.json(phases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Liquidity Unlocks ────────────────────────────────────────────
router.get('/liquidity-unlocks/:address', async (req, res) => {
    try {
        const unlocks = await LiquidityUnlock.find({ tokenAddress: req.params.address })
            .sort({ timestamp: -1 });
        res.json(unlocks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Reputation (wallet) ──────────────────────────────────────────
router.get('/reputation/:wallet', reputationLimiter, async (req, res) => {
    try {
        const wallet = req.params.wallet.toLowerCase();
        let rep = await Reputation.findOne({ walletAddress: wallet });

        if (!rep) {
            // Compute on demand
            const tokenAddress = process.env.ADAPTIVE_TOKEN_ADDRESS;
            if (tokenAddress) {
                await computeReputation(wallet, tokenAddress);
                rep = await Reputation.findOne({ walletAddress: wallet });
            }
        }
        res.json(rep || { walletAddress: wallet, score: 50, allocationWeight: 0.5 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Governance Events ────────────────────────────────────────────
router.get('/governance-events/:address', async (req, res) => {
    try {
        const events = await GovernanceEvent.find({ tokenAddress: req.params.address })
            .sort({ timestamp: -1 }).limit(50);
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
