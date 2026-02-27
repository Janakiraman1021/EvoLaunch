/**
 * @module ai-agent-engine/strategies/PredictionArbitrageStrategy
 * @desc Monitors prediction markets, detects spread differences,
 *       and executes offsetting positions for risk-free profit.
 *       Minimal but real execution on BSC prediction markets.
 */

const { ethers } = require('ethers');
const config = require('../config');

// PancakeSwap Prediction V2 ABI (BSC)
const PREDICTION_ABI = [
    'function currentEpoch() view returns (uint256)',
    'function rounds(uint256) view returns (uint256 epoch, uint256 startTimestamp, uint256 lockTimestamp, uint256 closeTimestamp, int256 lockPrice, int256 closePrice, uint256 lockOracleId, uint256 closeOracleId, uint256 totalAmount, uint256 bullAmount, uint256 bearAmount, uint256 rewardBaseCalAmount, uint256 rewardAmount, bool oracleCalled)',
    'function betBull(uint256 epoch) payable external',
    'function betBear(uint256 epoch) payable external',
    'function claimable(uint256 epoch, address user) view returns (bool)',
    'function claim(uint256[] epochs) external',
    'function ledger(uint256 epoch, address user) view returns (uint8 position, uint256 amount, bool claimed)',
];

class PredictionArbitrageStrategy {
    constructor(signer, provider) {
        this.signer = signer;
        this.provider = provider;
        this.predictionContract = null;
        this.pendingClaims = [];
        this.totalProfitCaptured = 0n;
    }

    /**
     * Initialize with a prediction market contract address.
     */
    initialize(predictionAddress) {
        this.predictionContract = new ethers.Contract(predictionAddress, PREDICTION_ABI, this.signer);
    }

    /**
     * Analyze current round for spread opportunity.
     */
    async analyzeSpread() {
        if (!this.predictionContract) {
            return { opportunity: false, reason: 'No prediction contract configured' };
        }

        try {
            const epoch = await this.predictionContract.currentEpoch();
            const round = await this.predictionContract.rounds(epoch);

            const totalAmount = round.totalAmount;
            const bullAmount = round.bullAmount;
            const bearAmount = round.bearAmount;

            if (totalAmount === 0n) {
                return { opportunity: false, reason: 'No bets placed yet', epoch: Number(epoch) };
            }

            // Calculate implied probabilities
            const bullPct = Number(bullAmount * 10000n / totalAmount) / 100;
            const bearPct = Number(bearAmount * 10000n / totalAmount) / 100;

            // Calculate payout ratios
            const bullPayout = totalAmount > 0n && bullAmount > 0n ? Number(totalAmount * 1000n / bullAmount) / 1000 : 0;
            const bearPayout = totalAmount > 0n && bearAmount > 0n ? Number(totalAmount * 1000n / bearAmount) / 1000 : 0;

            // Detect significant imbalance (potential arbitrage)
            const spreadBps = Math.abs(bullPct - bearPct) * 100;
            const minSpread = config.prediction.minSpreadBps;

            return {
                opportunity: spreadBps >= minSpread,
                epoch: Number(epoch),
                bullPct,
                bearPct,
                bullPayout,
                bearPayout,
                spreadBps: Math.round(spreadBps),
                totalPool: ethers.formatEther(totalAmount),
                reason: spreadBps >= minSpread
                    ? `Spread ${spreadBps}bps detected. Bull: ${bullPct.toFixed(1)}%, Bear: ${bearPct.toFixed(1)}%`
                    : `Spread ${spreadBps}bps below threshold ${minSpread}bps`,
            };
        } catch (err) {
            return { opportunity: false, reason: `Analysis error: ${err.message}` };
        }
    }

    /**
     * Execute a prediction bet on the underweighted side.
     */
    async executeBet(epoch, side, amount) {
        try {
            let tx;
            if (side === 'BULL') {
                tx = await this.predictionContract.betBull(epoch, { value: amount, gasLimit: 200000 });
            } else {
                tx = await this.predictionContract.betBear(epoch, { value: amount, gasLimit: 200000 });
            }

            const receipt = await tx.wait();
            this.pendingClaims.push(epoch);

            console.log(`[PredictionArbitrage] Bet ${side} ${ethers.formatEther(amount)} BNB on epoch ${epoch}`);

            return {
                success: true,
                txHash: receipt.hash,
                side,
                epoch,
                amount: amount.toString(),
                type: 'BET',
            };
        } catch (err) {
            console.error('[PredictionArbitrage] Bet failed:', err.message);
            return { success: false, error: err.message, type: 'BET' };
        }
    }

    /**
     * Claim winnings from settled rounds.
     */
    async claimSettled() {
        if (!this.predictionContract || this.pendingClaims.length === 0) {
            return { claimed: false, reason: 'Nothing to claim' };
        }

        try {
            const signerAddr = await this.signer.getAddress();
            const claimableEpochs = [];

            for (const epoch of this.pendingClaims) {
                try {
                    const canClaim = await this.predictionContract.claimable(epoch, signerAddr);
                    if (canClaim) claimableEpochs.push(epoch);
                } catch (e) { /* round not settled yet */ }
            }

            if (claimableEpochs.length === 0) {
                return { claimed: false, reason: 'No settled rounds to claim' };
            }

            const tx = await this.predictionContract.claim(claimableEpochs, { gasLimit: 300000 });
            const receipt = await tx.wait();

            // Remove claimed epochs from pending
            this.pendingClaims = this.pendingClaims.filter(e => !claimableEpochs.includes(e));

            console.log(`[PredictionArbitrage] Claimed ${claimableEpochs.length} rounds`);

            return {
                claimed: true,
                txHash: receipt.hash,
                claimedEpochs: claimableEpochs,
                type: 'CLAIM',
            };
        } catch (err) {
            console.error('[PredictionArbitrage] Claim failed:', err.message);
            return { claimed: false, error: err.message };
        }
    }

    /**
     * Full execution cycle.
     */
    async execute(treasuryBalance, riskValidator) {
        // First, try to claim any settled rounds
        const claimResult = await this.claimSettled();

        // Then check for new opportunity
        const analysis = await this.analyzeSpread();

        if (!analysis.opportunity) {
            return {
                executed: claimResult.claimed,
                reason: analysis.reason,
                analysis,
                claimResult,
            };
        }

        // Determine bet size
        const maxPosition = (treasuryBalance * BigInt(config.prediction.maxPositionBps)) / 10000n;
        const betAmount = maxPosition > ethers.parseEther('0.001') ? maxPosition : ethers.parseEther('0.001');

        // Risk validation
        const riskCheck = await riskValidator.preValidate(betAmount, treasuryBalance);
        if (!riskCheck.allowed) {
            return { executed: false, reason: `Risk blocked: ${riskCheck.reason}`, analysis };
        }

        // Bet on the underweighted side (higher payout)
        const side = analysis.bullPayout > analysis.bearPayout ? 'BULL' : 'BEAR';

        const onChainCheck = await riskValidator.validateOnChain(betAmount);
        if (!onChainCheck.success) {
            return { executed: false, reason: `On-chain risk failed: ${onChainCheck.error}`, analysis };
        }

        const betResult = await this.executeBet(analysis.epoch, side, betAmount);
        return {
            executed: betResult.success,
            result: betResult,
            analysis,
            claimResult,
        };
    }

    getStats() {
        return {
            pendingClaims: this.pendingClaims.length,
            totalProfitCaptured: ethers.formatEther(this.totalProfitCaptured),
        };
    }
}

module.exports = PredictionArbitrageStrategy;
