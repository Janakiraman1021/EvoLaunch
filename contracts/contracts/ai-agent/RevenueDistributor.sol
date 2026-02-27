// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title RevenueDistributor
 * @dev Distributes BNB revenue to AgentToken holders proportionally.
 *      Revenue is deposited by the treasury, then claimed by token holders.
 */
contract RevenueDistributor is Ownable, ReentrancyGuard {
    IERC20 public agentToken;

    uint256 public totalRevenueDeposited;
    uint256 public totalRevenueClaimed;
    uint256 public currentEpoch;

    struct Epoch {
        uint256 totalRevenue;
        uint256 totalSupplySnapshot;
        uint256 timestamp;
    }

    mapping(uint256 => Epoch) public epochs;
    mapping(address => uint256) public lastClaimedEpoch;
    mapping(address => uint256) public totalClaimed;

    // --- Events ---
    event RevenueDeposited(uint256 indexed epoch, uint256 amount, uint256 totalSupply);
    event RevenueClaimed(address indexed holder, uint256 amount, uint256 fromEpoch, uint256 toEpoch);

    constructor(address _agentToken, address _owner) Ownable(_owner) {
        require(_agentToken != address(0), "Token zero");
        agentToken = IERC20(_agentToken);
    }

    /**
     * @dev Deposit revenue for distribution. Creates a new epoch.
     */
    function depositRevenue() external payable {
        require(msg.value > 0, "Zero revenue");
        uint256 supply = agentToken.totalSupply();
        require(supply > 0, "No token supply");

        epochs[currentEpoch] = Epoch({
            totalRevenue: msg.value,
            totalSupplySnapshot: supply,
            timestamp: block.timestamp
        });

        totalRevenueDeposited += msg.value;
        emit RevenueDeposited(currentEpoch, msg.value, supply);
        currentEpoch++;
    }

    /**
     * @dev Claim accumulated revenue across all unclaimed epochs.
     */
    function claimRevenue() external nonReentrant {
        uint256 holderBalance = agentToken.balanceOf(msg.sender);
        require(holderBalance > 0, "No tokens held");

        uint256 startEpoch = lastClaimedEpoch[msg.sender];
        require(startEpoch < currentEpoch, "No unclaimed revenue");

        uint256 totalOwed = 0;
        for (uint256 i = startEpoch; i < currentEpoch; i++) {
            Epoch memory ep = epochs[i];
            if (ep.totalSupplySnapshot > 0) {
                totalOwed += (ep.totalRevenue * holderBalance) / ep.totalSupplySnapshot;
            }
        }

        require(totalOwed > 0, "Nothing to claim");
        require(address(this).balance >= totalOwed, "Insufficient balance");

        lastClaimedEpoch[msg.sender] = currentEpoch;
        totalClaimed[msg.sender] += totalOwed;
        totalRevenueClaimed += totalOwed;

        (bool sent, ) = msg.sender.call{value: totalOwed}("");
        require(sent, "Transfer failed");

        emit RevenueClaimed(msg.sender, totalOwed, startEpoch, currentEpoch);
    }

    /**
     * @dev View claimable revenue for a holder.
     */
    function getClaimable(address holder) external view returns (uint256) {
        uint256 holderBalance = agentToken.balanceOf(holder);
        if (holderBalance == 0) return 0;

        uint256 startEpoch = lastClaimedEpoch[holder];
        uint256 totalOwed = 0;
        for (uint256 i = startEpoch; i < currentEpoch; i++) {
            Epoch memory ep = epochs[i];
            if (ep.totalSupplySnapshot > 0) {
                totalOwed += (ep.totalRevenue * holderBalance) / ep.totalSupplySnapshot;
            }
        }
        return totalOwed;
    }

    function getEpochCount() external view returns (uint256) {
        return currentEpoch;
    }

    receive() external payable {}
}
