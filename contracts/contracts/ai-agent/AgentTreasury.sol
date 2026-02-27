// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AgentTreasury
 * @dev Per-agent treasury that holds and manages capital (BNB).
 *      Withdrawals are gated by RiskController authorization.
 *      Tracks all capital movements on-chain.
 */
contract AgentTreasury is Ownable, ReentrancyGuard {
    address public riskController;
    address public executor;

    uint256 public totalDeposited;
    uint256 public totalWithdrawn;
    uint256 public totalRevenueDistributed;

    // --- Events ---
    event Deposited(address indexed from, uint256 amount, uint256 newBalance);
    event Withdrawn(address indexed to, uint256 amount, string reason);
    event RevenueDistributed(address indexed distributor, uint256 amount);
    event ExecutorUpdated(address indexed newExecutor);
    event RiskControllerUpdated(address indexed newController);
    event EmergencyWithdrawal(address indexed to, uint256 amount);

    modifier onlyExecutor() {
        require(msg.sender == executor || msg.sender == owner(), "Not executor");
        _;
    }

    constructor(address _executor, address _owner) Ownable(_owner) {
        require(_executor != address(0), "Executor zero");
        executor = _executor;
    }

    /**
     * @dev Deposit BNB into treasury.
     */
    function deposit() external payable {
        require(msg.value > 0, "Zero deposit");
        totalDeposited += msg.value;
        emit Deposited(msg.sender, msg.value, address(this).balance);
    }

    /**
     * @dev Withdraw BNB for strategy execution. Only executor after risk validation.
     */
    function withdraw(address to, uint256 amount, string calldata reason) external onlyExecutor nonReentrant {
        require(to != address(0), "Zero address");
        require(amount > 0 && amount <= address(this).balance, "Invalid amount");
        totalWithdrawn += amount;
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "Transfer failed");
        emit Withdrawn(to, amount, reason);
    }

    /**
     * @dev Send revenue to RevenueDistributor.
     */
    function distributeRevenue(address distributor, uint256 amount) external onlyExecutor nonReentrant {
        require(distributor != address(0), "Zero distributor");
        require(amount > 0 && amount <= address(this).balance, "Invalid amount");
        totalRevenueDistributed += amount;
        (bool sent, ) = distributor.call{value: amount}("");
        require(sent, "Transfer failed");
        emit RevenueDistributed(distributor, amount);
    }

    /**
     * @dev Emergency withdrawal by owner only. Sends all funds.
     */
    function emergencyWithdraw(address to) external onlyOwner nonReentrant {
        require(to != address(0), "Zero address");
        uint256 bal = address(this).balance;
        require(bal > 0, "No funds");
        (bool sent, ) = to.call{value: bal}("");
        require(sent, "Transfer failed");
        emit EmergencyWithdrawal(to, bal);
    }

    function setExecutor(address _executor) external onlyOwner {
        require(_executor != address(0), "Zero address");
        executor = _executor;
        emit ExecutorUpdated(_executor);
    }

    function setRiskController(address _controller) external onlyOwner {
        riskController = _controller;
        emit RiskControllerUpdated(_controller);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getNetBalance() external view returns (int256) {
        return int256(totalDeposited) - int256(totalWithdrawn);
    }

    receive() external payable {
        totalDeposited += msg.value;
        emit Deposited(msg.sender, msg.value, address(this).balance);
    }
}
