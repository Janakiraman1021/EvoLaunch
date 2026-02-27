/**
 * @module marketData
 * @dev Rolling-window market metrics aggregator
 *      Fed by eventListener.js. Queried by marketAgent.js.
 */

const WINDOW_SIZE = 50; // Rolling N-event buffer

// Per-token buffers
const _transferBuffer = {};

/** Record a Transfer event — direction determined by AMM pair address */
const recordTransfer = (tokenAddress, event) => {
    const addr = tokenAddress.toLowerCase();
    if (!_transferBuffer[addr]) _transferBuffer[addr] = [];
    _transferBuffer[addr].push(event);
    // Keep only last WINDOW_SIZE events
    if (_transferBuffer[addr].length > WINDOW_SIZE) {
        _transferBuffer[addr].shift();
    }
};

/** Classify a transfer as buy, sell, or neutral */
const classifyTransfer = (event, pairAddress) => {
    const from = event.from?.toLowerCase();
    const to = event.to?.toLowerCase();
    const pair = pairAddress?.toLowerCase();
    if (from === pair) return 'buy';
    if (to === pair) return 'sell';
    return 'transfer';
};

/**
 * Returns aggregated rolling metrics for an address.
 * @returns {{ buyVolume, sellVolume, buyCount, sellCount, whaleCount, uniqueBuyers, buyPressure }}
 */
const getRollingMetrics = (tokenAddress, pairAddress, whaleThreshold = BigInt('10000000000000000000000')) => {
    const addr = tokenAddress.toLowerCase();
    const events = _transferBuffer[addr] || [];

    let buyVolume = 0n;
    let sellVolume = 0n;
    let buyCount = 0;
    let sellCount = 0;
    let whaleCount = 0;
    const uniqueBuyers = new Set();

    for (const ev of events) {
        const dir = classifyTransfer(ev, pairAddress);
        const amount = BigInt(ev.value?.toString() || '0');

        if (dir === 'buy') {
            buyVolume += amount;
            buyCount++;
            if (ev.to) uniqueBuyers.add(ev.to.toLowerCase());
        } else if (dir === 'sell') {
            sellVolume += amount;
            sellCount++;
        }
        if (amount >= whaleThreshold) whaleCount++;
    }

    const totalVolume = buyVolume + sellVolume;
    const buyPressure = totalVolume > 0n
        ? Number((buyVolume * 100n) / totalVolume)
        : 50;

    return {
        buyVolume: buyVolume.toString(),
        sellVolume: sellVolume.toString(),
        buyCount,
        sellCount,
        whaleCount,
        uniqueBuyers: uniqueBuyers.size,
        buyPressure,   // 0-100, >50 means more buying
        eventCount: events.length
    };
};

module.exports = { recordTransfer, getRollingMetrics };
