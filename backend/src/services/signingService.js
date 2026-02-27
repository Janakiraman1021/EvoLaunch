const { ethers } = require('ethers');
const { agentWallet } = require('./blockchain');

/**
 * @dev Signs agent output for on-chain verification.
 */
const signAgentSignal = async (mss, sellTax, buyTax, maxTxAmt, maxWallet, timestamp, nonce, controllerAddress) => {
    if (!agentWallet) throw new Error("Agent wallet not configured");

    const messageHash = ethers.solidityPackedKeccak256(
        ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256", "uint256", "address"],
        [mss, sellTax, buyTax, maxTxAmt, maxWallet, timestamp, nonce, controllerAddress]
    );

    const signature = await agentWallet.signMessage(ethers.getBytes(messageHash));
    return signature;
};

module.exports = {
    signAgentSignal
};
