// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AdaptiveToken.sol";
import "./LiquidityVault.sol";
import "./EvolutionController.sol";
import "./GovernanceModule.sol";
import "./interfaces/IPancakeSwap.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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

    struct LaunchParams {
        string name;
        string symbol;
        uint256 totalSupply;
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

    function _transferOwnership(
        AdaptiveToken token,
        LiquidityVault vault,
        EvolutionController controller,
        address receiver
    ) internal {
        // Fix: Exclude the receiver (deployer) from limits and fees so they can receive
        // the total supply without hitting maxTx/maxWallet limits during deployment.
        token.setExcludedFromLimits(receiver, true);
        token.setExcludedFromFees(receiver, true);

        // Fix: Transfer the entire balance of newly minted tokens to the deployer
        // so they can provide liquidity on PancakeSwap.
        token.transfer(receiver, token.balanceOf(address(this)));

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
        _transferOwnership(token, vault, controller, msg.sender);

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
