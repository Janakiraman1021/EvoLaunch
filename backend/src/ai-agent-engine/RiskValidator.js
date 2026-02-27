/**
 * @module ai-agent-engine/RiskValidator
 * @desc Off-chain risk validation layer. Pre-validates all executions
 *       against RiskController contract limits before any capital is deployed.
 */

const { ethers } = require('ethers');
const config = require('./config');

const RISK_CONTROLLER_ABI = [
    'function validateExecution(uint256 amount) external returns (bool)',
    'function recordExecution(int256 pnl) external',
    'function emergencyStop() view returns (bool)',
    'function governanceFreeze() view returns (bool)',
    'function maxCapitalAllocationBps() view returns (uint256)',
    'function maxDailyDeploymentBps() view returns (uint256)',
    'function maxDrawdownBps() view returns (uint256)',
    'function dailyDeployedAmount() view returns (uint256)',
    'function cumulativeLoss() view returns (uint256)',
    'function cumulativeProfit() view returns (uint256)',
    'function getDrawdownPct() view returns (uint256)',
    'function getDailyRemainingBps() view returns (uint256)',
    'function setEmergencyStop(bool) external',
];

class RiskValidator {
    constructor(riskControllerAddress, provider, signer) {
        this.contract = new ethers.Contract(riskControllerAddress, RISK_CONTROLLER_ABI, signer);
        this.provider = provider;
        this.address = riskControllerAddress;
        this.localDailyUsage = 0;
        this.localDailyResetTime = Date.now();
    }

    /**
     * Pre-flight risk check (off-chain). Returns { allowed, reason }.
     */
    async preValidate(amount, treasuryBalance) {
        try {
            // Check emergency stop
            const stopped = await this.contract.emergencyStop();
            if (stopped) return { allowed: false, reason: 'Emergency stop active' };

            // Check governance freeze
            const frozen = await this.contract.governanceFreeze();
            if (frozen) return { allowed: false, reason: 'Governance freeze active' };

            // Check single allocation limit
            const maxAllocBps = await this.contract.maxCapitalAllocationBps();
            const maxSingle = (treasuryBalance * maxAllocBps) / 10000n;
            if (amount > maxSingle) {
                return { allowed: false, reason: `Amount ${ethers.formatEther(amount)} exceeds max allocation ${ethers.formatEther(maxSingle)}` };
            }

            // Check drawdown
            const drawdownPct = await this.contract.getDrawdownPct();
            const maxDrawdown = await this.contract.maxDrawdownBps();
            if (drawdownPct >= maxDrawdown) {
                return { allowed: false, reason: `Drawdown ${drawdownPct}bps >= max ${maxDrawdown}bps` };
            }

            // Check daily remaining
            const dailyRemaining = await this.contract.getDailyRemainingBps();
            const neededBps = treasuryBalance > 0n ? (amount * 10000n) / treasuryBalance : 10001n;
            if (neededBps > dailyRemaining) {
                return { allowed: false, reason: `Daily limit exhausted. Remaining: ${dailyRemaining}bps, needed: ${neededBps}bps` };
            }

            return { allowed: true, reason: 'OK' };
        } catch (err) {
            return { allowed: false, reason: `Risk check failed: ${err.message}` };
        }
    }

    /**
     * On-chain validation (must be called before execution).
     */
    async validateOnChain(amount) {
        try {
            const tx = await this.contract.validateExecution(amount, { gasLimit: 200000 });
            await tx.wait();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /**
     * Record execution result on-chain.
     */
    async recordExecution(pnlWei) {
        try {
            const tx = await this.contract.recordExecution(pnlWei, { gasLimit: 200000 });
            await tx.wait();
            return { success: true, txHash: tx.hash };
        } catch (err) {
            console.error('[RiskValidator] Failed to record execution:', err.message);
            return { success: false, error: err.message };
        }
    }

    /**
     * Trigger emergency stop.
     */
    async triggerEmergencyStop() {
        try {
            const tx = await this.contract.setEmergencyStop(true, { gasLimit: 100000 });
            await tx.wait();
            console.log('[RiskValidator] Emergency stop activated');
            return true;
        } catch (err) {
            console.error('[RiskValidator] Failed to set emergency stop:', err.message);
            return false;
        }
    }

    async getStatus() {
        const [stopped, frozen, drawdown, dailyRemaining] = await Promise.all([
            this.contract.emergencyStop(),
            this.contract.governanceFreeze(),
            this.contract.getDrawdownPct(),
            this.contract.getDailyRemainingBps(),
        ]);
        return {
            emergencyStop: stopped,
            governanceFreeze: frozen,
            drawdownBps: Number(drawdown),
            dailyRemainingBps: Number(dailyRemaining),
        };
    }
}

module.exports = RiskValidator;
