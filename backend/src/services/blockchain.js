const { ethers } = require('ethers');
const dotenv = require('dotenv');
dotenv.config();
const networks = require('../../config/networks.json');

// HTTP provider with failover logic
const rpcUrls = [process.env.BNB_RPC_URL, ...networks.bsc_testnet.rpc_urls];
let _currentRpcIndex = 0;
let provider = new ethers.JsonRpcProvider(rpcUrls[_currentRpcIndex]);

const rotateProvider = () => {
    _currentRpcIndex = (_currentRpcIndex + 1) % rpcUrls.length;
    console.log(`[Blockchain] Rotating RPC provider to: ${rpcUrls[_currentRpcIndex]}`);
    provider = new ethers.JsonRpcProvider(rpcUrls[_currentRpcIndex]);
};

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
        if (block === _lastBlockNumber && now - _lastBlockTime > 90000) {
            console.warn('[Blockchain] Block number stale — possible RPC issue');
            rotateProvider();
            return false;
        }
        _lastBlockNumber = block;
        _lastBlockTime = now;
        return true;
    } catch (err) {
        console.error('[Blockchain] Health check failed:', err.message);
        rotateProvider();
        return false;
    }
};

module.exports = {
    provider,
    rotateProvider,
    agentWallet,
    getContract,
    getContractWithSigner,
    isProviderHealthy
};
