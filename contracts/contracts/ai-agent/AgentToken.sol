// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AgentToken
 * @dev ERC20 ownership token for an AI Agent. Holders receive proportional
 *      revenue distribution via RevenueDistributor. Supply is fixed at mint.
 */
contract AgentToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public immutable maxSupply;
    uint256 public immutable pricePerToken; // in wei (BNB)

    address public revenueDistributor;
    bool public tradingEnabled;

    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);
    event TradingToggled(bool enabled);
    event RevenueDistributorSet(address indexed distributor);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        uint256 pricePerToken_,
        address owner_
    ) ERC20(name_, symbol_) Ownable(owner_) {
        require(totalSupply_ > 0, "Supply must be > 0");
        require(owner_ != address(0), "Owner is zero");
        maxSupply = totalSupply_;
        pricePerToken = pricePerToken_;
        _mint(address(this), totalSupply_); // Held by contract for sale
    }

    /**
     * @dev Purchase agent tokens with BNB.
     */
    function purchase(uint256 amount) external payable nonReentrant {
        require(tradingEnabled, "Trading not enabled");
        require(amount > 0, "Amount must be > 0");
        uint256 cost = (amount * pricePerToken) / 1e18;
        require(msg.value >= cost, "Insufficient BNB");
        require(balanceOf(address(this)) >= amount, "Insufficient supply");

        _transfer(address(this), msg.sender, amount);

        // Refund excess
        if (msg.value > cost) {
            (bool refunded, ) = msg.sender.call{value: msg.value - cost}("");
            require(refunded, "Refund failed");
        }

        emit TokensPurchased(msg.sender, amount, cost);
    }

    function setRevenueDistributor(address _distributor) external onlyOwner {
        require(_distributor != address(0), "Zero address");
        revenueDistributor = _distributor;
        emit RevenueDistributorSet(_distributor);
    }

    function enableTrading() external onlyOwner {
        tradingEnabled = true;
        emit TradingToggled(true);
    }

    function disableTrading() external onlyOwner {
        tradingEnabled = false;
        emit TradingToggled(false);
    }

    /**
     * @dev Withdraw sale proceeds to owner (treasury funding).
     */
    function withdrawProceeds() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "No proceeds");
        (bool sent, ) = owner().call{value: bal}("");
        require(sent, "Withdraw failed");
    }

    receive() external payable {}
}
