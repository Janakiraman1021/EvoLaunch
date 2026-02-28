// Centralized mock data for agents UI
export const mockAgents = [
  { id: '1', name: 'Alpha Arbitrage', strategy: 'MEV Optimization', status: 'Active', aum: '$1.2M', returns: '+12.4%' },
  { id: '2', name: 'Beta Liquidity', strategy: 'LP Management', status: 'Active', aum: '$840K', returns: '+8.2%' },
];

export const mockPerformanceData = {
  volatility: [
    { time: '00:00', value: 45 }, { time: '04:00', value: 52 }, { time: '08:00', value: 38 },
    { time: '12:00', value: 65 }, { time: '16:00', value: 48 }, { time: '20:00', value: 55 },
  ],
  riskReturn: [
    { risk: 12, return: 15, size: 100 }, { risk: 18, return: 22, size: 200 },
    { risk: 8, return: 10, size: 150 }, { risk: 25, return: 30, size: 300 },
  ],
  capitalDeployment: [
    { name: 'Stable Pools', value: 45 }, { name: 'Volatile Pairs', value: 30 },
    { name: 'Treasury', value: 15 }, { name: 'Reserve', value: 10 },
  ],
  strategyFrequency: [
    { strategy: 'Arbitrage', count: 850 }, { strategy: 'Liquidations', count: 120 },
    { strategy: 'Rebalancing', count: 450 }, { strategy: 'Yield Harvest', count: 320 },
  ],
};

export const mockExecutionLogs = [
  { id: 'log_1', timestamp: '2024-02-28 10:00:00', action: 'Order Execution', detail: 'Bought 10.5 BNB at 380.25', status: 'Success' },
  { id: 'log_2', timestamp: '2024-02-28 10:05:00', action: 'Parameter Update', detail: 'Adjusted slippage tolerance to 0.5%', status: 'Success' },
];

export const mockSystemStatus = {
  health: 'Optimal',
  uptime: '99.98%',
  latency: '42ms',
  throughput: '1.2k req/s',
  activeNodes: 12,
  lastHeartbeat: 'Just now',
};
