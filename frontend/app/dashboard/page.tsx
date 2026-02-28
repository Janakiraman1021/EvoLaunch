'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Wallet, Activity, AlertCircle, BarChart3, Zap, Shield, Compass } from 'lucide-react';
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

  useEffect(() => {
    if (wallet?.balance) {
      setStats(prev => ({ ...prev, portfolio: `${wallet.balance} BNB`, totalValue: `${wallet.balance} BNB` }));
    }
  }, [wallet?.balance]);

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      {/* Global Ecosystem Ticker */}
      <div className="w-full h-8 overflow-hidden border-y border-gold/10 flex items-center bg-secondary relative z-20">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex gap-12 items-center px-12">
              <span className="text-xs font-bold text-gold uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                PORTFOLIO: <span className="text-white">{stats.totalValue}</span>
              </span>
              <span className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
                POSITIONS: <span className="text-white">{stats.activePositions}</span>
              </span>
              <span className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
                MARKET_SYNC: <span className="text-emerald-400">ACTIVE</span>
              </span>
              <span className="text-xs font-bold text-gold uppercase tracking-[0.2em]">
                CHAIN_STATUS: <span className="text-white">BNB_MAINNET</span>
              </span>
              <span className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
                YIELD_MODE: <span className="text-white">ADAPTIVE</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gold/10 bg-background/90 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Dashboard
              <span className="text-gold">Overview</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
            </h1>
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Track your portfolio and trading activity</p>
          </div>
          <div className="flex gap-3">
            {['24h', '7d', '30d'].map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${timeframe === t
                    ? 'bg-gold text-background shadow-[0_0_12px_rgba(201,168,76,0.4)]'
                    : 'border border-white/10 text-white/40 hover:border-gold/30 hover:text-white/70'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Portfolio Value', value: stats.totalValue, sub: `+${stats.dailyChange} today`, icon: Wallet, trend: 'Growing' },
            { label: 'Available Balance', value: stats.portfolio, sub: 'Ready to trade', icon: TrendingUp, trend: 'Liquid' },
            { label: 'Active Positions', value: stats.activePositions, sub: 'Tokens held', icon: Activity, trend: 'Tracked' },
            { label: 'Unrealized Gains', value: stats.unrealizedGains, sub: 'Performance', icon: BarChart3, trend: 'Optimal' },
          ].map((stat, i) => (
            <div
              key={i}
              className="relative bg-secondary border border-white/[0.06] rounded-2xl p-7 flex flex-col gap-5 group hover:border-gold/30 transition-all duration-500 overflow-hidden"
            >
              {/* Shine sweep */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
              <div className="flex justify-between items-start relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gold/5 border border-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform shadow-[0_0_16px_rgba(201,168,76,0.1)]">
                  <stat.icon size={20} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</span>
                  <div className="text-2xl font-black text-white mt-1 tracking-tight group-hover:text-gold transition-colors">
                    {stat.value}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div className="h-0.5 flex-1 bg-white/5 rounded-full overflow-hidden mr-4">
                  <div className="h-full bg-gold/50 w-[70%] group-hover:w-[88%] transition-all duration-1000" />
                </div>
                <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">{stat.trend}</span>
              </div>
              <p className="text-white/30 text-xs font-bold tracking-widest uppercase relative z-10">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Positions Table */}
            <div className="bg-secondary border border-white/[0.06] rounded-2xl overflow-hidden group hover:border-gold/20 transition-all duration-500">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Your Positions</h2>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mt-1">Live Execution Matrix</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-gold text-background text-[10px] font-black tracking-[0.1em] shadow-[0_0_12px_rgba(201,168,76,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer">
                  LIVE_FEED
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-card/50">
                      <th className="px-7 py-4 text-left text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">Token</th>
                      <th className="px-7 py-4 text-left text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">Amount</th>
                      <th className="px-7 py-4 text-left text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">Value</th>
                      <th className="px-7 py-4 text-left text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">MSS</th>
                      <th className="px-7 py-4 text-left text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">Phase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position, idx) => (
                      <tr key={idx} className="border-b border-white/[0.04] hover:bg-gold/[0.03] transition-all group/row">
                        <td className="px-7 py-5">
                          <Link href="/explore" className="font-black text-gold hover:text-[#E8C96A] tracking-wide transition-colors">
                            {position.symbol}
                          </Link>
                        </td>
                        <td className="px-7 py-5 text-white/60 font-bold text-xs tracking-widest">{position.amount}</td>
                        <td className="px-7 py-5 font-black text-white text-sm">{position.value}</td>
                        <td className={`px-7 py-5 font-black text-sm ${position.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                          {position.change}
                        </td>
                        <td className="px-7 py-5">
                          <span className="px-3 py-1.5 rounded-lg text-[10px] font-black bg-gold/10 text-gold border border-gold/20 tracking-widest uppercase">
                            {position.phase}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {positions.length === 0 && !launchesLoading && (
                  <div className="text-center py-16">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20 mb-5">No tokens launched yet</p>
                    <Link
                      href="/launch"
                      className="text-[10px] text-gold uppercase tracking-[0.2em] font-black hover:text-[#E8C96A] transition-colors"
                    >
                      Launch your first token →
                    </Link>
                  </div>
                )}

                {launchesLoading && (
                  <div className="text-center py-10">
                    <div className="w-5 h-5 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-black">Scanning chain...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-secondary border border-white/[0.06] rounded-2xl p-8 hover:border-gold/20 transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Recent Activity</h2>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mt-1">Audit Command Trail</p>
                </div>
              </div>

              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-5 bg-card/70 rounded-xl border border-white/5 hover:border-gold/20 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${activity.type === 'buy' ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]' : 'bg-red-400'}`} />
                      <div>
                        <p className="font-black text-white text-sm">
                          {activity.type === 'buy' ? '📈 Buy' : '📉 Sell'} {activity.symbol}
                        </p>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">{activity.amount} @ {activity.price}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{activity.time}</p>
                  </div>
                ))}

                {recentActivity.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20">No activity recorded</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Gainers */}
            <div className="bg-secondary border border-white/[0.06] rounded-2xl p-7 hover:border-gold/20 transition-all duration-500">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <Zap size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white tracking-tight">Top Gainers</h2>
                  <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">Market Intel</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { symbol: 'NOVA', change: '+45.2%', price: '0.00025 BNB' },
                  { symbol: 'PULSE', change: '+32.1%', price: '0.00089 BNB' },
                  { symbol: 'NEXUS', change: '+28.9%', price: '0.00042 BNB' },
                ].map((token, i) => (
                  <div
                    key={i}
                    className="p-4 bg-card/70 rounded-xl border border-white/5 hover:border-gold/20 transition-all group/token"
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-black text-white text-sm group-hover/token:text-gold transition-colors">{token.symbol}</span>
                      <span className="font-black text-emerald-400 text-sm">{token.change}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{token.price}</p>
                      <div className="h-0.5 w-16 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400/50"
                          style={{ width: `${[90, 64, 58][i]}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-secondary border border-white/[0.06] rounded-2xl p-7 hover:border-gold/20 transition-all duration-500">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <Compass size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white tracking-tight">Quick Actions</h2>
                  <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">Execution Layer</p>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/explore"
                  className="block p-4 rounded-xl bg-gold text-background text-center font-black text-[11px] uppercase tracking-[0.15em] shadow-[0_0_16px_rgba(201,168,76,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Explore Launches
                </Link>
                <Link
                  href="/launch"
                  className="block p-4 rounded-xl border border-white/[0.08] text-white/60 text-center font-black text-[11px] uppercase tracking-[0.15em] hover:border-gold/30 hover:text-white transition-all"
                >
                  Create Launch
                </Link>
              </div>
            </div>

            {/* Risk Alert */}
            <div className="bg-red-500/5 border border-red-400/20 rounded-2xl p-7 hover:border-red-400/30 transition-all">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-400/20 flex items-center justify-center text-red-400 flex-shrink-0">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <h3 className="font-black text-red-300 text-sm mb-1 uppercase tracking-wide">Market Alert</h3>
                  <p className="text-[11px] text-red-200/60 font-bold leading-relaxed">
                    Volatility increased 15% in the last hour. Monitor positions closely.
                  </p>
                  <div className="mt-4 h-0.5 w-full bg-red-400/10 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400/50 w-[75%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stability Metrics */}
            <div className="bg-secondary border border-white/[0.06] rounded-2xl p-7 hover:border-gold/20 transition-all duration-500">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                  <Shield size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white tracking-tight">System Health</h2>
                  <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">Institutional Trust</p>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { label: 'Stability Buffer', value: '8.2%', width: '65%' },
                  { label: 'Network Load', value: 'Low', width: '30%', green: true },
                  { label: 'Agent Sync', value: '94.2%', width: '94%' },
                ].map((m, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">{m.label}</span>
                      <span className={`text-[10px] font-black ${m.green ? 'text-emerald-400' : 'text-gold'}`}>{m.value}</span>
                    </div>
                    <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${m.green ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]' : 'bg-gold shadow-[0_0_8px_rgba(201,168,76,0.5)]'}`}
                        style={{ width: m.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}