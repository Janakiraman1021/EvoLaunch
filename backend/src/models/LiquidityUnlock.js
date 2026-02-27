const mongoose = require('mongoose');

const LiquidityUnlockSchema = new mongoose.Schema({
    tokenAddress: { type: String, required: true, index: true },
    trancheIndex: { type: Number, required: true },
    amount: { type: String },
    mssAtUnlock: { type: Number },
    txHash: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LiquidityUnlock', LiquidityUnlockSchema);
