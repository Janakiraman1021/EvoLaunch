const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

const connectDB = require('./services/database');
const { startHealthMonitor } = require('./services/healthMonitor');
const { startEventListener, onTriggerOrchestrator } = require('./services/eventListener');
const { startGovernanceMonitor } = require('./services/governanceMonitor');
const { startOrchestrator, runEvaluationCycle } = require('./services/orchestrator');
const { startReputationRecalculation } = require('./services/reputationService');

dotenv.config();

const app = express();

// ─── Security Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));

// Global rate limit: 200 req/min per IP
app.use(rateLimit({ windowMs: 60000, max: 200 }));

// ─── Health endpoint (no auth needed) ───────────────────────────
app.get('/api/health', (req, res) => {
    const { getHealthStatus } = require('./services/healthMonitor');
    res.json({ status: 'ok', ...getHealthStatus() });
});

// ─── Routes ───────────────────────────────────────────────────────
app.use('/api', require('./routes/api'));

// ─── AI Agent Launchpad Routes (modular extension) ────────────────
app.use('/api/ai-agents', require('./routes/aiAgentApi'));

// ─── 404 handler ─────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// ─── Error handler ───────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('[Server] Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// ─── Startup ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    // 1. Connect Database
    await connectDB();

    // 2. Start health monitor (independent of chain)
    startHealthMonitor();

    // 3. Start governance monitor (syncs freeze state from chain)
    await startGovernanceMonitor();

    // 4. Start event listener (feeds marketData + triggers orchestrator on phase events)
    startEventListener();

    // 5. Register orchestrator as the callback for event-driven triggers
    onTriggerOrchestrator(runEvaluationCycle);

    // 6. Start periodic orchestrator
    startOrchestrator();

    // 7. Start periodic reputation recalculation (every 1hr)
    const tokenAddress = process.env.ADAPTIVE_TOKEN_ADDRESS;
    if (tokenAddress) startReputationRecalculation(tokenAddress, 3600000);

    // 8. Start HTTP server
    app.listen(PORT, () => {
        console.log(`\n🚀 EvoLaunch Backend running on port ${PORT}`);
        console.log(`   Health: http://localhost:${PORT}/api/health`);
        console.log(`   API:    http://localhost:${PORT}/api/status/<tokenAddress>\n`);
    });
};

startServer().catch((err) => {
    console.error('Fatal startup error:', err);
    process.exit(1);
});
