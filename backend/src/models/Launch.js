const mongoose = require('mongoose');

const launchSchema = new mongoose.Schema({
    tokenAddress: { type: String, required: true, unique: true },
    vaultAddress: { type: String, required: true },
    controllerAddress: { type: String, required: true },
    governanceAddress: { type: String, required: true },
    name: String,
    symbol: String,
    creationTimestamp: { type: Number, required: true },
    status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' }
});

module.exports = mongoose.model('Launch', launchSchema);
