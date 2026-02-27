const mongoose = require('mongoose');

const mssHistorySchema = new mongoose.Schema({
    tokenAddress: { type: String, required: true, index: true },
    mss: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    liquidityScore: Number,
    volatilityScore: Number,
    distributionScore: Number,
    participationScore: Number
});

module.exports = mongoose.model('MSSHistory', mssHistorySchema);
