'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Wallet, Activity, AlertCircle, BarChart3, PieChart } from 'lucide-react';
import Link from 'next/link';
import api from '../../lib/api';
import { useContracts } from '../../lib/hooks/useContracts';
import { useWeb3 } from '../../lib/hooks/useWeb3';
import { useLaunches } from '../../lib/hooks/useLaunches';
import { CONTRACT_ADDRESSES } from '../../lib/contracts';

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState('24h');
  const { wallet } = useWeb3();
  const contracts = useContracts(wallet?.address);
  const { launches, loading: launchesLoading } = useLaunches();

  const [stats, setStats] = useState({
    portfolio: '0 BNB',
    unrealizedGains: '+0%',
    activePositions: 0,
    totalValue: '0 BNB',
    dailyChange: '0 BNB',
  });

  const [positions, setPositions] = useState<any[]>([]);

  const [recentActivity] = useState<any[]>([]);

  // Build positions from launched tokens
  useEffect(() => {
    if (launches.length > 0) {
      const newPositions = launches.map(l => ({
        symbol: l.symbol,
        amount: Number(l.totalSupply).toLocaleString(),
        value: `Tax ${l.sellTax}%/${l.buyTax}%`,
        change: `MSS ${l.mss}`,
        phase: l.phaseName,
        address: l.tokenAddress,
      }));
      setPositions(newPositions);
      setStats(prev => ({ ...prev, activePositions: launches.length }));
    }
  }, [launches]);

  // Update with on-chain data for user balance
  useEffect(() => {
    if (contracts.token && contracts.userBalance) {
      const balance = parseFloat(contracts.userBalance);
      if (balance > 0) {
        setStats(prev => ({ ...prev, portfolio: `${balance.toFixed(2)} ${contracts.token!.symbol}` }));
      }
    }
  }, [contracts.token, contracts.userBalance]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-emerald-500/20 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-primary">
            Dashboard <span className="text-emerald-400">Overview</span>
          </h1>
          <p className="text-slate-400 mt-1">Track your portfolio and trading activity</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400">Portfolio Value</p>
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.totalValue}</p>
            <p className="text-emerald-400 text-sm mt-2">+{stats.dailyChange} today</p>
          </div>

          <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400">Available Balance</p>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.portfolio}</p>
            <p className="text-slate-400 text-sm mt-2">Ready to trade</p>
          </div>

          <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400">Active Positions</p>
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.activePositions}</p>
            <p className="text-slate-400 text-sm mt-2">Tokens held</p>
          </div>

          <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400">Unrealized Gains</p>
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400">{stats.unrealizedGains}</p>
            <p className="text-slate-400 text-sm mt-2">Performance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Positions Table */}
            <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-slate-700/50">
                <h2 className="text-2xl font-bold text-primary">Your Positions</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <th className="px-6 py-3 text-left text-slate-400 font-semibold">Token</th>
                      <th className="px-6 py-3 text-left text-slate-400 font-semibold">Amount</th>
                      <th className="px-6 py-3 text-left text-slate-400 font-semibold">Value</th>
                      <th className="px-6 py-3 text-left text-slate-400 font-semibold">Change</th>
                      <th className="px-6 py-3 text-left text-slate-400 font-semibold">Phase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position, idx) => (
                      <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition">
                        <td className="px-6 py-4">
                          <Link href={`/explore`} className="font-bold text-emerald-400 hover:text-emerald-300">
                            {position.symbol}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{position.amount}</td>
                        <td className="px-6 py-4 font-semibold text-primary">{position.value}</td>
                        <td className={`px-6 py-4 font-semibold ${position.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                          {position.change}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/50">
                            {position.phase}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {positions.length === 0 && !launchesLoading && (
                  <div className="text-center py-12 text-muted">
                    <p className="text-sm uppercase tracking-widest font-bold mb-4">No tokens launched yet</p>
                    <Link href="/launch" className="text-xs text-gold uppercase tracking-widest hover:underline">Launch your first token →</Link>
                  </div>
                )}
                {launchesLoading && (
                  <div className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-muted text-xs uppercase tracking-widest">Scanning chain...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-primary mb-6">Recent Activity</h2>

              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg border border-slate-600/30 hover:border-emerald-400/30 transition">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${activity.type === 'buy' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      <div>
                        <p className="font-semibold text-primary">
                          {activity.type === 'buy' ? '📈 Buy' : '📉 Sell'} {activity.symbol}
                        </p>
                        <p className="text-xs text-slate-400">{activity.amount} @ {activity.price}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Watchlist */}
            <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
              <h2 className="text-lg font-bold text-primary mb-4">Top Gainers</h2>

              <div className="space-y-3">
                <div className="p-3 bg-slate-700/30 rounded border border-slate-600/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-primary font-semibold">NOVA</span>
                    <span className="text-emerald-400 font-bold">+45.2%</span>
                  </div>
                  <p className="text-xs text-slate-400">0.00025 BNB</p>
                </div>

                <div className="p-3 bg-slate-700/30 rounded border border-slate-600/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-primary font-semibold">PULSE</span>
                    <span className="text-emerald-400 font-bold">+32.1%</span>
                  </div>
                  <p className="text-xs text-slate-400">0.00089 BNB</p>
                </div>

                <div className="p-3 bg-slate-700/30 rounded border border-slate-600/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-primary font-semibold">NEXUS</span>
                    <span className="text-emerald-400 font-bold">+28.9%</span>
                  </div>
                  <p className="text-xs text-slate-400">0.00042 BNB</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
              <h2 className="text-lg font-bold text-primary mb-4">Quick Actions</h2>

              <div className="space-y-2">
                <Link
                  href="/explore"
                  className="block p-3 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 text-center font-semibold transition"
                >
                  Explore Launches
                </Link>
                <Link
                  href="/launch"
                  className="block p-3 rounded bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 text-slate-300 text-center font-semibold transition"
                >
                  Create Launch
                </Link>
              </div>
            </div>

            {/* Risk Alert */}
            <div className="bg-red-500/10 border border-red-400/50 rounded-lg p-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-300 mb-1">Market Alert</h3>
                  <p className="text-sm text-red-200">Volatility increased 15% in the last hour</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
