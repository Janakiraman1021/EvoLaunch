/**
 * @module reputationService
 * @dev Computes and stores wallet reputation scores based on on-chain history.
 *      Periodically rescores all tracked wallets.
 */

const { provider } = require('./blockchain');
const Reputation = require('../models/Reputation');
const { ethers } = require('ethers');
const dotenv = require('dotenv');
dotenv.config();

const TOKEN_ABI = [
    'event Transfer(address indexed from, address indexed to, uint256 value)'
];

const BLOCKS_TO_SCAN = 5000; // ~4 hours on BSC

/**
 * Computes reputation for a single wallet by analyzing its Transfer history.
 */
const computeReputation = async (walletAddress, tokenAddress) => {
    try {
        const token = new ethers.Contract(tokenAddress, TOKEN_ABI, provider);
        const latestBlock = await provider.getBlockNumber();
        const fromBlock = Math.max(0, latestBlock - BLOCKS_TO_SCAN);

        // Get all transfers involving this wallet
        const sentFilter = token.filters.Transfer(walletAddress, null);
        const recvFilter = token.filters.Transfer(null, walletAddress);

        const [sentEvents, recvEvents] = await Promise.all([
            token.queryFilter(sentFilter, fromBlock, latestBlock),
            token.queryFilter(recvFilter, fromBlock, latestBlock)
        ]);

        // --- Compute metrics ---
        let holdingHours = 0;
        let dumpCount = 0;
        let botSuspect = false;

        if (recvEvents.length > 0 && sentEvents.length > 0) {
            // Average hold time between receive and matching send
            const firstReceive = recvEvents[0].blockNumber;
            const firstSend = sentEvents[0].blockNumber;
            holdingHours = Math.max(0, (firstSend - firstReceive) * 3) / 3600; // ~3s per BSC block
        }

        // Sell events shortly after buy = dump behavior
        dumpCount = sentEvents.filter(ev => {
            const recv = recvEvents.find(r => r.blockNumber < ev.blockNumber);
            return recv && (ev.blockNumber - recv.blockNumber) < 20; // Sold within ~60s
        }).length;

        // Bot suspect: more than 5 txs in same block
        const blockCounts = {};
        for (const ev of [...sentEvents, ...recvEvents]) {
            blockCounts[ev.blockNumber] = (blockCounts[ev.blockNumber] || 0) + 1;
        }
        botSuspect = Object.values(blockCounts).some(c => c >= 5);

        // --- Score computation ---
        let score = 50;
        if (holdingHours > 72) score += 30;
        else if (holdingHours > 24) score += 15;
        else if (holdingHours > 1) score += 5;

        score -= dumpCount * 10;
        if (botSuspect) score -= 40;

        score = Math.max(0, Math.min(100, score));

        await Reputation.findOneAndUpdate(
            { walletAddress: walletAddress.toLowerCase() },
            {
                walletAddress: walletAddress.toLowerCase(),
                score,
                allocationWeight: score / 100,
                holdingHours: Math.round(holdingHours),
                dumpCount,
                isBotSuspect: botSuspect
            },
            { upsert: true, new: true }
        );

        return score;
    } catch (err) {
        console.error(`[ReputationService] Error for ${walletAddress}:`, err.message);
        return null;
    }
};

/**
 * Periodically rescores all wallets in the Reputation collection.
 */
const startReputationRecalculation = (tokenAddress, intervalMs = 3600000) => {
    const recalcAll = async () => {
        console.log('[ReputationService] Running batch reputation recalculation...');
        try {
            const wallets = await Reputation.find({}, 'walletAddress').lean();
            for (const w of wallets) {
                await computeReputation(w.walletAddress, tokenAddress);
            }
            console.log(`[ReputationService] Recalculated ${wallets.length} wallets`);
        } catch (err) {
            console.error('[ReputationService] Batch error:', err.message);
        }
    };
    recalcAll();
    setInterval(recalcAll, intervalMs);
};

module.exports = { computeReputation, startReputationRecalculation };
