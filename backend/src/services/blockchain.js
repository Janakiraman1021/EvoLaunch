const { ethers } = require('ethers');
const dotenv = require('dotenv');
dotenv.config();

// HTTP provider for read/write calls
const provider = new ethers.JsonRpcProvider(process.env.BNB_RPC_URL);

// Agent wallet for signing
const agentWallet = process.env.AGENT_PRIVATE_KEY
    ? new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider)
    : null;

const getContract = (address, abi) => new ethers.Contract(address, abi, provider);
const getContractWithSigner = (address, abi) => {
    if (!agentWallet) throw new Error('Agent wallet not configured');
    return new ethers.Contract(address, abi, agentWallet);
};

// Health check: returns true if provider is responsive
let _lastBlockNumber = 0;
let _lastBlockTime = 0;
const isProviderHealthy = async () => {
    try {
        const block = await provider.getBlockNumber();
        const now = Date.now();
        if (block === _lastBlockNumber && now - _lastBlockTime > 60000) {
            console.warn('[Blockchain] Block number stale — possible RPC issue');
            return false;
        }
        _lastBlockNumber = block;
        _lastBlockTime = now;
        return true;
    } catch (err) {
        console.error('[Blockchain] Health check failed:', err.message);
        return false;
    }
};

module.exports = {
    provider,
    agentWallet,
    getContract,
    getContractWithSigner,
    isProviderHealthy
};
