/**
 * @module models/AIAgent
 * @desc MongoDB model for AI Agent state.
 *       Isolated from existing Launch/Agent models.
 */

const mongoose = require('mongoose');

const AIAgentSchema = new mongoose.Schema({
    agentId: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    strategyType: {
        type: String,
        required: true,
        enum: ['trading', 'yield', 'prediction', 'data_service', 'generic'],
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'paused', 'stopped', 'error'],
    },
    // Contract addresses
    contracts: {
        agentToken: { type: String },
        treasury: { type: String },
        riskController: { type: String },
        performanceTracker: { type: String },
        revenueDistributor: { type: String },
    },
    creator: { type: String, required: true, index: true },
    executor: { type: String },
    // Risk parameters
    riskParams: {
        maxCapitalAllocationBps: { type: Number, default: 2000 },
        maxDailyDeploymentBps: { type: Number, default: 5000 },
        maxDrawdownBps: { type: Number, default: 1500 },
    },
    // Performance cache (updated periodically from chain)
    performance: {
        roiPercent: { type: Number, default: 0 },
        winRatePercent: { type: Number, default: 0 },
        totalExecutions: { type: Number, default: 0 },
        cumulativePnL: { type: String, default: '0' },
        treasuryBalance: { type: String, default: '0' },
    },
    initialCapital: { type: String, default: '0' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('AIAgent', AIAgentSchema);
