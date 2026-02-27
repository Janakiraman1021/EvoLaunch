/**
 * @module routes/aiAgentApi
 * @desc REST API routes for the AI Agent Launchpad.
 *       Mounted at /api/ai-agents — completely independent from existing routes.
 */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const AIAgent = require('../models/AIAgent');
const AgentExecution = require('../models/AgentExecution');
const agentCore = require('../ai-agent-engine/AgentCore');

const limiter = rateLimit({ windowMs: 60000, max: 100 });
router.use(limiter);

// ─── List All Agents ──────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const { creator, status, strategyType } = req.query;
        const filter = {};
        if (creator) filter.creator = creator.toLowerCase();
        if (status) filter.status = status;
        if (strategyType) filter.strategyType = strategyType;

        const agents = await AIAgent.find(filter)
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(agents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Get Single Agent ─────────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const agent = await AIAgent.findOne({ agentId: parseInt(req.params.id) });
        if (!agent) return res.status(404).json({ error: 'Agent not found' });
        res.json(agent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Create Agent ─────────────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const {
            agentId, name, symbol, strategyType, creator, executor,
            contracts, riskParams, initialCapital
        } = req.body;

        const agent = new AIAgent({
            agentId,
            name,
            symbol,
            strategyType,
            creator: creator?.toLowerCase(),
            executor,
            contracts,
            riskParams: riskParams || {},
            initialCapital: initialCapital || '0',
        });

        await agent.save();

        // Load into execution engine if it's initialized
        try {
            if (agentCore.provider) {
                await agentCore.loadAgent(agentId);
            }
        } catch (e) {
            console.warn('[aiAgentApi] Could not load agent into engine:', e.message);
        }

        res.status(201).json(agent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ─── Agent Performance ────────────────────────────────────────────
router.get('/:id/performance', async (req, res) => {
    try {
        const agent = await AIAgent.findOne({ agentId: parseInt(req.params.id) });
        if (!agent) return res.status(404).json({ error: 'Agent not found' });

        // Try to get live data from engine
        const runtime = agentCore.activeAgents?.get(parseInt(req.params.id));
        if (runtime?.perfReporter) {
            try {
                const livePerf = await runtime.perfReporter.getPerformance();
                if (livePerf) return res.json({ ...agent.performance, ...livePerf, live: true });
            } catch (e) { /* Fall through to cached data */ }
        }

        res.json({ ...agent.performance, live: false });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Agent Execution Logs ─────────────────────────────────────────
router.get('/:id/executions', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 200);
        const logs = await AgentExecution.find({ agentId: parseInt(req.params.id) })
            .sort({ timestamp: -1 })
            .limit(limit);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Agent Treasury ───────────────────────────────────────────────
router.get('/:id/treasury', async (req, res) => {
    try {
        const runtime = agentCore.activeAgents?.get(parseInt(req.params.id));
        if (runtime?.treasuryManager) {
            try {
                const stats = await runtime.treasuryManager.getStats();
                const revenueStats = await runtime.treasuryManager.getRevenueStats();
                return res.json({ ...stats, revenue: revenueStats, live: true });
            } catch (e) { /* Fall through */ }
        }

        const agent = await AIAgent.findOne({ agentId: parseInt(req.params.id) });
        if (!agent) return res.status(404).json({ error: 'Agent not found' });
        res.json({ balance: agent.performance?.treasuryBalance || '0', live: false });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Start Agent ──────────────────────────────────────────────────
router.post('/:id/start', async (req, res) => {
    try {
        const agentId = parseInt(req.params.id);
        const agent = await AIAgent.findOne({ agentId });
        if (!agent) return res.status(404).json({ error: 'Agent not found' });

        agent.status = 'active';
        await agent.save();

        // Load into engine
        if (agentCore.provider) {
            await agentCore.loadAgent(agentId);
        }

        res.json({ success: true, status: 'active' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Stop Agent ───────────────────────────────────────────────────
router.post('/:id/stop', async (req, res) => {
    try {
        const agentId = parseInt(req.params.id);
        const agent = await AIAgent.findOne({ agentId });
        if (!agent) return res.status(404).json({ error: 'Agent not found' });

        agent.status = 'stopped';
        await agent.save();

        agentCore.removeAgent(agentId);

        res.json({ success: true, status: 'stopped' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Risk Status ──────────────────────────────────────────────────
router.get('/:id/risk', async (req, res) => {
    try {
        const runtime = agentCore.activeAgents?.get(parseInt(req.params.id));
        if (runtime?.riskValidator) {
            try {
                const status = await runtime.riskValidator.getStatus();
                return res.json({ ...status, live: true });
            } catch (e) { /* Fall through */ }
        }

        const agent = await AIAgent.findOne({ agentId: parseInt(req.params.id) });
        if (!agent) return res.status(404).json({ error: 'Agent not found' });
        res.json({ ...agent.riskParams, live: false });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Engine Status ────────────────────────────────────────────────
router.get('/engine/status', (req, res) => {
    res.json(agentCore.getStatus());
});

module.exports = router;
