/**
 * @module txBroadcaster
 * @dev Handles gas estimation, nonce management, retry logic, and
 *      broadcasting the signed signal to the EvolutionController contract.
 */

const { provider, getContractWithSigner, agentWallet } = require('./blockchain');
const { signAgentSignal } = require('./signingService');
const dotenv = require('dotenv');
dotenv.config();

const EVOLUTION_CONTROLLER_ABI = [
    'function processAgentSignal(uint256 mss, uint256 sellTax, uint256 buyTax, uint256 maxTxAmt, uint256 maxWallet, uint256 timestamp, uint256 nonce, bytes signature) external',
    'function nonces(address) view returns (uint256)',
    'function lastUpdateTimestamp() view returns (uint256)'
];

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Broadcasts a signed agent signal to the EvolutionController.
 * Handles nonce, gas estimation, and up to MAX_RETRIES retries.
 * @returns {{ txHash: string, receipt: object }|null}
 */
const broadcastSignal = async ({ mss, sellTax, buyTax, maxTxAmt, maxWallet }) => {
    const controllerAddress = process.env.EVOLUTION_CONTROLLER_ADDRESS;
    if (!controllerAddress) throw new Error('EVOLUTION_CONTROLLER_ADDRESS not set');
    if (!agentWallet) throw new Error('Agent wallet not configured');

    const controller = getContractWithSigner(controllerAddress, EVOLUTION_CONTROLLER_ABI);
    const timestamp = Math.floor(Date.now() / 1000);

    // Fetch nonce + validate freshness
    const nonce = await controller.nonces(agentWallet.address);
    const lastUpdate = await controller.lastUpdateTimestamp();
    if (timestamp <= Number(lastUpdate)) {
        console.warn('[TxBroadcaster] Skipping — timestamp not newer than last on-chain update');
        return null;
    }

    // Sign payload
    const signature = await signAgentSignal(
        mss, sellTax, buyTax, maxTxAmt, maxWallet, timestamp, nonce, controllerAddress
    );

    // Gas estimation with 20% buffer
    let gasLimit;
    try {
        const estimated = await controller.processAgentSignal.estimateGas(
            mss, sellTax, buyTax, maxTxAmt, maxWallet, timestamp, nonce, signature
        );
        gasLimit = (estimated * 120n) / 100n;
    } catch (e) {
        console.warn('[TxBroadcaster] Gas estimation failed, using fallback 500000:', e.message);
        gasLimit = 500000n;
    }

    // Retry loop
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`[TxBroadcaster] Attempt ${attempt}/${MAX_RETRIES} — MSS=${mss} nonce=${nonce} gas=${gasLimit}`);

            const tx = await controller.processAgentSignal(
                mss, sellTax, buyTax, maxTxAmt, maxWallet, timestamp, nonce, signature,
                { gasLimit }
            );
            console.log(`[TxBroadcaster] TX sent: ${tx.hash}`);

            const receipt = await tx.wait();
            console.log(`[TxBroadcaster] ✅ Confirmed in block ${receipt.blockNumber}`);
            return { txHash: tx.hash, receipt };
        } catch (err) {
            console.error(`[TxBroadcaster] Attempt ${attempt} failed: ${err.message}`);
            if (attempt < MAX_RETRIES) {
                const delay = RETRY_DELAY_MS * attempt;
                console.log(`[TxBroadcaster] Retrying in ${delay / 1000}s...`);
                await sleep(delay);
            } else {
                console.error('[TxBroadcaster] ❌ All retries exhausted');
                throw err;
            }
        }
    }
    return null;
};

module.exports = { broadcastSignal };
