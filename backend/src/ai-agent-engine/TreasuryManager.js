/**
 * @module ai-agent-engine/TreasuryManager
 * @desc Manages treasury interactions for an AI agent.
 *       Deposits, withdrawals, revenue routing, and balance queries.
 */

const { ethers } = require('ethers');

const TREASURY_ABI = [
    'function deposit() external payable',
    'function withdraw(address to, uint256 amount, string reason) external',
    'function distributeRevenue(address distributor, uint256 amount) external',
    'function emergencyWithdraw(address to) external',
    'function getBalance() view returns (uint256)',
    'function totalDeposited() view returns (uint256)',
    'function totalWithdrawn() view returns (uint256)',
    'function totalRevenueDistributed() view returns (uint256)',
];

const REVENUE_DISTRIBUTOR_ABI = [
    'function depositRevenue() external payable',
    'function getClaimable(address) view returns (uint256)',
    'function currentEpoch() view returns (uint256)',
    'function totalRevenueDeposited() view returns (uint256)',
    'function totalRevenueClaimed() view returns (uint256)',
];

class TreasuryManager {
    constructor(treasuryAddress, revenueDistributorAddress, signer) {
        this.treasury = new ethers.Contract(treasuryAddress, TREASURY_ABI, signer);
        this.revenueDistributor = new ethers.Contract(revenueDistributorAddress, REVENUE_DISTRIBUTOR_ABI, signer);
        this.signer = signer;
        this.treasuryAddress = treasuryAddress;
        this.distributorAddress = revenueDistributorAddress;
    }

    /**
     * Get treasury BNB balance.
     */
    async getBalance() {
        try {
            const bal = await this.treasury.getBalance();
            return bal;
        } catch (err) {
            console.error('[TreasuryManager] getBalance failed:', err.message);
            return 0n;
        }
    }

    /**
     * Get full treasury stats.
     */
    async getStats() {
        try {
            const [balance, deposited, withdrawn, distributed] = await Promise.all([
                this.treasury.getBalance(),
                this.treasury.totalDeposited(),
                this.treasury.totalWithdrawn(),
                this.treasury.totalRevenueDistributed(),
            ]);
            return {
                balance: ethers.formatEther(balance),
                balanceWei: balance.toString(),
                totalDeposited: ethers.formatEther(deposited),
                totalWithdrawn: ethers.formatEther(withdrawn),
                totalRevenueDistributed: ethers.formatEther(distributed),
            };
        } catch (err) {
            console.error('[TreasuryManager] getStats failed:', err.message);
            return null;
        }
    }

    /**
     * Withdraw BNB from treasury for strategy execution.
     */
    async withdraw(toAddress, amount, reason) {
        try {
            const tx = await this.treasury.withdraw(toAddress, amount, reason, { gasLimit: 200000 });
            const receipt = await tx.wait();
            console.log(`[TreasuryManager] Withdrew ${ethers.formatEther(amount)} BNB. TX: ${receipt.hash}`);
            return { success: true, txHash: receipt.hash };
        } catch (err) {
            console.error('[TreasuryManager] Withdraw failed:', err.message);
            return { success: false, error: err.message };
        }
    }

    /**
     * Deposit BNB into treasury.
     */
    async deposit(amount) {
        try {
            const tx = await this.treasury.deposit({ value: amount, gasLimit: 100000 });
            const receipt = await tx.wait();
            console.log(`[TreasuryManager] Deposited ${ethers.formatEther(amount)} BNB. TX: ${receipt.hash}`);
            return { success: true, txHash: receipt.hash };
        } catch (err) {
            console.error('[TreasuryManager] Deposit failed:', err.message);
            return { success: false, error: err.message };
        }
    }

    /**
     * Route profits to RevenueDistributor for token holder distribution.
     */
    async routeRevenue(amount) {
        try {
            // First: treasury sends BNB to distributor via distributeRevenue
            const tx1 = await this.treasury.distributeRevenue(this.distributorAddress, amount, { gasLimit: 200000 });
            await tx1.wait();

            // Second: call depositRevenue on distributor to create epoch
            const tx2 = await this.revenueDistributor.depositRevenue({ value: amount, gasLimit: 200000 });
            await tx2.wait();

            console.log(`[TreasuryManager] Routed ${ethers.formatEther(amount)} BNB to revenue distributor`);
            return { success: true, txHash: tx2.hash };
        } catch (err) {
            console.error('[TreasuryManager] routeRevenue failed:', err.message);
            return { success: false, error: err.message };
        }
    }

    /**
     * Get revenue distribution stats.
     */
    async getRevenueStats() {
        try {
            const [epoch, totalDeposited, totalClaimed] = await Promise.all([
                this.revenueDistributor.currentEpoch(),
                this.revenueDistributor.totalRevenueDeposited(),
                this.revenueDistributor.totalRevenueClaimed(),
            ]);
            return {
                currentEpoch: Number(epoch),
                totalRevenueDeposited: ethers.formatEther(totalDeposited),
                totalRevenueClaimed: ethers.formatEther(totalClaimed),
            };
        } catch (err) {
            console.error('[TreasuryManager] getRevenueStats failed:', err.message);
            return null;
        }
    }
}

module.exports = TreasuryManager;
