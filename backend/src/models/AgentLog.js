const mongoose = require('mongoose');

const agentLogSchema = new mongoose.Schema({
    agentName: { type: String, required: true },
    tokenAddress: { type: String, required: true, index: true },
    timestamp: { type: Number, required: true },
    decision: String,
    reason: String,
    payload: Object,
    signature: String
});

module.exports = mongoose.model('AgentLog', agentLogSchema);
