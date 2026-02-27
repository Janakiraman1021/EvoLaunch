// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RiskController
 * @dev Enforces risk limits for an AI Agent's treasury operations.
 *      Every strategy execution must pass validateExecution() before
 *      any capital is deployed from the treasury.
 */
contract RiskController is Ownable, ReentrancyGuard {
    // --- Risk Parameters (basis points, 10000 = 100%) ---
    uint256 public maxCapitalAllocationBps;  // Max % of treasury per single execution
    uint256 public maxDailyDeploymentBps;    // Max % of treasury deployable per day
    uint256 public maxDrawdownBps;           // Max cumulative loss before emergency stop

    // --- State ---
    bool public emergencyStop;
    bool public governanceFreeze;

    uint256 public dailyDeployedAmount;
    uint256 public dailyResetTimestamp;
    uint256 public cumulativeLoss;
    uint256 public cumulativeProfit;
    uint256 public initialCapital;

    address public treasury;
    address public executor;  // Backend execution wallet

    // --- Events ---
    event ExecutionValidated(uint256 amount, uint256 dailyTotal, uint256 timestamp);
    event ExecutionRecorded(int256 pnl, uint256 cumulativeProfit, uint256 cumulativeLoss);
    event EmergencyStopToggled(bool stopped);
    event GovernanceFreezeToggled(bool frozen);
    event RiskParamsUpdated(uint256 maxAlloc, uint256 maxDaily, uint256 maxDrawdown);
    event ExecutorUpdated(address indexed newExecutor);

    modifier notStopped() {
        require(!emergencyStop, "Emergency stop active");
        require(!governanceFreeze, "Governance freeze active");
        _;
    }

    modifier onlyExecutor() {
        require(msg.sender == executor || msg.sender == owner(), "Not executor");
        _;
    }

    constructor(
        address _treasury,
        address _executor,
        uint256 _maxCapitalBps,
        uint256 _maxDailyBps,
        uint256 _maxDrawdownBps,
        address _owner
    ) Ownable(_owner) {
        require(_treasury != address(0), "Treasury zero");
        require(_maxCapitalBps <= 10000, "Alloc > 100%");
        require(_maxDailyBps <= 10000, "Daily > 100%");
        require(_maxDrawdownBps <= 10000, "Drawdown > 100%");

        treasury = _treasury;
        executor = _executor;
        maxCapitalAllocationBps = _maxCapitalBps;
        maxDailyDeploymentBps = _maxDailyBps;
        maxDrawdownBps = _maxDrawdownBps;
        dailyResetTimestamp = block.timestamp;
    }

    /**
     * @dev Must be called before any strategy execution. Validates amount
     *      against risk parameters.
     */
    function validateExecution(uint256 amount) external onlyExecutor notStopped returns (bool) {
        uint256 treasuryBalance = treasury.balance;
        require(treasuryBalance > 0, "Treasury empty");

        // Check single-execution capital limit
        uint256 maxSingleAmount = (treasuryBalance * maxCapitalAllocationBps) / 10000;
        require(amount <= maxSingleAmount, "Exceeds max capital allocation");

        // Reset daily counter if new day
        if (block.timestamp >= dailyResetTimestamp + 1 days) {
            dailyDeployedAmount = 0;
            dailyResetTimestamp = block.timestamp;
        }

        // Check daily deployment limit
        uint256 maxDailyAmount = (treasuryBalance * maxDailyDeploymentBps) / 10000;
        require(dailyDeployedAmount + amount <= maxDailyAmount, "Exceeds daily deployment limit");

        // Check drawdown limit
        if (cumulativeLoss > cumulativeProfit) {
            uint256 netLoss = cumulativeLoss - cumulativeProfit;
            uint256 cap = initialCapital > 0 ? initialCapital : treasuryBalance + netLoss;
            uint256 maxLoss = (cap * maxDrawdownBps) / 10000;
            require(netLoss < maxLoss, "Max drawdown reached");
        }

        // Record deployment
        dailyDeployedAmount += amount;

        emit ExecutionValidated(amount, dailyDeployedAmount, block.timestamp);
        return true;
    }

    /**
     * @dev Record execution result (profit or loss).
     */
    function recordExecution(int256 pnl) external onlyExecutor {
        if (pnl >= 0) {
            cumulativeProfit += uint256(pnl);
        } else {
            cumulativeLoss += uint256(-pnl);
            // Auto-stop if drawdown exceeded
            if (initialCapital > 0) {
                uint256 netLoss = cumulativeLoss > cumulativeProfit ? cumulativeLoss - cumulativeProfit : 0;
                uint256 maxLoss = (initialCapital * maxDrawdownBps) / 10000;
                if (netLoss >= maxLoss) {
                    emergencyStop = true;
                    emit EmergencyStopToggled(true);
                }
            }
        }
        emit ExecutionRecorded(pnl, cumulativeProfit, cumulativeLoss);
    }

    function setInitialCapital(uint256 _capital) external onlyOwner {
        initialCapital = _capital;
    }

    function setEmergencyStop(bool _stop) external onlyOwner {
        emergencyStop = _stop;
        emit EmergencyStopToggled(_stop);
    }

    function setGovernanceFreeze(bool _freeze) external onlyOwner {
        governanceFreeze = _freeze;
        emit GovernanceFreezeToggled(_freeze);
    }

    function updateRiskParams(
        uint256 _maxCapitalBps,
        uint256 _maxDailyBps,
        uint256 _maxDrawdownBps
    ) external onlyOwner {
        require(_maxCapitalBps <= 10000 && _maxDailyBps <= 10000 && _maxDrawdownBps <= 10000, "Invalid bps");
        maxCapitalAllocationBps = _maxCapitalBps;
        maxDailyDeploymentBps = _maxDailyBps;
        maxDrawdownBps = _maxDrawdownBps;
        emit RiskParamsUpdated(_maxCapitalBps, _maxDailyBps, _maxDrawdownBps);
    }

    function setExecutor(address _executor) external onlyOwner {
        executor = _executor;
        emit ExecutorUpdated(_executor);
    }

    function getDrawdownPct() external view returns (uint256) {
        if (initialCapital == 0) return 0;
        if (cumulativeLoss <= cumulativeProfit) return 0;
        return ((cumulativeLoss - cumulativeProfit) * 10000) / initialCapital;
    }

    function getDailyRemainingBps() external view returns (uint256) {
        if (block.timestamp >= dailyResetTimestamp + 1 days) {
            return maxDailyDeploymentBps;
        }
        uint256 treasuryBalance = treasury.balance;
        if (treasuryBalance == 0) return 0;
        uint256 maxDailyAmount = (treasuryBalance * maxDailyDeploymentBps) / 10000;
        if (dailyDeployedAmount >= maxDailyAmount) return 0;
        return ((maxDailyAmount - dailyDeployedAmount) * 10000) / treasuryBalance;
    }
}
