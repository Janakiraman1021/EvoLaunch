const mongoose = require('mongoose');

const GovernanceEventSchema = new mongoose.Schema({
    tokenAddress: { type: String, index: true },
    type: { type: String, enum: ['freeze', 'unfreeze', 'proposal', 'other'], required: true },
    proposerAddress: { type: String },
    description: { type: String },
    txHash: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GovernanceEvent', GovernanceEventSchema);
