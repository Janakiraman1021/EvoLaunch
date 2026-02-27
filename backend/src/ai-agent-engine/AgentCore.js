/**
 * @module ai-agent-engine/AgentCore
 * @desc Main orchestrator for the AI Agent Execution Engine.
 *       Manages agent lifecycle, dispatches strategies, handles failures.
 *       Completely isolated from the human launchpad orchestrator.
 */

const { ethers } = require('ethers');
const config = require('./config');
const RiskValidator = require('./RiskValidator');
const TreasuryManager = require('./TreasuryManager');
const PerformanceReporter = require('./PerformanceReporter');
const TradingStrategy = require('./strategies/TradingStrategy');
const YieldStrategy = require('./strategies/YieldStrategy');
const PredictionArbitrageStrategy = require('./strategies/PredictionArbitrageStrategy');
const DataServiceStrategy = require('./strategies/DataServiceStrategy');
const GenericStrategy = require('./strategies/GenericStrategy');

const AGENT_FACTORY_ABI = [
    'function getAgentCount() view returns (uint256)',
    'function getAgent(uint256) view returns (tuple(address agentToken, address treasury, address riskController, address performanceTracker, address revenueDistributor, address creator, string strategyType, uint256 createdAt, bool active))',
    'function agents(uint256) view returns (address agentToken, address treasury, address riskController, address performanceTracker, address revenueDistributor, address creator, string strategyType, uint256 createdAt, bool active)',
];

class AgentCore {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.factoryContract = null;
        this.activeAgents = new Map(); // agentId => { strategy, risk, treasury, perf, config }
        this.schedulerInterval = null;
        this.healthInterval = null;
        this.isRunning = false;
        this.lastCycleTime = 0;
        this.cycleCount = 0;
        this.errors = [];
    }

    /**
     * Initialize the engine.
     */
    async initialize() {
        if (!config.executorPrivateKey) {
            console.log('[AgentCore] No executor private key configured. Engine idle.');
            return false;
        }

        try {
            this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
            this.signer = new ethers.Wallet(config.executorPrivateKey, this.provider);

            // Verify RPC connectivity
            const blockNumber = await this.provider.getBlockNumber();
            const balance = await this.provider.getBalance(this.signer.address);

            console.log(`[AgentCore] Connected to chain. Block: ${blockNumber}`);
            console.log(`[AgentCore] Executor: ${this.signer.address}`);
            console.log(`[AgentCore] Balance: ${ethers.formatEther(balance)} BNB`);

            if (config.agentFactoryAddress) {
                this.factoryContract = new ethers.Contract(
                    config.agentFactoryAddress, AGENT_FACTORY_ABI, this.signer
                );
                console.log(`[AgentCore] Factory: ${config.agentFactoryAddress}`);
            }

            return true;
        } catch (err) {
            console.error('[AgentCore] Initialization failed:', err.message);
            return false;
        }
    }

    /**
     * Load an agent from on-chain data and initialize its strategy.
     */
    async loadAgent(agentId) {
        if (!this.factoryContract) {
            throw new Error('Factory contract not configured');
        }

        try {
            const data = await this.factoryContract.getAgent(agentId);
            if (!data.active) {
                console.log(`[AgentCore] Agent ${agentId} is not active`);
                return null;
            }

            const riskValidator = new RiskValidator(data.riskController, this.provider, this.signer);
            const treasuryManager = new TreasuryManager(data.treasury, data.revenueDistributor, this.signer);
            const perfReporter = new PerformanceReporter(data.performanceTracker, this.signer);

            // Initialize strategy based on type
            let strategy;
            switch (data.strategyType) {
                case 'trading':
                    strategy = new TradingStrategy(this.signer, this.provider);
                    break;
                case 'yield':
                    strategy = new YieldStrategy(this.signer, this.provider);
                    break;
                case 'prediction':
                    strategy = new PredictionArbitrageStrategy(this.signer, this.provider);
                    break;
                case 'data_service':
                    strategy = new DataServiceStrategy(this.signer, this.provider);
                    break;
                case 'generic':
                    strategy = new GenericStrategy(this.signer, this.provider);
                    break;
                default:
                    console.error(`[AgentCore] Unknown strategy type: ${data.strategyType}`);
                    return null;
            }

            const agentRuntime = {
                id: agentId,
                strategy,
                riskValidator,
                treasuryManager,
                perfReporter,
                strategyType: data.strategyType,
                tokenAddress: data.agentToken,
                treasuryAddress: data.treasury,
                creator: data.creator,
                createdAt: Number(data.createdAt),
                lastExecution: 0,
                executionsRun: 0,
                consecutiveErrors: 0,
            };

            this.activeAgents.set(agentId, agentRuntime);
            console.log(`[AgentCore] Loaded agent ${agentId} (${data.strategyType})`);
            return agentRuntime;
        } catch (err) {
            console.error(`[AgentCore] Failed to load agent ${agentId}:`, err.message);
            return null;
        }
    }

    /**
     * Execute one cycle for a single agent.
     */
    async executeAgent(agentId) {
        const agent = this.activeAgents.get(agentId);
        if (!agent) return { executed: false, reason: 'Agent not loaded' };

        try {
            // Get treasury balance
            const treasuryBalance = await agent.treasuryManager.getBalance();

            if (treasuryBalance === 0n) {
                return { executed: false, reason: 'Treasury empty' };
            }

            // Execute strategy
            let result;
            if (agent.strategyType === 'generic') {
                result = await agent.strategy.execute(treasuryBalance, agent.riskValidator, agent.treasuryManager);
            } else if (agent.strategyType === 'trading') {
                // Trading needs a token address to trade
                const targetToken = config.wrappedBNBAddress; // Default; can be overridden
                result = await agent.strategy.execute(targetToken, treasuryBalance, agent.riskValidator);
            } else {
                result = await agent.strategy.execute(treasuryBalance, agent.riskValidator);
            }

            // Log execution on-chain if something happened
            if (result.executed) {
                const pnl = result.result?.pnl ? BigInt(result.result.pnl) : 0n;
                const capitalUsed = result.capitalUsed ? BigInt(result.capitalUsed) : 0n;
                const txHash = result.result?.txHash || '';

                await agent.perfReporter.logExecution(
                    agent.strategyType,
                    pnl,
                    capitalUsed,
                    txHash
                );

                agent.executionsRun++;
                agent.consecutiveErrors = 0;
            }

            agent.lastExecution = Date.now();
            return result;
        } catch (err) {
            agent.consecutiveErrors++;
            this.errors.push({ agentId, error: err.message, timestamp: Date.now() });

            // Emergency stop after 5 consecutive errors
            if (agent.consecutiveErrors >= 5) {
                console.error(`[AgentCore] Agent ${agentId}: 5 consecutive errors. Triggering emergency stop.`);
                await agent.riskValidator.triggerEmergencyStop();
            }

            console.error(`[AgentCore] Agent ${agentId} execution error:`, err.message);
            return { executed: false, error: err.message };
        }
    }

    /**
     * Run one execution cycle for all active agents.
     */
    async runCycle() {
        if (!this.isRunning) return;

        this.cycleCount++;
        this.lastCycleTime = Date.now();

        for (const [agentId] of this.activeAgents) {
            try {
                await this.executeAgent(agentId);
            } catch (err) {
                console.error(`[AgentCore] Cycle error for agent ${agentId}:`, err.message);
            }
        }
    }

    /**
     * Start the execution scheduler.
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;

        this.schedulerInterval = setInterval(
            () => this.runCycle().catch(err => console.error('[AgentCore] Cycle failed:', err)),
            config.executionIntervalMs
        );

        this.healthInterval = setInterval(
            () => this._healthCheck().catch(err => console.error('[AgentCore] Health check failed:', err)),
            config.healthCheckIntervalMs
        );

        console.log(`[AgentCore] Scheduler started (interval: ${config.executionIntervalMs}ms)`);
    }

    /**
     * Stop the scheduler.
     */
    stop() {
        this.isRunning = false;
        if (this.schedulerInterval) clearInterval(this.schedulerInterval);
        if (this.healthInterval) clearInterval(this.healthInterval);
        console.log('[AgentCore] Scheduler stopped');
    }

    /**
     * Health check.
     */
    async _healthCheck() {
        try {
            const blockNumber = await this.provider.getBlockNumber();
            const balance = await this.provider.getBalance(this.signer.address);

            if (balance < ethers.parseEther('0.001')) {
                console.warn('[AgentCore] WARNING: Executor balance critically low!');
            }

            return { block: blockNumber, balance: ethers.formatEther(balance) };
        } catch (err) {
            console.error('[AgentCore] Health check failed:', err.message);
            return null;
        }
    }

    /**
     * Get full engine status.
     */
    getStatus() {
        const agents = [];
        for (const [id, agent] of this.activeAgents) {
            agents.push({
                id,
                strategyType: agent.strategyType,
                executionsRun: agent.executionsRun,
                consecutiveErrors: agent.consecutiveErrors,
                lastExecution: agent.lastExecution ? new Date(agent.lastExecution).toISOString() : 'Never',
                stats: agent.strategy.getStats ? agent.strategy.getStats() : {},
            });
        }

        return {
            running: this.isRunning,
            cycleCount: this.cycleCount,
            lastCycleTime: this.lastCycleTime ? new Date(this.lastCycleTime).toISOString() : 'Never',
            activeAgents: agents,
            recentErrors: this.errors.slice(-10),
        };
    }

    /**
     * Remove an agent from the scheduler.
     */
    removeAgent(agentId) {
        this.activeAgents.delete(agentId);
    }
}

// Singleton instance
const agentCore = new AgentCore();

module.exports = agentCore;
