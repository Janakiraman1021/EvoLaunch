const { ethers } = require('ethers');
const dotenv = require('dotenv');

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.BNB_RPC_URL);
const agentWallet = process.env.AGENT_PRIVATE_KEY
    ? new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider)
    : null;

const getContract = (address, abi) => {
    return new ethers.Contract(address, abi, provider);
};

const getContractWithSigner = (address, abi) => {
    if (!agentWallet) throw new Error("Agent wallet not configured");
    return new ethers.Contract(address, abi, agentWallet);
};

module.exports = {
    provider,
    agentWallet,
    getContract,
    getContractWithSigner
};
