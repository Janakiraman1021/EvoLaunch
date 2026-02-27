// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AgentToken.sol";
import "./AgentTreasury.sol";
import "./RiskController.sol";
import "./AgentPerformanceTracker.sol";
import "./RevenueDistributor.sol";

/**
 * @title AgentFactory
 * @dev Factory contract that deploys the complete infrastructure for an AI Agent:
 *      AgentToken, AgentTreasury, RiskController, PerformanceTracker, RevenueDistributor.
 *      Each agent is fully isolated with its own set of contracts.
 */
contract AgentFactory is Ownable {
    struct AgentDeployment {
        address agentToken;
        address treasury;
        address riskController;
        address performanceTracker;
        address revenueDistributor;
        address creator;
        string  strategyType;
        uint256 createdAt;
        bool    active;
    }

    // Registry of all deployed agents
    AgentDeployment[] public agents;
    mapping(address => uint256[]) public agentsByCreator;

    // Default risk parameters (can be overridden per-agent)
    uint256 public defaultMaxCapitalBps = 2000;   // 20%
    uint256 public defaultMaxDailyBps = 5000;      // 50%
    uint256 public defaultMaxDrawdownBps = 1500;   // 15%
    uint256 public defaultTokenPrice = 0.001 ether; // 0.001 BNB per token

    // --- Events ---
    event AgentCreated(
        uint256 indexed agentId,
        address indexed creator,
        address agentToken,
        address treasury,
        address riskController,
        address performanceTracker,
        address revenueDistributor,
        string  strategyType
    );
    event AgentDeactivated(uint256 indexed agentId);
    event DefaultRiskParamsUpdated(uint256 maxCapital, uint256 maxDaily, uint256 maxDrawdown);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new AI Agent with full infrastructure.
     * @param name_ Token name
     * @param symbol_ Token symbol
     * @param tokenSupply_ Total supply of agent tokens
     * @param strategyType_ Strategy type: "trading", "yield", "prediction", "data_service", "generic"
     * @param executor_ Backend execution wallet address
     * @param maxCapitalBps_ Max capital allocation per execution (0 = use default)
     * @param maxDailyBps_ Max daily deployment (0 = use default)
     * @param maxDrawdownBps_ Max drawdown (0 = use default)
     */
    function createAgent(
        string calldata name_,
        string calldata symbol_,
        uint256 tokenSupply_,
        string calldata strategyType_,
        address executor_,
        uint256 maxCapitalBps_,
        uint256 maxDailyBps_,
        uint256 maxDrawdownBps_
    ) external payable returns (uint256 agentId) {
        require(executor_ != address(0), "Executor zero");
        require(tokenSupply_ > 0, "Supply zero");

        // Use defaults if zero
        uint256 capBps = maxCapitalBps_ > 0 ? maxCapitalBps_ : defaultMaxCapitalBps;
        uint256 dailyBps = maxDailyBps_ > 0 ? maxDailyBps_ : defaultMaxDailyBps;
        uint256 drawBps = maxDrawdownBps_ > 0 ? maxDrawdownBps_ : defaultMaxDrawdownBps;

        // 1. Deploy AgentToken
        AgentToken token = new AgentToken(
            name_,
            symbol_,
            tokenSupply_,
            defaultTokenPrice,
            msg.sender
        );

        // 2. Deploy AgentTreasury
        AgentTreasury treasury = new AgentTreasury(executor_, msg.sender);

        // 3. Deploy RiskController
        RiskController risk = new RiskController(
            address(treasury),
            executor_,
            capBps,
            dailyBps,
            drawBps,
            msg.sender
        );

        // 4. Deploy PerformanceTracker
        AgentPerformanceTracker perf = new AgentPerformanceTracker(executor_, msg.sender);

        // 5. Deploy RevenueDistributor
        RevenueDistributor rev = new RevenueDistributor(address(token), msg.sender);

        // 6. Link contracts
        treasury.setRiskController(address(risk));
        token.setRevenueDistributor(address(rev));
        token.enableTrading();

        // Transfer treasury ownership to creator (already set in constructor)
        // Forward any BNB sent as initial capital
        if (msg.value > 0) {
            treasury.deposit{value: msg.value}();
            risk.setInitialCapital(msg.value);
            perf.setInitialCapital(msg.value);
        }

        // Register agent
        agentId = agents.length;
        agents.push(AgentDeployment({
            agentToken: address(token),
            treasury: address(treasury),
            riskController: address(risk),
            performanceTracker: address(perf),
            revenueDistributor: address(rev),
            creator: msg.sender,
            strategyType: strategyType_,
            createdAt: block.timestamp,
            active: true
        }));

        agentsByCreator[msg.sender].push(agentId);

        emit AgentCreated(
            agentId,
            msg.sender,
            address(token),
            address(treasury),
            address(risk),
            address(perf),
            address(rev),
            strategyType_
        );

        return agentId;
    }

    function deactivateAgent(uint256 agentId) external {
        require(agentId < agents.length, "Invalid ID");
        AgentDeployment storage agent = agents[agentId];
        require(msg.sender == agent.creator || msg.sender == owner(), "Not authorized");
        agent.active = false;
        emit AgentDeactivated(agentId);
    }

    function getAgentCount() external view returns (uint256) {
        return agents.length;
    }

    function getAgent(uint256 agentId) external view returns (AgentDeployment memory) {
        require(agentId < agents.length, "Invalid ID");
        return agents[agentId];
    }

    function getAgentsByCreator(address creator) external view returns (uint256[] memory) {
        return agentsByCreator[creator];
    }

    function updateDefaultRiskParams(
        uint256 _maxCapitalBps,
        uint256 _maxDailyBps,
        uint256 _maxDrawdownBps
    ) external onlyOwner {
        defaultMaxCapitalBps = _maxCapitalBps;
        defaultMaxDailyBps = _maxDailyBps;
        defaultMaxDrawdownBps = _maxDrawdownBps;
        emit DefaultRiskParamsUpdated(_maxCapitalBps, _maxDailyBps, _maxDrawdownBps);
    }

    function setDefaultTokenPrice(uint256 _price) external onlyOwner {
        defaultTokenPrice = _price;
    }
}
