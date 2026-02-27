/**
 * @module ai-agent-engine/strategies/TradingStrategy
 * @desc Executes real swaps via PancakeSwap using momentum + volatility signals.
 *       - Monitors price via on-chain reserves
 *       - Uses momentum-based rule engine (not random)
 *       - Executes real swapExactETHForTokens / swapExactTokensForETH
 *       - Tracks P&L per trade
 *       - Respects risk controller limits
 */

const { ethers } = require('ethers');
const config = require('../config');

const ROUTER_ABI = [
    'function swapExactETHForTokens(uint amountOutMin, address[] path, address to, uint deadline) payable returns (uint[] amounts)',
    'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline) returns (uint[] amounts)',
    'function getAmountsOut(uint amountIn, address[] path) view returns (uint[] amounts)',
    'function WETH() view returns (address)',
];

const ERC20_ABI = [
    'function balanceOf(address) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
];

const PAIR_ABI = [
    'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
    'function token0() view returns (address)',
    'function token1() view returns (address)',
];

class TradingStrategy {
    constructor(signer, provider) {
        this.signer = signer;
        this.provider = provider;
        this.router = new ethers.Contract(config.pancakeRouterAddress, ROUTER_ABI, signer);
        this.wbnb = config.wrappedBNBAddress;
        this.priceHistory = [];
        this.tradeCount = 0;
        this.dailyTradeCount = 0;
        this.dailyResetTime = Date.now();
        this.positions = new Map(); // tokenAddress => { amountIn, entryPrice }
    }

    /**
     * Analyze market and determine trade signal.
     * Uses simple momentum + volatility rule engine.
     */
    async analyzeMarket(tokenAddress) {
        try {
            const path = [this.wbnb, tokenAddress];
            const testAmount = ethers.parseEther('0.001');

            // Get current price
            const amounts = await this.router.getAmountsOut(testAmount, path);
            const currentPrice = Number(ethers.formatEther(amounts[1]));
            const timestamp = Date.now();

            // Store price point
            this.priceHistory.push({ price: currentPrice, timestamp });

            // Keep only recent history
            const window = config.trading.momentumWindow;
            if (this.priceHistory.length > window * 2) {
                this.priceHistory = this.priceHistory.slice(-window * 2);
            }

            // Need minimum data points
            if (this.priceHistory.length < window) {
                return { signal: 'HOLD', reason: 'Insufficient data', price: currentPrice };
            }

            // Calculate momentum (rate of change)
            const recentPrices = this.priceHistory.slice(-window);
            const oldPrice = recentPrices[0].price;
            const momentum = (currentPrice - oldPrice) / oldPrice;

            // Calculate volatility (standard deviation of returns)
            const returns = [];
            for (let i = 1; i < recentPrices.length; i++) {
                returns.push((recentPrices[i].price - recentPrices[i - 1].price) / recentPrices[i - 1].price);
            }
            const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
            const volatility = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);

            // Trading rules:
            // BUY: positive momentum above threshold + manageable volatility
            // SELL: negative momentum below threshold OR high volatility
            const volThreshold = config.trading.volatilityThreshold;
            const minProfit = config.trading.minProfitBps / 10000;

            let signal = 'HOLD';
            let reason = '';

            if (momentum > minProfit && volatility < volThreshold * 2) {
                signal = 'BUY';
                reason = `Momentum: +${(momentum * 100).toFixed(2)}%, Vol: ${(volatility * 100).toFixed(2)}%`;
            } else if (momentum < -minProfit || volatility > volThreshold * 3) {
                signal = 'SELL';
                reason = `Momentum: ${(momentum * 100).toFixed(2)}%, Vol: ${(volatility * 100).toFixed(2)}%`;
            } else {
                reason = `Neutral. Momentum: ${(momentum * 100).toFixed(2)}%, Vol: ${(volatility * 100).toFixed(2)}%`;
            }

            return { signal, reason, price: currentPrice, momentum, volatility };
        } catch (err) {
            return { signal: 'HOLD', reason: `Analysis error: ${err.message}`, price: 0 };
        }
    }

    /**
     * Execute a BUY trade: swap BNB for tokens.
     */
    async executeBuy(tokenAddress, amountBNB) {
        try {
            const path = [this.wbnb, tokenAddress];
            const amounts = await this.router.getAmountsOut(amountBNB, path);
            const minOut = (amounts[1] * BigInt(10000 - config.trading.slippageBps)) / 10000n;
            const deadline = Math.floor(Date.now() / 1000) + 300;

            const tx = await this.router.swapExactETHForTokens(
                minOut,
                path,
                await this.signer.getAddress(),
                deadline,
                { value: amountBNB, gasLimit: config.trading.gasLimit }
            );

            const receipt = await tx.wait();
            const actualOut = amounts[1]; // approximate

            // Track position
            this.positions.set(tokenAddress, {
                amountBNBIn: amountBNB,
                tokensReceived: actualOut,
                entryPrice: Number(ethers.formatEther(amountBNB)) / Number(ethers.formatEther(actualOut)),
                timestamp: Date.now(),
            });

            this.tradeCount++;
            this.dailyTradeCount++;

            console.log(`[TradingStrategy] BUY: ${ethers.formatEther(amountBNB)} BNB → ~${ethers.formatEther(actualOut)} tokens`);

            return {
                success: true,
                txHash: receipt.hash,
                amountIn: amountBNB.toString(),
                amountOut: actualOut.toString(),
                type: 'BUY',
            };
        } catch (err) {
            console.error('[TradingStrategy] BUY failed:', err.message);
            return { success: false, error: err.message, type: 'BUY' };
        }
    }

    /**
     * Execute a SELL trade: swap tokens for BNB.
     */
    async executeSell(tokenAddress, tokenAmount) {
        try {
            const token = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
            const signerAddr = await this.signer.getAddress();

            // Approve router
            const allowance = await token.allowance(signerAddr, config.pancakeRouterAddress);
            if (allowance < tokenAmount) {
                const approveTx = await token.approve(config.pancakeRouterAddress, ethers.MaxUint256, { gasLimit: 100000 });
                await approveTx.wait();
            }

            const path = [tokenAddress, this.wbnb];
            const amounts = await this.router.getAmountsOut(tokenAmount, path);
            const minOut = (amounts[1] * BigInt(10000 - config.trading.slippageBps)) / 10000n;
            const deadline = Math.floor(Date.now() / 1000) + 300;

            const tx = await this.router.swapExactTokensForETH(
                tokenAmount,
                minOut,
                path,
                signerAddr,
                deadline,
                { gasLimit: config.trading.gasLimit }
            );

            const receipt = await tx.wait();
            const bnbReceived = amounts[1]; // approximate

            // Calculate P&L
            let pnl = 0n;
            const position = this.positions.get(tokenAddress);
            if (position) {
                pnl = bnbReceived - position.amountBNBIn;
                this.positions.delete(tokenAddress);
            }

            this.tradeCount++;
            this.dailyTradeCount++;

            console.log(`[TradingStrategy] SELL: ${ethers.formatEther(tokenAmount)} tokens → ~${ethers.formatEther(bnbReceived)} BNB (PnL: ${ethers.formatEther(pnl)} BNB)`);

            return {
                success: true,
                txHash: receipt.hash,
                amountIn: tokenAmount.toString(),
                amountOut: bnbReceived.toString(),
                pnl: pnl.toString(),
                type: 'SELL',
            };
        } catch (err) {
            console.error('[TradingStrategy] SELL failed:', err.message);
            return { success: false, error: err.message, type: 'SELL' };
        }
    }

    /**
     * Full execution cycle: analyze → validate → trade.
     */
    async execute(tokenAddress, treasuryBalance, riskValidator) {
        // Reset daily counter
        if (Date.now() - this.dailyResetTime > 86400000) {
            this.dailyTradeCount = 0;
            this.dailyResetTime = Date.now();
        }

        // Check daily trade limit
        if (this.dailyTradeCount >= config.defaultRisk.maxTradesPerDay) {
            return { executed: false, reason: 'Daily trade limit reached' };
        }

        // Analyze market
        const analysis = await this.analyzeMarket(tokenAddress);
        if (analysis.signal === 'HOLD') {
            return { executed: false, reason: analysis.reason, analysis };
        }

        if (analysis.signal === 'BUY') {
            // Determine trade size (percentage of treasury)
            const tradeSize = (treasuryBalance * BigInt(config.defaultRisk.maxCapitalAllocationBps)) / 20000n; // Half of max allocation

            // Risk pre-validation
            const riskCheck = await riskValidator.preValidate(tradeSize, treasuryBalance);
            if (!riskCheck.allowed) {
                return { executed: false, reason: `Risk blocked: ${riskCheck.reason}`, analysis };
            }

            // On-chain risk validation  
            const onChainCheck = await riskValidator.validateOnChain(tradeSize);
            if (!onChainCheck.success) {
                return { executed: false, reason: `On-chain risk failed: ${onChainCheck.error}`, analysis };
            }

            const result = await this.executeBuy(tokenAddress, tradeSize);
            return { executed: result.success, result, analysis, capitalUsed: tradeSize.toString() };
        }

        if (analysis.signal === 'SELL') {
            const position = this.positions.get(tokenAddress);
            if (!position) {
                return { executed: false, reason: 'No position to sell', analysis };
            }

            const token = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
            const balance = await token.balanceOf(await this.signer.getAddress());
            if (balance === 0n) {
                this.positions.delete(tokenAddress);
                return { executed: false, reason: 'No token balance to sell', analysis };
            }

            const result = await this.executeSell(tokenAddress, balance);

            // Record PnL on risk controller
            if (result.success && result.pnl) {
                await riskValidator.recordExecution(BigInt(result.pnl));
            }

            return { executed: result.success, result, analysis, capitalUsed: '0' };
        }

        return { executed: false, reason: 'Unknown signal' };
    }

    getStats() {
        return {
            totalTrades: this.tradeCount,
            dailyTrades: this.dailyTradeCount,
            activePositions: this.positions.size,
            priceDataPoints: this.priceHistory.length,
        };
    }
}

module.exports = TradingStrategy;
