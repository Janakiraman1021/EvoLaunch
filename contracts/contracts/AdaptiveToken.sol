// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AdaptiveToken
 * @dev ERC20 token with dynamic taxes and transaction limits controlled by EvoLaunch protocol.
 */
contract AdaptiveToken is ERC20, AccessControl, ReentrancyGuard {
    bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");

    // Dynamic Parameters
    uint256 public sellTax; // in basis points (100 = 1%)
    uint256 public buyTax;  // in basis points
    uint256 public maxTxAmount;
    uint256 public maxWalletSize;

    // Immutable Bounds (defined at launch)
    uint256 public immutable minTax;
    uint256 public immutable maxTax;
    uint256 public immutable minMaxTxAmount;
    uint256 public immutable minMaxWalletSize;

    address public feeCollector;
    address public ammPair;
    bool public limitsEnabled = true;

    mapping(address => bool) public isExcludedFromFees;
    mapping(address => bool) public isExcludedFromLimits;

    event ParametersUpdated(uint256 sellTax, uint256 buyTax, uint256 maxTxAmount, uint256 maxWalletSize);
    event FeeCollectorUpdated(address indexed newCollector);
    event AMMPairUpdated(address indexed pair);

    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply_,
        uint256 initialSellTax,
        uint256 initialBuyTax,
        uint256 initialMaxTx,
        uint256 initialMaxWallet,
        uint256 minTax_,
        uint256 maxTax_,
        uint256 minMaxTx_,
        uint256 minMaxWallet_,
        address initialFeeCollector,
        address admin
    ) ERC20(name, symbol) {
        require(initialFeeCollector != address(0), "Fee collector is zero");
        require(admin != address(0), "Admin is zero");
        require(totalSupply_ > 0, "Total supply is zero");
        require(minTax_ <= maxTax_, "minTax > maxTax");
        require(minMaxTx_ <= initialMaxTx, "minMaxTx > initialMaxTx");
        require(minMaxWallet_ <= initialMaxWallet, "minMaxWallet > initialMaxWallet");

        feeCollector = initialFeeCollector;

        isExcludedFromFees[admin] = true;
        isExcludedFromFees[address(this)] = true;
        isExcludedFromFees[initialFeeCollector] = true;

        isExcludedFromLimits[admin] = true;
        isExcludedFromLimits[address(this)] = true;
        isExcludedFromLimits[initialFeeCollector] = true;

        minTax = minTax_;
        maxTax = maxTax_;
        minMaxTxAmount = minMaxTx_;
        minMaxWalletSize = minMaxWallet_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _mint(admin, totalSupply_);

        sellTax = initialSellTax;
        buyTax = initialBuyTax;
        maxTxAmount = initialMaxTx;
        maxWalletSize = initialMaxWallet;
    }

    function setAMMPair(address pair) external onlyRole(DEFAULT_ADMIN_ROLE) {
        ammPair = pair;
        isExcludedFromLimits[pair] = true;
        emit AMMPairUpdated(pair);
    }

    function updateParameters(
        uint256 _sellTax,
        uint256 _buyTax,
        uint256 _maxTxAmount,
        uint256 _maxWalletSize
    ) external onlyRole(CONTROLLER_ROLE) {
        require(_sellTax >= minTax && _sellTax <= maxTax, "Sell tax out of bounds");
        require(_buyTax >= minTax && _buyTax <= maxTax, "Buy tax out of bounds");
        require(_maxTxAmount >= minMaxTxAmount, "Max TX too low");
        require(_maxWalletSize >= minMaxWalletSize, "Max Wallet too low");

        sellTax = _sellTax;
        buyTax = _buyTax;
        maxTxAmount = _maxTxAmount;
        maxWalletSize = _maxWalletSize;

        emit ParametersUpdated(sellTax, buyTax, maxTxAmount, maxWalletSize);
    }

    function setExcludedFromFees(address account, bool excluded) external onlyRole(DEFAULT_ADMIN_ROLE) {
        isExcludedFromFees[account] = excluded;
    }

    function setExcludedFromLimits(address account, bool excluded) external onlyRole(DEFAULT_ADMIN_ROLE) {
        isExcludedFromLimits[account] = excluded;
    }

    function _isBuyTaxable(address from, uint256 taxRate) internal view returns (bool) {
        return from == ammPair && taxRate > 0;
    }

    function _isSellTaxable(address to, uint256 taxRate) internal view returns (bool) {
        return to == ammPair && taxRate > 0;
    }

    function _calculateTax(
        address from,
        address to,
        uint256 value
    ) internal view returns (uint256) {
        if (isExcludedFromFees[from] || isExcludedFromFees[to]) {
            return 0;
        }

        if (_isBuyTaxable(from, buyTax)) {
            return (value * buyTax) / 10000;
        }

        if (_isSellTaxable(to, sellTax)) {
            return (value * sellTax) / 10000;
        }

        return 0;
    }

    function _isLimitsApplicable(address from, address to) internal view returns (bool) {
        return limitsEnabled && !isExcludedFromLimits[from] && !isExcludedFromLimits[to];
    }

    function _checkTxLimit(uint256 value) internal view {
        require(value <= maxTxAmount, "Transfer amount exceeds maxTxAmount");
    }

    function _checkWalletLimit(address to, uint256 value) internal view {
        if (to != ammPair) {
            require(balanceOf(to) + value <= maxWalletSize, "Transfer amount exceeds maxWalletSize");
        }
    }

    function _checkLimits(
        address from,
        address to,
        uint256 value
    ) internal view {
        if (!_isLimitsApplicable(from, to)) {
            return;
        }
        _checkTxLimit(value);
        _checkWalletLimit(to, value);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        _checkLimits(from, to, value);

        uint256 taxAmount = _calculateTax(from, to, value);

        if (taxAmount > 0) {
            super._update(from, feeCollector, taxAmount);
            value -= taxAmount;
        }

        super._update(from, to, value);
    }
}
