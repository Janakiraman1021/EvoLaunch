const mongoose = require('mongoose');

const launchSchema = new mongoose.Schema({
    tokenAddress: { type: String, required: true, unique: true, index: true },
    vaultAddress: { type: String, default: '' },
    controllerAddress: { type: String, default: '' },
    governanceAddress: { type: String, default: '' },
    ammPairAddress: { type: String, default: '' },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    totalSupply: { type: String, default: '0' },
    sellTax: { type: Number, default: 0 },
    buyTax: { type: Number, default: 0 },
    phase: { type: Number, default: 0 },
    phaseName: { type: String, default: 'Genesis' },
    mss: { type: Number, default: 0 },
    deployer: { type: String, default: '' },
    blockNumber: { type: Number, default: 0 },
    creationTimestamp: { type: Number, default: () => Date.now() },
    status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' }
});

module.exports = mongoose.model('Launch', launchSchema);

