/**
 * @module ai-agent-engine/strategies/DataServiceStrategy
 * @desc Monetizes AI-generated trading signals via subscription API.
 *       - Generates signals based on on-chain market data
 *       - Collects subscription fees in BNB on-chain
 *       - Routes fees to treasury
 *       - Logs usage metrics
 */

const { ethers } = require('ethers');
const config = require('../config');

class DataServiceStrategy {
    constructor(signer, provider) {
        this.signer = signer;
        this.provider = provider;
        this.subscribers = new Map();  // address => { expiry, tier }
        this.signals = [];
        this.totalSubscriptionRevenue = 0n;
        this.totalSignalsGenerated = 0;
        this.usageMetrics = { requests: 0, lastSignalTime: 0 };
    }

    /**
     * Generate AI trading signal based on on-chain data.
     */
    async generateSignal(tokenAddress) {
        try {
            const routerAddress = config.pancakeRouterAddress;
            const wbnb = config.wrappedBNBAddress;

            const routerAbi = [
                'function getAmountsOut(uint amountIn, address[] path) view returns (uint[] amounts)',
            ];
            const router = new ethers.Contract(routerAddress, routerAbi, this.provider);

            const testAmount = ethers.parseEther('1');
            const path = [wbnb, tokenAddress];

            const amounts = await router.getAmountsOut(testAmount, path);
            const currentPrice = Number(ethers.formatEther(amounts[1]));

            // Generate signal based on price momentum
            const prevSignals = this.signals.filter(s => s.token === tokenAddress).slice(-5);
            let signal = 'NEUTRAL';
            let confidence = 50;

            if (prevSignals.length >= 3) {
                const avgPrevPrice = prevSignals.reduce((sum, s) => sum + s.price, 0) / prevSignals.length;
                const priceChange = (currentPrice - avgPrevPrice) / avgPrevPrice;

                if (priceChange > 0.02) {
                    signal = 'BULLISH';
                    confidence = Math.min(90, 50 + Math.abs(priceChange) * 1000);
                } else if (priceChange < -0.02) {
                    signal = 'BEARISH';
                    confidence = Math.min(90, 50 + Math.abs(priceChange) * 1000);
                }
            }

            const signalData = {
                token: tokenAddress,
                price: currentPrice,
                signal,
                confidence: Math.round(confidence),
                timestamp: Date.now(),
                id: `SIG-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            };

            this.signals.push(signalData);
            this.totalSignalsGenerated++;
            this.usageMetrics.lastSignalTime = Date.now();

            // Keep only last 100 signals
            if (this.signals.length > 100) {
                this.signals = this.signals.slice(-100);
            }

            return signalData;
        } catch (err) {
            console.error('[DataService] Signal generation failed:', err.message);
            return null;
        }
    }

    /**
     * Process subscription payment (called when user pays on-chain).
     */
    processSubscription(userAddress, amountPaid, duration) {
        const expiry = Date.now() + duration;
        this.subscribers.set(userAddress.toLowerCase(), {
            expiry,
            tier: amountPaid >= ethers.parseEther('0.1') ? 'premium' : 'basic',
            paidAmount: amountPaid.toString(),
        });

        this.totalSubscriptionRevenue += amountPaid;
        this.usageMetrics.requests++;

        console.log(`[DataService] New subscription: ${userAddress} until ${new Date(expiry).toISOString()}`);
        return true;
    }

    /**
     * Check if user has active subscription.
     */
    isSubscribed(userAddress) {
        const sub = this.subscribers.get(userAddress.toLowerCase());
        if (!sub) return false;
        return sub.expiry > Date.now();
    }

    /**
     * Get signals for subscribed user.
     */
    getSignals(userAddress, count = 10) {
        if (!this.isSubscribed(userAddress)) {
            return { authorized: false, signals: [] };
        }

        return {
            authorized: true,
            signals: this.signals.slice(-count),
        };
    }

    /**
     * Execute cycle: generate signals + route any collected fees.
     */
    async execute(treasuryBalance, riskValidator) {
        // Generate signals for configured tokens
        const wbnb = config.wrappedBNBAddress;
        const signal = await this.generateSignal(wbnb);

        if (!signal) {
            return { executed: false, reason: 'Signal generation failed' };
        }

        // Revenue from subscriptions is collected at the API level
        // and deposited into treasury via TreasuryManager
        const pendingRevenue = this.totalSubscriptionRevenue;

        return {
            executed: true,
            signal,
            stats: this.getStats(),
            pendingRevenue: pendingRevenue.toString(),
        };
    }

    getStats() {
        return {
            totalSignalsGenerated: this.totalSignalsGenerated,
            activeSubscribers: Array.from(this.subscribers.entries())
                .filter(([, v]) => v.expiry > Date.now()).length,
            totalSubscriptionRevenue: ethers.formatEther(this.totalSubscriptionRevenue),
            lastSignalTime: this.usageMetrics.lastSignalTime
                ? new Date(this.usageMetrics.lastSignalTime).toISOString() : 'Never',
            recentSignals: this.signals.slice(-5),
        };
    }
}

module.exports = DataServiceStrategy;
