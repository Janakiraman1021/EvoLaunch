/**
 * @module ai-agent-engine/strategies/GenericStrategy
 * @desc Sandboxed framework for developer-defined strategy modules.
 *       - Restricts treasury access through a controlled interface
 *       - Passes risk validation before execution
 *       - Enforces bounded execution permissions
 *       - Developer provides execute() function within sandbox
 */

const { ethers } = require('ethers');
const config = require('../config');

class GenericStrategy {
    constructor(signer, provider) {
        this.signer = signer;
        this.provider = provider;
        this.modules = new Map(); // moduleId => { execute, name, version, author }
        this.executionLog = [];
    }

    /**
     * Register a developer-defined strategy module.
     * The module must provide an execute() function.
     */
    registerModule(moduleId, module) {
        if (!module || typeof module.execute !== 'function') {
            throw new Error('Module must have an execute() function');
        }
        if (!module.name) {
            throw new Error('Module must have a name');
        }

        // Validate module doesn't try to access restricted APIs
        const moduleCode = module.execute.toString();
        const restricted = ['process.exit', 'require("child_process")', 'fs.', 'eval(', 'Function('];
        for (const r of restricted) {
            if (moduleCode.includes(r)) {
                throw new Error(`Module contains restricted call: ${r}`);
            }
        }

        this.modules.set(moduleId, {
            execute: module.execute,
            name: module.name,
            version: module.version || '1.0.0',
            author: module.author || 'unknown',
            registeredAt: Date.now(),
        });

        console.log(`[GenericStrategy] Registered module: ${module.name} (${moduleId})`);
        return true;
    }

    /**
     * Unregister a module.
     */
    unregisterModule(moduleId) {
        return this.modules.delete(moduleId);
    }

    /**
     * Create a sandboxed treasury interface with limited operations.
     */
    _createSandboxedTreasury(treasuryManager, maxAmount) {
        return {
            getBalance: () => treasuryManager.getBalance(),
            // Withdraw is capped at maxAmount
            withdraw: async (to, amount, reason) => {
                if (BigInt(amount) > BigInt(maxAmount)) {
                    throw new Error(`Amount exceeds sandbox limit: ${maxAmount}`);
                }
                return treasuryManager.withdraw(to, amount, `[Sandbox] ${reason}`);
            },
            // No direct deposit or emergency functions exposed
        };
    }

    /**
     * Create a sandboxed provider (read-only access).
     */
    _createSandboxedProvider() {
        return {
            getBalance: (addr) => this.provider.getBalance(addr),
            getBlockNumber: () => this.provider.getBlockNumber(),
            getBlock: (n) => this.provider.getBlock(n),
            // No transaction sending capability
        };
    }

    /**
     * Execute a registered module in sandbox.
     */
    async executeModule(moduleId, treasuryBalance, riskValidator, treasuryManager) {
        const module = this.modules.get(moduleId);
        if (!module) {
            return { executed: false, reason: `Module ${moduleId} not found` };
        }

        // Calculate max allocation for sandbox
        const maxAmount = (treasuryBalance * BigInt(config.defaultRisk.maxCapitalAllocationBps)) / 10000n;

        // Risk pre-validation
        const riskCheck = await riskValidator.preValidate(maxAmount, treasuryBalance);
        if (!riskCheck.allowed) {
            return { executed: false, reason: `Risk blocked: ${riskCheck.reason}` };
        }

        // Create sandbox environment
        const sandbox = {
            treasury: this._createSandboxedTreasury(treasuryManager, maxAmount),
            provider: this._createSandboxedProvider(),
            ethers: { formatEther: ethers.formatEther, parseEther: ethers.parseEther },
            config: {
                chainId: config.chainId,
                maxAmount: maxAmount.toString(),
            },
        };

        try {
            // Execute with timeout
            const result = await Promise.race([
                module.execute(sandbox),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Module execution timeout')), 30000)
                ),
            ]);

            this.executionLog.push({
                moduleId,
                moduleName: module.name,
                timestamp: Date.now(),
                success: true,
                result: typeof result === 'object' ? JSON.stringify(result).slice(0, 500) : String(result),
            });

            console.log(`[GenericStrategy] Module ${module.name} executed successfully`);
            return { executed: true, result, moduleName: module.name };
        } catch (err) {
            this.executionLog.push({
                moduleId,
                moduleName: module.name,
                timestamp: Date.now(),
                success: false,
                error: err.message,
            });

            console.error(`[GenericStrategy] Module ${module.name} failed:`, err.message);
            return { executed: false, reason: err.message, moduleName: module.name };
        }
    }

    /**
     * Execute all registered modules.
     */
    async execute(treasuryBalance, riskValidator, treasuryManager) {
        if (this.modules.size === 0) {
            return { executed: false, reason: 'No modules registered' };
        }

        const results = [];
        for (const [moduleId] of this.modules) {
            const result = await this.executeModule(moduleId, treasuryBalance, riskValidator, treasuryManager);
            results.push(result);
        }

        return {
            executed: results.some(r => r.executed),
            results,
            modulesRun: results.length,
        };
    }

    getStats() {
        const modules = [];
        for (const [id, m] of this.modules) {
            modules.push({ id, name: m.name, version: m.version, author: m.author });
        }
        return {
            registeredModules: modules,
            totalExecutions: this.executionLog.length,
            recentExecutions: this.executionLog.slice(-10),
        };
    }
}

module.exports = GenericStrategy;
