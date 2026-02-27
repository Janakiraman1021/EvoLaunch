const mongoose = require('mongoose');

const AgentLogSchema = new mongoose.Schema({
    tokenAddress: { type: String, required: true, index: true },
    mss: { type: Number, required: true },
    rawMSS: { type: Number },
    phase: { type: String, required: true },
    sellTax: { type: Number },
    buyTax: { type: Number },
    maxTxAmt: { type: String },
    maxWallet: { type: String },
    volatilityRisk: { type: Number },
    liquidityStress: { type: Number },
    analysis: { type: String },
    grokAnalysis: { type: String },
    txHash: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AgentLog', AgentLogSchema);
