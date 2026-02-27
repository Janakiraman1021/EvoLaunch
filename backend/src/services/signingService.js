/**
 * @module signingService
 * @dev Signs agent payloads for on-chain submission to EvolutionController.
 *      Payload matches the contract's keccak256 encoding exactly.
 */

const { ethers } = require('ethers');
const { agentWallet } = require('./blockchain');

/**
 * Signs the full agent evaluation payload.
 * @param {number} mss - Market Stability Score (0–100)
 * @param {number} sellTax - In basis points (e.g. 500 = 5%)
 * @param {number} buyTax  - In basis points
 * @param {bigint|string} maxTxAmt - Max transaction amount in wei
 * @param {bigint|string} maxWallet - Max wallet size in wei
 * @param {number} timestamp - Unix timestamp of payload
 * @param {bigint|number} nonce - Agent nonce from contract
 * @param {string} controllerAddress - EvolutionController address
 * @returns {string} ECDSA signature hex string
 */
const signAgentSignal = async (
    mss, sellTax, buyTax, maxTxAmt, maxWallet, timestamp, nonce, controllerAddress
) => {
    if (!agentWallet) throw new Error('Agent wallet not configured');

    const messageHash = ethers.solidityPackedKeccak256(
        ['uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'address'],
        [
            BigInt(mss),
            BigInt(sellTax),
            BigInt(buyTax),
            BigInt(maxTxAmt.toString()),
            BigInt(maxWallet.toString()),
            BigInt(timestamp),
            BigInt(nonce.toString()),
            controllerAddress
        ]
    );

    const signature = await agentWallet.signMessage(ethers.getBytes(messageHash));
    return signature;
};

module.exports = { signAgentSignal };
