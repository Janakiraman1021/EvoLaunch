'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

interface Launch {
  id: string;
  name: string;
  symbol: string;
  phase: string;
  mss: number;
  liquidityLocked: string;
  liquidityReleased: string;
  taxRate: number;
  volume24h: string;
  volatility: number;
}

export default function ExplorePage() {
  const [launches, setLaunches] = useState<Launch[]>([
    {
      id: '1',
      name: 'EvoToken Alpha',
      symbol: 'EVOA',
      phase: 'Growth',
      mss: 45,
      liquidityLocked: '125,340 BNB',
      liquidityReleased: '23,450 BNB',
      taxRate: 4.5,
      volume24h: '1.2M BNB',
      volatility: 3.2,
    },
    {
      id: '2',
      name: 'Adaptive Finance',
      symbol: 'ADFN',
      phase: 'Expansion',
      mss: 72,
      liquidityLocked: '89,200 BNB',
      liquidityReleased: '45,600 BNB',
      taxRate: 2.1,
      volume24h: '2.3M BNB',
      volatility: 2.1,
    },
    {
      id: '3',
      name: 'Protocol Genesis',
      symbol: 'PGEN',
      phase: 'Protective',
      mss: 18,
      liquidityLocked: '250,000 BNB',
      liquidityReleased: '0 BNB',
      taxRate: 8.2,
      volume24h: '456K BNB',
      volatility: 5.8,
    },
  ]);

  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent p-12 space-y-12">
        <div className="space-y-4">
          <div className="h-12 w-96 skeleton" />
          <div className="h-4 w-64 skeleton opacity-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 skeleton luxury-card" />
          ))}
        </div>
      </div>
    );
  }

  const filteredLaunches = launches.filter((launch) => {
    const matchesPhase = filter === 'all' || launch.phase.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      launch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      launch.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPhase && matchesSearch;
  });

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      Protective: 'border-status-danger/30 text-status-danger bg-status-danger/5',
      Growth: 'border-gold/30 text-gold bg-gold/5',
      Expansion: 'border-white/30 text-white bg-white/5',
      Governance: 'border-gold/50 text-gold bg-gold/10',
    };
    return colors[phase] || 'border-muted/30 text-muted bg-muted/5';
  };

  const getMSSColor = (mss: number) => {
    if (mss < 25) return 'text-status-danger';
    if (mss < 50) return 'text-status-warning';
    if (mss < 75) return 'text-gold';
    return 'text-white';
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="pb-12 border-b border-gold/[0.05]">
        <h1 className="text-5xl font-bold text-white tracking-tight mb-4 flex items-baseline gap-4">
          Institutional <span className="text-gold italic font-serif">Explorer</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl leading-relaxed">
          Real-time auditing of adaptive token launches. Cryptographic verification of liquidity flows and tax adjustments.
        </p>
      </div>

      <div className="py-12 space-y-12">
        {/* Search & Filter Matrix */}
        <div className="grid md:grid-cols-3 gap-8 items-end">
          <div className="md:col-span-2 space-y-3">
            <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-2">Audit Search</label>
            <input
              type="text"
              placeholder="Search by identifier or protocol name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-secondary/50 border border-gold/[0.08] rounded-2xl px-8 py-4 focus:bg-secondary focus:border-gold/30 outline-none transition-all text-white font-medium"
            />
          </div>

          <div className="flex gap-3 flex-wrap justify-end">
            {['all', 'protective', 'growth', 'expansion', 'governance'].map((phase) => (
              <button
                key={phase}
                onClick={() => setFilter(phase)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 border ${
                  filter === phase
                    ? 'bg-gold text-background border-gold shadow-gold-glow'
                    : 'bg-secondary/50 border-gold/10 text-muted hover:border-gold/30 hover:text-white'
                }`}
              >
                {phase}
              </button>
            ))}
          </div>
        </div>

        {/* Launches Grid */}
        {filteredLaunches.length === 0 ? (
          <div className="luxury-card p-20 text-center bg-secondary/20">
            <p className="text-muted/40 uppercase tracking-[0.3em] font-bold">No active mandates found</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {filteredLaunches.map((launch) => (
              <Link key={launch.id} href={`/project/${launch.symbol}`}>
                <div className="luxury-card p-10 hover:border-gold/40 cursor-pointer group shadow-luxury-soft">
                  <div className="grid lg:grid-cols-2 gap-12 mb-8">
                    {/* Identifier Column */}
                    <div>
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center text-background font-bold text-2xl shadow-gold-glow">
                          {launch.symbol.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white tracking-tight group-hover:text-gold transition-colors duration-500">{launch.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-gold/60 font-mono text-xs font-bold tracking-widest uppercase">{launch.symbol}</span>
                            <div className="w-1 h-1 rounded-full bg-muted/40" />
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${getPhaseColor(launch.phase)}`}>
                              {launch.phase} PHASE
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gold/[0.05]">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Stability Score</span>
                          <span className={`font-mono font-bold text-2xl ${getMSSColor(launch.mss)}`}>{launch.mss}/100</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gold h-full rounded-full transition-all duration-1000 group-hover:shadow-gold-glow"
                            style={{ width: `${launch.mss}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Operational Metrics Column */}
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { label: 'Liquidity Vault', val: launch.liquidityLocked },
                        { label: 'Released Asset', val: launch.liquidityReleased },
                        { label: 'Current Tax', val: `${launch.taxRate}%` },
                        { label: 'Volatility Index', val: launch.volatility },
                      ].map((item, i) => (
                        <div key={i} className="bg-secondary/40 p-6 rounded-2xl border border-gold/[0.03] group-hover:border-gold/[0.1] transition-all">
                          <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-2 opacity-60">{item.label}</p>
                          <p className="text-xl font-bold text-white tracking-tight">{item.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audit Trail Footer */}
                  <div className="border-t border-gold/[0.05] pt-8 flex items-center justify-between">
                    <div className="flex items-center gap-8 text-[10px] font-bold tracking-widest uppercase">
                      <div className="flex items-center gap-3 text-muted">
                        <BarChart3 size={14} className="text-gold" />
                        <span>24H Volume: <strong className="text-white ml-1">{launch.volume24h}</strong></span>
                      </div>
                      <div className="flex items-center gap-3 text-muted">
                        <Activity size={14} className="text-status-success shadow-gold-glow animate-pulse" />
                        <span className="text-status-success">Verified Active</span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gold uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform duration-500">
                      Audit Terminal →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
