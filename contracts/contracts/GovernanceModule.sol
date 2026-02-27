// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title GovernanceModule
 * @dev Manages high-level protocol governance, pausing, and emergency actions.
 */
contract GovernanceModule is AccessControl, Pausable {
    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");

    event AgentKeyUpdated(address oldKey, address newKey);
    event LogicFrozen(bool frozen);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(GOVERNOR_ROLE, admin);
    }

    /**
     * @dev Pauses the protocol.
     */
    function pause() external onlyRole(GOVERNOR_ROLE) {
        _pause();
    }

    /**
     * @dev Unpauses the protocol.
     */
    function unpause() external onlyRole(GOVERNOR_ROLE) {
        _unpause();
    }

    /**
     * @dev Emits AgentKeyUpdated for tracking. Actual key replacement happens in EvolutionController.
     */
    function updateAgentKey(address oldKey, address newKey) external onlyRole(DEFAULT_ADMIN_ROLE) {
        emit AgentKeyUpdated(oldKey, newKey);
    }

    /**
     * @dev Emits LogicFrozen for tracking state.
     */
    function freezeLogic(bool frozen) external onlyRole(DEFAULT_ADMIN_ROLE) {
        emit LogicFrozen(frozen);
    }
}
