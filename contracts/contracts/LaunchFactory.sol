// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AdaptiveToken.sol";
import "./LiquidityVault.sol";
import "./EvolutionController.sol";
import "./GovernanceModule.sol";
import "./interfaces/IPancakeSwap.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/**
 * @title LaunchFactory
 * @dev Deploys the entire EvoLaunch infrastructure for a new token.
 */
contract LaunchFactory is Ownable {
    address public pancakeRouter;
    address public pancakeFactory;

    event LaunchCreated(
        address indexed token,
        address vault,
        address controller,
        address governance,
        address ammPair
    );

    constructor(address _router, address _factory) Ownable(msg.sender) {
        pancakeRouter = _router;
        pancakeFactory = _factory;
    }

    // Required to receive the unused BNB refund from PancakeSwap when adding liquidity
    receive() external payable {}

    struct LaunchParams {
        string name;
        string symbol;
        uint256 totalSupply;
        uint256 initialLiquidityTokens; // NEW: Amount of tokens to pair with msg.value
        uint256 initialSellTax;
        uint256 initialBuyTax;
        uint256 initialMaxTx;
        uint256 initialMaxWallet;
        uint256 minTax;
        uint256 maxTax;
        uint256 minMaxTx;
        uint256 minMaxWallet;
        address feeCollector;
        address[] agentPublicKeys;
    }

    function _deployContracts(LaunchParams calldata params)
        internal
        returns (
            GovernanceModule,
            AdaptiveToken,
            address,
            LiquidityVault,
            EvolutionController
        )
    {
        GovernanceModule gov = new GovernanceModule(msg.sender);

        AdaptiveToken token = new AdaptiveToken(
            params.name,
            params.symbol,
            params.totalSupply,
            params.initialSellTax,
            params.initialBuyTax,
            params.initialMaxTx,
            params.initialMaxWallet,
            params.minTax,
            params.maxTax,
            params.minMaxTx,
            params.minMaxWallet,
            params.feeCollector,
            address(this)
        );

        address pair = IPancakeFactory(pancakeFactory).createPair(
            address(token),
            IPancakeRouter02(pancakeRouter).WETH()
        );
        token.setAMMPair(pair);

        LiquidityVault vault = new LiquidityVault(pair, address(this));

        EvolutionController controller = new EvolutionController(
            address(token),
            address(vault),
            address(this)  // Pass LaunchFactory as admin for role setup
        );

        return (gov, token, pair, vault, controller);
    }

    function _setupRoles(
        AdaptiveToken token,
        LiquidityVault vault,
        EvolutionController controller,
        address[] calldata agentPublicKeys
    ) internal {
        // LaunchFactory is already the admin of controller, so we can grant roles directly
        token.grantRole(token.CONTROLLER_ROLE(), address(controller));
        vault.grantRole(vault.CONTROLLER_ROLE(), address(controller));

        for (uint256 i = 0; i < agentPublicKeys.length; i++) {
            controller.grantRole(controller.AGENT_ROLE(), agentPublicKeys[i]);
        }
    }

    function _finalizeAndTransfer(
        AdaptiveToken token,
        LiquidityVault vault,
        EvolutionController controller,
        LaunchParams calldata params,
        address receiver
    ) internal {
        console.log("Starting finalizeAndTransfer");
        
        // Exclude the factory and receiver (deployer) from limits and fees during setup
        token.setExcludedFromLimits(address(this), true);
        token.setExcludedFromFees(address(this), true);
        token.setExcludedFromLimits(receiver, true);
        token.setExcludedFromFees(receiver, true);

        // Crucial: The router and the pair must be excluded from limits during LP creation
        // to prevent reverting on maxTxAmount or maxWalletSize.
        token.setExcludedFromLimits(pancakeRouter, true);
        token.setExcludedFromFees(pancakeRouter, true);
        token.setExcludedFromLimits(token.ammPair(), true);
        token.setExcludedFromFees(token.ammPair(), true);

        console.log("Limits excluded");

        // Automate Liquidity Provision if BNB is sent
        if (msg.value > 0 && params.initialLiquidityTokens > 0) {
            console.log("Adding liquidity", msg.value, params.initialLiquidityTokens);
            uint256 tokensToAdd = params.initialLiquidityTokens;
            if (tokensToAdd > token.balanceOf(address(this))) {
                tokensToAdd = token.balanceOf(address(this)); // Safely clamp if user sends too high param
            }

            console.log("Approving router");
            // Approve PancakeRouter to spend the factory's minted tokens
            token.approve(pancakeRouter, tokensToAdd);

            console.log("Calling addLiquidityETH");
            // Add liquidity. The LP tokens will be minted directly to the receiver (deployer).
            IPancakeRouter02(pancakeRouter).addLiquidityETH{value: msg.value}(
                address(token),
                tokensToAdd,
                0, // slippage is unavoidable for initial LP
                0, 
                receiver, // LP tokens go to deployer
                block.timestamp + 300 // 5 min deadline
            );
            console.log("Liquidity added successfully");

            // Refund any unused BNB to the deployer
            if (address(this).balance > 0) {
                (bool success, ) = receiver.call{value: address(this).balance}("");
                require(success, "BNB refund failed");
            }
        }

        // Transfer the *remaining* balance of newly minted tokens to the deployer.
        // If they pooled 100%, this does nothing. If they pooled 50%, they receive the other 50%.
        uint256 remainingBal = token.balanceOf(address(this));
        if (remainingBal > 0) {
            token.transfer(receiver, remainingBal);
        }

        // Transfer token ownership
        token.grantRole(token.DEFAULT_ADMIN_ROLE(), receiver);
        token.renounceRole(token.DEFAULT_ADMIN_ROLE(), address(this));

        // Transfer vault ownership
        vault.grantRole(vault.DEFAULT_ADMIN_ROLE(), receiver);
        vault.renounceRole(vault.DEFAULT_ADMIN_ROLE(), address(this));

        // Transfer controller ownership
        bytes32 adminRole = controller.DEFAULT_ADMIN_ROLE();
        controller.grantRole(adminRole, receiver);
        controller.revokeRole(adminRole, address(this));
    }

    function createLaunch(LaunchParams calldata params)
        external
        payable
        returns (address)
    {
        (
            GovernanceModule gov,
            AdaptiveToken token,
            address pair,
            LiquidityVault vault,
            EvolutionController controller
        ) = _deployContracts(params);

        _setupRoles(token, vault, controller, params.agentPublicKeys);
        _finalizeAndTransfer(token, vault, controller, params, msg.sender);

        emit LaunchCreated(
            address(token),
            address(vault),
            address(controller),
            address(gov),
            pair
        );

        return address(token);
    }
}
