const express = require('express');
const router = express.Router();
const Launch = require('../models/Launch');
const MSSHistory = require('../models/MSSHistory');
const AgentLog = require('../models/AgentLog');

// Get current launch status
router.get('/status/:address', async (req, res) => {
    try {
        const launch = await Launch.findOne({ tokenAddress: req.params.address });
        const latestMSS = await MSSHistory.findOne({ tokenAddress: req.params.address }).sort({ timestamp: -1 });
        const recentLogs = await AgentLog.find({ tokenAddress: req.params.address }).sort({ timestamp: -1 }).limit(10);

        res.json({ launch, latestMSS, recentLogs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get MSS history
router.get('/history/:address', async (req, res) => {
    try {
        const history = await MSSHistory.find({ tokenAddress: req.params.address }).sort({ timestamp: 1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
