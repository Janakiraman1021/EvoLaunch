// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentPerformanceTracker
 * @dev On-chain performance logging for an AI agent. Records every execution
 *      result and computes cumulative PnL, ROI, win rate, and execution count.
 */
contract AgentPerformanceTracker is Ownable {
    struct ExecutionRecord {
        uint256 timestamp;
        string strategyType;
        int256 pnl;           // Profit (positive) or loss (negative) in wei
        uint256 capitalUsed;
        string txHash;
    }

    ExecutionRecord[] public executions;

    uint256 public totalExecutions;
    uint256 public winCount;
    uint256 public lossCount;
    int256  public cumulativePnL;
    uint256 public initialCapital;
    uint256 public totalCapitalDeployed;

    address public executor;

    // --- Events ---
    event ExecutionLogged(
        uint256 indexed index,
        string strategyType,
        int256 pnl,
        uint256 capitalUsed,
        uint256 timestamp
    );
    event InitialCapitalSet(uint256 capital);

    modifier onlyExecutor() {
        require(msg.sender == executor || msg.sender == owner(), "Not executor");
        _;
    }

    constructor(address _executor, address _owner) Ownable(_owner) {
        executor = _executor;
    }

    /**
     * @dev Log an execution result.
     */
    function logExecution(
        string calldata strategyType,
        int256 pnl,
        uint256 capitalUsed,
        string calldata txHash
    ) external onlyExecutor {
        executions.push(ExecutionRecord({
            timestamp: block.timestamp,
            strategyType: strategyType,
            pnl: pnl,
            capitalUsed: capitalUsed,
            txHash: txHash
        }));

        totalExecutions++;
        cumulativePnL += pnl;
        totalCapitalDeployed += capitalUsed;

        if (pnl >= 0) {
            winCount++;
        } else {
            lossCount++;
        }

        emit ExecutionLogged(executions.length - 1, strategyType, pnl, capitalUsed, block.timestamp);
    }

    function setInitialCapital(uint256 _capital) external onlyOwner {
        initialCapital = _capital;
        emit InitialCapitalSet(_capital);
    }

    function setExecutor(address _executor) external onlyOwner {
        executor = _executor;
    }

    // --- View Functions ---

    function getROI() external view returns (int256) {
        if (initialCapital == 0) return 0;
        return (cumulativePnL * 10000) / int256(initialCapital); // basis points
    }

    function getWinRate() external view returns (uint256) {
        if (totalExecutions == 0) return 0;
        return (winCount * 10000) / totalExecutions; // basis points
    }

    function getExecutionCount() external view returns (uint256) {
        return executions.length;
    }

    function getRecentExecutions(uint256 count) external view returns (ExecutionRecord[] memory) {
        uint256 len = executions.length;
        if (count > len) count = len;
        ExecutionRecord[] memory recent = new ExecutionRecord[](count);
        for (uint256 i = 0; i < count; i++) {
            recent[i] = executions[len - count + i];
        }
        return recent;
    }
}
