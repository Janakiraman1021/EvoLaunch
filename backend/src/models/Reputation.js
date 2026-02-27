const mongoose = require('mongoose');

const ReputationSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true, index: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    allocationWeight: { type: Number },
    holdingHours: { type: Number, default: 0 },
    dumpCount: { type: Number, default: 0 },
    isBotSuspect: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reputation', ReputationSchema);
