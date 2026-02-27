const mongoose = require('mongoose');

const PhaseTransitionSchema = new mongoose.Schema({
    tokenAddress: { type: String, required: true, index: true },
    fromPhase: { type: String, required: true },
    toPhase: { type: String, required: true },
    mss: { type: Number, required: true },
    txHash: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PhaseTransition', PhaseTransitionSchema);
