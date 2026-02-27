/**
 * @module models/AgentExecution
 * @desc MongoDB model for AI Agent execution logs.
 */

const mongoose = require('mongoose');

const AgentExecutionSchema = new mongoose.Schema({
    agentId: { type: Number, required: true, index: true },
    strategyType: { type: String, required: true },
    executionType: {
        type: String,
        enum: ['BUY', 'SELL', 'DEPOSIT', 'WITHDRAW', 'CLAIM', 'BET', 'SIGNAL', 'MODULE_EXEC'],
    },
    amountIn: { type: String, default: '0' },
    amountOut: { type: String, default: '0' },
    pnl: { type: String, default: '0' },
    capitalUsed: { type: String, default: '0' },
    txHash: { type: String, default: '' },
    success: { type: Boolean, required: true },
    reason: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

AgentExecutionSchema.index({ agentId: 1, timestamp: -1 });

module.exports = mongoose.model('AgentExecution', AgentExecutionSchema);
