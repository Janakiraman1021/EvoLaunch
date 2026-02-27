/**
 * @module ai-agent-engine/PerformanceReporter
 * @desc Reports execution results on-chain via AgentPerformanceTracker contract.
 */

const { ethers } = require('ethers');

const PERFORMANCE_TRACKER_ABI = [
    'function logExecution(string strategyType, int256 pnl, uint256 capitalUsed, string txHash) external',
    'function getROI() view returns (int256)',
    'function getWinRate() view returns (uint256)',
    'function getExecutionCount() view returns (uint256)',
    'function totalExecutions() view returns (uint256)',
    'function winCount() view returns (uint256)',
    'function lossCount() view returns (uint256)',
    'function cumulativePnL() view returns (int256)',
    'function initialCapital() view returns (uint256)',
    'function totalCapitalDeployed() view returns (uint256)',
    'function getRecentExecutions(uint256 count) view returns (tuple(uint256 timestamp, string strategyType, int256 pnl, uint256 capitalUsed, string txHash)[])',
];

class PerformanceReporter {
    constructor(performanceTrackerAddress, signer) {
        this.contract = new ethers.Contract(performanceTrackerAddress, PERFORMANCE_TRACKER_ABI, signer);
        this.address = performanceTrackerAddress;
    }

    /**
     * Log an execution result on-chain.
     */
    async logExecution(strategyType, pnlWei, capitalUsedWei, txHash) {
        try {
            const tx = await this.contract.logExecution(
                strategyType,
                pnlWei,
                capitalUsedWei,
                txHash || '',
                { gasLimit: 300000 }
            );
            const receipt = await tx.wait();
            console.log(`[PerformanceReporter] Logged execution: ${strategyType}, PnL: ${ethers.formatEther(pnlWei)} BNB`);
            return { success: true, txHash: receipt.hash };
        } catch (err) {
            console.error('[PerformanceReporter] logExecution failed:', err.message);
            return { success: false, error: err.message };
        }
    }

    /**
     * Get full performance summary.
     */
    async getPerformance() {
        try {
            const [roi, winRate, execCount, wins, losses, pnl, initCap, deployed] = await Promise.all([
                this.contract.getROI(),
                this.contract.getWinRate(),
                this.contract.getExecutionCount(),
                this.contract.winCount(),
                this.contract.lossCount(),
                this.contract.cumulativePnL(),
                this.contract.initialCapital(),
                this.contract.totalCapitalDeployed(),
            ]);

            return {
                roiBps: Number(roi),
                roiPercent: (Number(roi) / 100).toFixed(2),
                winRateBps: Number(winRate),
                winRatePercent: (Number(winRate) / 100).toFixed(2),
                totalExecutions: Number(execCount),
                winCount: Number(wins),
                lossCount: Number(losses),
                cumulativePnL: ethers.formatEther(pnl),
                cumulativePnLWei: pnl.toString(),
                initialCapital: ethers.formatEther(initCap),
                totalCapitalDeployed: ethers.formatEther(deployed),
            };
        } catch (err) {
            console.error('[PerformanceReporter] getPerformance failed:', err.message);
            return null;
        }
    }

    /**
     * Get recent execution records.
     */
    async getRecentExecutions(count = 20) {
        try {
            const records = await this.contract.getRecentExecutions(count);
            return records.map(r => ({
                timestamp: Number(r.timestamp),
                strategyType: r.strategyType,
                pnl: ethers.formatEther(r.pnl),
                capitalUsed: ethers.formatEther(r.capitalUsed),
                txHash: r.txHash,
                date: new Date(Number(r.timestamp) * 1000).toISOString(),
            }));
        } catch (err) {
            console.error('[PerformanceReporter] getRecentExecutions failed:', err.message);
            return [];
        }
    }
}

module.exports = PerformanceReporter;
