/**
 * @module ai-agent-engine/config
 * @desc Configuration for the AI Agent Execution Engine.
 *       Environment variables should be defined in .env
 */

require('dotenv').config();

module.exports = {
    // Blockchain
    rpcUrl: process.env.BNB_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545',
    executorPrivateKey: process.env.AGENT_PRIVATE_KEY || null,

    // Contract Addresses
    agentFactoryAddress: process.env.AGENT_FACTORY_ADDRESS || null,
    wrappedBNBAddress: process.env.WBNB_ADDRESS || '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd', // BSC Testnet WBNB

    // Engine Settings
    executionIntervalMs: parseInt(process.env.AGENT_EXECUTION_INTERVAL) || 60000,   // 1 minute
    healthCheckIntervalMs: parseInt(process.env.AGENT_HEALTH_CHECK_INTERVAL) || 300000, // 5 minutes

    // Performance Settings
    maxConsecutiveErrors: 5,
    maxCycleDurationMs: 30000,
};
