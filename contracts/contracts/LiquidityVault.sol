// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LiquidityVault
 * @dev Holds LP tokens and releases them in tranches based on protocol conditions.
 */
contract LiquidityVault is AccessControlEnumerable, ReentrancyGuard {
    bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");

    struct Tranche {
        uint256 amount;
        bool released;
        uint256 mssThreshold;
        uint8 phaseRequired;
    }

    IERC20 public lpToken;
    Tranche[] public tranches;
    uint256 public totalReleased;
    bool public isFrozen;

    event TrancheAdded(uint256 index, uint256 amount, uint256 mssThreshold, uint8 phaseRequired);
    event TrancheReleased(uint256 index, uint256 amount);
    event VaultFrozen(bool frozen);

    constructor(address _lpToken, address admin) {
        lpToken = IERC20(_lpToken);
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function addTranche(uint256 amount, uint256 mssThreshold, uint8 phaseRequired) external onlyRole(DEFAULT_ADMIN_ROLE) {
        tranches.push(Tranche({
            amount: amount,
            released: false,
            mssThreshold: mssThreshold,
            phaseRequired: phaseRequired
        }));
        emit TrancheAdded(tranches.length - 1, amount, mssThreshold, phaseRequired);
    }

    function releaseTranche(uint256 index, uint256 currentMSS, uint8 currentPhase) external onlyRole(CONTROLLER_ROLE) nonReentrant {
        require(!isFrozen, "Vault is frozen");
        require(index < tranches.length, "Invalid index");
        Tranche storage t = tranches[index];
        require(!t.released, "Already released");
        require(currentMSS >= t.mssThreshold, "MSS threshold not met");
        require(currentPhase >= t.phaseRequired, "Phase requirement not met");

        require(lpToken.balanceOf(address(this)) >= t.amount, "Insufficient balance in vault");

        t.released = true;
        totalReleased += t.amount;
        
        // Transfer LP tokens to the fee collector or a designated address (defaulting to admin here for demo, usually the owner)
        address recipient = _getRecipient();
        require(lpToken.transfer(recipient, t.amount), "Transfer failed");

        emit TrancheReleased(index, t.amount);
    }

    function setFrozen(bool frozen) external onlyRole(CONTROLLER_ROLE) {
        isFrozen = frozen;
        emit VaultFrozen(frozen);
    }

    function _getRecipient() internal view returns (address) {
        // In a real scenario, this might be a governance address or the project founder
        return getRoleMember(DEFAULT_ADMIN_ROLE, 0);
    }
    
    // Help identify the contract
    function getTrancheCount() external view returns (uint256) {
        return tranches.length;
    }
}
