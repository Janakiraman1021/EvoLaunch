// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./AdaptiveToken.sol";
import "./LiquidityVault.sol";

/**
 * @title EvolutionController
 * @dev Manages evolution phases and parameter updates via signed agent signals.
 */
contract EvolutionController is AccessControl {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");

    enum Phase { Protective, Growth, Expansion, Governance }

    Phase public currentPhase;
    AdaptiveToken public token;
    LiquidityVault public vault;

    uint256 public currentMSS;
    uint256 public lastUpdateTimestamp;
    
    mapping(address => uint256) public nonces;

    event PhaseTransitioned(Phase from, Phase to, uint256 mss);
    event ParametersUpdated(uint256 sellTax, uint256 buyTax, uint256 maxTxAmt, uint256 maxWallet);
    event MSSUpdated(uint256 newMSS);

    constructor(address _token, address _vault, address admin) {
        token = AdaptiveToken(_token);
        vault = LiquidityVault(_vault);
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        currentPhase = Phase.Protective;
    }

    /**
     * @dev Updates token parameters and MSS based on signed agent payload.
     */
    function processAgentSignal(
        uint256 mss,
        uint256 sellTax,
        uint256 buyTax,
        uint256 maxTxAmt,
        uint256 maxWallet,
        uint256 timestamp,
        uint256 nonce,
        bytes calldata signature
    ) external {
        require(timestamp > lastUpdateTimestamp, "Stale payload");
        require(timestamp <= block.timestamp + 300, "Future timestamp");
        
        bytes32 messageHash = keccak256(abi.encodePacked(mss, sellTax, buyTax, maxTxAmt, maxWallet, timestamp, nonce, address(this)));
        address signer = messageHash.toEthSignedMessageHash().recover(signature);
        
        require(hasRole(AGENT_ROLE, signer), "Invalid agent signature");
        require(nonce == nonces[signer]++, "Invalid nonce");

        lastUpdateTimestamp = timestamp;
        currentMSS = mss;
        emit MSSUpdated(mss);

        token.updateParameters(sellTax, buyTax, maxTxAmt, maxWallet);
        emit ParametersUpdated(sellTax, buyTax, maxTxAmt, maxWallet);

        // Check for automatic phase transitions based on MSS
        _evaluatePhase();
    }

    function _evaluatePhase() internal {
        Phase nextPhase = currentPhase;
        if (currentMSS < 40) {
            nextPhase = Phase.Protective;
        } else if (currentMSS >= 40 && currentMSS < 70) {
            nextPhase = Phase.Growth;
        } else if (currentMSS >= 70) {
            nextPhase = Phase.Expansion;
        }

        if (nextPhase != currentPhase) {
            emit PhaseTransitioned(currentPhase, nextPhase, currentMSS);
            currentPhase = nextPhase;
        }
    }

    function forcePhase(Phase phase) external onlyRole(DEFAULT_ADMIN_ROLE) {
        emit PhaseTransitioned(currentPhase, phase, currentMSS);
        currentPhase = phase;
    }
}
