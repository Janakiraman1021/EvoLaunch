// /**
//  * @module healthMonitor
//  * @dev Monitors RPC provider health, block staleness, and agent availability.
//  *      Other services read SYSTEM_HEALTHY before executing.
//  */

// const { isProviderHealthy } = require('./blockchain');

// let SYSTEM_HEALTHY = true;
// let GOVERNANCE_FREEZE = false;
// let _lastGoodBlock = Date.now();
// const STALE_THRESHOLD_MS = 90000; // 90 seconds without new block = unhealthy

// const setGovernanceFreeze = (frozen) => {
//     GOVERNANCE_FREEZE = frozen;
//     console.log(`[HealthMonitor] Governance freeze: ${frozen}`);
// };

// const isSystemHealthy = () => SYSTEM_HEALTHY;
// const isGovernanceFrozen = () => GOVERNANCE_FREEZE;
// const markGoodBlock = () => { _lastGoodBlock = Date.now(); };

// const runHealthCheck = async () => {
//     try {
//         const rpcOk = await isProviderHealthy();
//         const blockFresh = (Date.now() - _lastGoodBlock) < STALE_THRESHOLD_MS;

//         if (!rpcOk) {
//             console.error('[HealthMonitor] ❌ RPC provider unhealthy');
//         }
//         if (!blockFresh) {
//             console.error('[HealthMonitor] ❌ Block data is stale — no new blocks in 90s');
//         }

//         const wasHealthy = SYSTEM_HEALTHY;
//         SYSTEM_HEALTHY = rpcOk && blockFresh;

//         if (!SYSTEM_HEALTHY && wasHealthy) {
//             console.error('[HealthMonitor] 🔴 System entered UNHEALTHY state — agent cycles halted');
//         } else if (SYSTEM_HEALTHY && !wasHealthy) {
//             console.log('[HealthMonitor] 🟢 System recovered — resuming agent cycles');
//         }
//     } catch (err) {
//         SYSTEM_HEALTHY = false;
//         console.error('[HealthMonitor] Unexpected error:', err.message);
//     }
// };

// const startHealthMonitor = () => {
//     console.log('[HealthMonitor] Starting health monitor (15s interval)');
//     runHealthCheck(); // Immediate check
//     setInterval(runHealthCheck, 15000);
// };

// const getHealthStatus = () => ({
//     healthy: SYSTEM_HEALTHY,
//     governanceFrozen: GOVERNANCE_FREEZE,
//     lastGoodBlock: new Date(_lastGoodBlock).toISOString()
// });

// module.exports = {
//     startHealthMonitor,
//     isSystemHealthy,
//     isGovernanceFrozen,
//     setGovernanceFreeze,
//     markGoodBlock,
//     getHealthStatus
// };
