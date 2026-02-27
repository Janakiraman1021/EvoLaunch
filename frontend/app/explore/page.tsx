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

  const filteredLaunches = launches.filter((launch) => {
    const matchesPhase = filter === 'all' || launch.phase.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      launch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      launch.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPhase && matchesSearch;
  });

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      Protective: 'bg-red-50 border-red-200 text-red-700',
      Growth: 'bg-blue-50 border-blue-200 text-blue-700',
      Expansion: 'bg-green-50 border-green-200 text-green-700',
      Governance: 'bg-purple-50 border-purple-200 text-purple-700',
    };
    return colors[phase] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getMSSColor = (mss: number) => {
    if (mss < 25) return 'text-red-600';
    if (mss < 50) return 'text-amber-600';
    if (mss < 75) return 'text-green-600';
    return 'text-emerald-600';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-forest/10 bg-forest/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-forest mb-2">Live Launch Explorer</h1>
          <p className="text-forest/60">
            Browse all active adaptive token launches. Data updated in real-time from blockchain.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search by token name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-forest/20 rounded-lg focus:outline-none focus:border-forest"
          />

          <div className="flex gap-2 flex-wrap">
            {['all', 'protective', 'growth', 'expansion', 'governance'].map((phase) => (
              <button
                key={phase}
                onClick={() => setFilter(phase)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === phase
                    ? 'bg-forest text-white'
                    : 'border border-forest/20 text-forest hover:bg-forest/5'
                }`}
              >
                {phase === 'all' ? 'All Phases' : phase.charAt(0).toUpperCase() + phase.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Launches Grid */}
        {filteredLaunches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-forest/60">No launches found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredLaunches.map((launch) => (
              <Link key={launch.id} href={`/project/${launch.symbol}`}>
                <div className="bg-white border-2 border-forest/20 rounded-lg p-6 hover:border-forest/50 transition cursor-pointer hover:shadow-lg">
                  <div className="grid md:grid-cols-2 gap-8 mb-6">
                    {/* Left Column */}
                    <div>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center text-forest font-bold text-lg">
                          {launch.symbol.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-forest">{launch.name}</h3>
                          <p className="text-forest/60 font-mono text-sm">{launch.symbol}</p>
                        </div>
                      </div>

                      <div className={`inline-block px-4 py-2 rounded-full border text-sm font-semibold ${getPhaseColor(launch.phase)}`}>
                        {launch.phase} Phase
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-forest/60">MSS Score</span>
                          <span className={`font-bold text-lg ${getMSSColor(launch.mss)}`}>{launch.mss}/100</span>
                        </div>
                        <div className="w-full bg-forest/10 rounded-full h-2">
                          <div
                            className="bg-forest/60 h-2 rounded-full"
                            style={{ width: `${launch.mss}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-forest/5 p-4 rounded-lg border border-forest/10">
                        <p className="text-xs text-forest/60 uppercase font-bold mb-1">Liquidity Locked</p>
                        <p className="text-lg font-bold text-forest">{launch.liquidityLocked}</p>
                      </div>
                      <div className="bg-forest/5 p-4 rounded-lg border border-forest/10">
                        <p className="text-xs text-forest/60 uppercase font-bold mb-1">Released</p>
                        <p className="text-lg font-bold text-forest">{launch.liquidityReleased}</p>
                      </div>
                      <div className="bg-forest/5 p-4 rounded-lg border border-forest/10">
                        <p className="text-xs text-forest/60 uppercase font-bold mb-1">Current Tax</p>
                        <p className="text-lg font-bold text-forest">{launch.taxRate}%</p>
                      </div>
                      <div className="bg-forest/5 p-4 rounded-lg border border-forest/10">
                        <p className="text-xs text-forest/60 uppercase font-bold mb-1">Volatility</p>
                        <p className="text-lg font-bold text-forest">{launch.volatility}</p>
                      </div>
                    </div>
                  </div>

                  {/* Volume & Metrics */}
                  <div className="border-t border-forest/10 pt-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-forest/60">
                        <BarChart3 size={16} />
                        <span>24h Vol: <strong className="text-forest">{launch.volume24h}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-forest/60">
                        <Activity size={16} />
                        <span>Active</span>
                      </div>
                    </div>
                    <div className="text-forest/60 hover:text-forest transition">
                      View Dashboard →
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
