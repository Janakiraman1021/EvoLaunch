/**
 * @module ai-agent-engine/strategies/YieldStrategy
 * @desc Interacts with real staking/LP farming protocols on BSC.
 *       - Deposits treasury funds into whitelisted protocols
 *       - Tracks yield accumulation
 *       - Rebalances and withdraws when needed
 *       - Enforces capital allocation limits
 */

const { ethers } = require('ethers');
const config = require('../config');

// Generic staking contract ABI (covers most BSC staking pools)
const STAKING_ABI = [
    'function deposit(uint256 _pid, uint256 _amount) external',
    'function withdraw(uint256 _pid, uint256 _amount) external',
    'function pendingReward(uint256 _pid, address _user) view returns (uint256)',
    'function userInfo(uint256 _pid, address _user) view returns (uint256 amount, uint256 rewardDebt)',
    'function poolLength() view returns (uint256)',
];

// For BNB native staking 
const STAKING_BNB_ABI = [
    'function stake() external payable',
    'function unstake(uint256 amount) external',
    'function getStaked(address user) view returns (uint256)',
    'function earned(address user) view returns (uint256)',
    'function claimReward() external',
];

class YieldStrategy {
    constructor(signer, provider) {
        this.signer = signer;
        this.provider = provider;
        this.activeDeposits = new Map(); // protocol => { amount, depositTime, lastYieldCheck }
        this.totalYieldEarned = 0n;
        this.lastRebalanceTime = Date.now();
    }

    /**
     * Scan whitelisted protocols for best yield opportunity.
     */
    async scanYieldOpportunities() {
        const opportunities = [];
        const whitelisted = config.yield.whitelistedProtocols;

        for (const protocolAddress of whitelisted) {
            try {
                const contract = new ethers.Contract(protocolAddress, STAKING_BNB_ABI, this.provider);
                const signerAddr = await this.signer.getAddress();
                const staked = await contract.getStaked(signerAddr);
                const earned = await contract.earned(signerAddr);

                opportunities.push({
                    protocol: protocolAddress,
                    staked: staked,
                    earned: earned,
                    stakedFormatted: ethers.formatEther(staked),
                    earnedFormatted: ethers.formatEther(earned),
                });
            } catch (err) {
                // Protocol may have different interface, skip
                console.log(`[YieldStrategy] Protocol ${protocolAddress} scan failed: ${err.message}`);
            }
        }

        return opportunities;
    }

    /**
     * Deposit BNB into a staking protocol.
     */
    async deposit(protocolAddress, amount) {
        try {
            const contract = new ethers.Contract(protocolAddress, STAKING_BNB_ABI, this.signer);

            const tx = await contract.stake({ value: amount, gasLimit: 300000 });
            const receipt = await tx.wait();

            // Track deposit
            const existing = this.activeDeposits.get(protocolAddress) || { amount: 0n, depositTime: Date.now(), lastYieldCheck: Date.now() };
            existing.amount += amount;
            existing.depositTime = Date.now();
            this.activeDeposits.set(protocolAddress, existing);

            console.log(`[YieldStrategy] Deposited ${ethers.formatEther(amount)} BNB to ${protocolAddress}`);

            return {
                success: true,
                txHash: receipt.hash,
                amount: amount.toString(),
                protocol: protocolAddress,
                type: 'DEPOSIT',
            };
        } catch (err) {
            console.error('[YieldStrategy] Deposit failed:', err.message);
            return { success: false, error: err.message, type: 'DEPOSIT' };
        }
    }

    /**
     * Withdraw staked funds from a protocol.
     */
    async withdraw(protocolAddress, amount) {
        try {
            const contract = new ethers.Contract(protocolAddress, STAKING_BNB_ABI, this.signer);

            const tx = await contract.unstake(amount, { gasLimit: 300000 });
            const receipt = await tx.wait();

            // Update tracking
            const existing = this.activeDeposits.get(protocolAddress);
            if (existing) {
                existing.amount = existing.amount > amount ? existing.amount - amount : 0n;
                if (existing.amount === 0n) {
                    this.activeDeposits.delete(protocolAddress);
                }
            }

            console.log(`[YieldStrategy] Withdrew ${ethers.formatEther(amount)} BNB from ${protocolAddress}`);

            return {
                success: true,
                txHash: receipt.hash,
                amount: amount.toString(),
                protocol: protocolAddress,
                type: 'WITHDRAW',
            };
        } catch (err) {
            console.error('[YieldStrategy] Withdraw failed:', err.message);
            return { success: false, error: err.message, type: 'WITHDRAW' };
        }
    }

    /**
     * Claim yield rewards from a protocol.
     */
    async claimRewards(protocolAddress) {
        try {
            const contract = new ethers.Contract(protocolAddress, STAKING_BNB_ABI, this.signer);
            const earned = await contract.earned(await this.signer.getAddress());

            if (earned === 0n) {
                return { success: false, reason: 'No rewards to claim' };
            }

            const tx = await contract.claimReward({ gasLimit: 200000 });
            const receipt = await tx.wait();

            this.totalYieldEarned += earned;

            console.log(`[YieldStrategy] Claimed ${ethers.formatEther(earned)} BNB from ${protocolAddress}`);

            return {
                success: true,
                txHash: receipt.hash,
                amount: earned.toString(),
                protocol: protocolAddress,
                type: 'CLAIM',
            };
        } catch (err) {
            console.error('[YieldStrategy] Claim failed:', err.message);
            return { success: false, error: err.message, type: 'CLAIM' };
        }
    }

    /**
     * Full execution cycle: scan → deposit/rebalance → claim.
     */
    async execute(treasuryBalance, riskValidator) {
        const results = [];

        // Check if rebalance is due
        const timeSinceRebalance = Date.now() - this.lastRebalanceTime;
        if (timeSinceRebalance < config.yield.rebalanceIntervalMs) {
            // Just claim any pending rewards
            for (const [protocol] of this.activeDeposits) {
                const claimResult = await this.claimRewards(protocol);
                if (claimResult.success) {
                    results.push(claimResult);
                }
            }

            if (results.length === 0) {
                return { executed: false, reason: 'Not rebalance time yet, no rewards to claim' };
            }

            return { executed: true, results, type: 'CLAIM' };
        }

        this.lastRebalanceTime = Date.now();

        // If no active deposits and we have capital, consider depositing
        if (this.activeDeposits.size === 0 && treasuryBalance > 0n) {
            const whitelisted = config.yield.whitelistedProtocols;
            if (whitelisted.length === 0) {
                return { executed: false, reason: 'No whitelisted protocols configured' };
            }

            // Deposit portion of treasury
            const depositAmount = (treasuryBalance * BigInt(config.defaultRisk.maxCapitalAllocationBps)) / 10000n;

            // Risk validation
            const riskCheck = await riskValidator.preValidate(depositAmount, treasuryBalance);
            if (!riskCheck.allowed) {
                return { executed: false, reason: `Risk blocked: ${riskCheck.reason}` };
            }

            const onChainCheck = await riskValidator.validateOnChain(depositAmount);
            if (!onChainCheck.success) {
                return { executed: false, reason: `On-chain risk failed: ${onChainCheck.error}` };
            }

            const depositResult = await this.deposit(whitelisted[0], depositAmount);
            return { executed: depositResult.success, results: [depositResult], type: 'DEPOSIT' };
        }

        // Claim rewards from active deposits
        for (const [protocol] of this.activeDeposits) {
            const claimResult = await this.claimRewards(protocol);
            if (claimResult.success) {
                results.push(claimResult);
                // Record profit
                await riskValidator.recordExecution(BigInt(claimResult.amount));
            }
        }

        return {
            executed: results.length > 0,
            results,
            type: 'REBALANCE',
            activeDeposits: this.activeDeposits.size,
        };
    }

    getStats() {
        const deposits = [];
        for (const [protocol, data] of this.activeDeposits) {
            deposits.push({
                protocol,
                amount: ethers.formatEther(data.amount),
                depositedAt: new Date(data.depositTime).toISOString(),
            });
        }
        return {
            activeDeposits: deposits,
            totalYieldEarned: ethers.formatEther(this.totalYieldEarned),
        };
    }
}

module.exports = YieldStrategy;
