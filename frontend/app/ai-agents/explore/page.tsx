'use client';

import React, { useState } from 'react';
import { Compass, Search, Filter, ShieldCheck, Zap, Rocket, Activity } from 'lucide-react';
import Link from 'next/link';
import { useLaunches } from '../../../lib/hooks/useLaunches';
import { CONTRACT_ADDRESSES } from '../../../lib/contracts';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { launches, loading } = useLaunches();

  const filteredItems = searchQuery
    ? launches.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : launches;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pt-8 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Ecosystem Explorer</h1>
          <p className="text-muted text-lg font-body">
            {launches.length > 0
              ? `${launches.length} agent${launches.length > 1 ? 's' : ''} initialized via Neural Factory`
              : loading ? 'Scanning neural registry...' : 'No agents registered yet'}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-primary/[0.03] p-2 rounded-2xl border border-primary/10 w-full max-w-md">
          <Search className="text-muted ml-4" size={20} />
          <input
            type="text"
            placeholder="Search agents by signature or identifier..."
            className="bg-transparent border-none outline-none text-primary text-sm w-full py-3 px-2 placeholder:text-muted/30"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="px-6 py-2.5 bg-secondary border border-primary/5 rounded-xl text-xs font-bold text-gold uppercase tracking-widest hover:border-gold/30 transition-all">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-6" />
          <p className="text-muted text-sm uppercase tracking-widest font-bold">Scanning blockchain events...</p>
        </div>
      )}

      {!loading && launches.length === 0 && (
        <div className="luxury-card p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mx-auto mb-8">
            <Rocket size={40} />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-4">No Agents Initialized</h3>
          <p className="text-muted text-sm max-w-md mx-auto mb-8">
            Be the first to authorize a neural agent through the EvoLaunch Factory.
          </p>
          <Link href="/ai-agents/launch" className="btn-primary inline-block">
            Initialize Agent
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item, i) => (
          <div key={i} className="luxury-card p-10 flex flex-col gap-8 group">
            <div className="shine-sweep" />
            <div className="flex justify-between items-start relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-transparent border border-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-gold" size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${item.mss >= 70
                ? 'bg-status-success/10 text-status-success border border-status-success/20'
                : item.mss >= 40
                  ? 'bg-status-warning/10 text-status-warning border border-status-warning/20'
                  : 'bg-gold/10 text-gold border border-gold/20'
                }`}>
                {item.phaseName}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-primary tracking-tight group-hover:text-gold transition-colors">{item.name}</h3>
              <p className="text-xs text-muted uppercase tracking-[0.2em] font-bold mt-2">{item.symbol} · MSS {item.mss}</p>
            </div>
            <div className="flex justify-between items-center relative z-10 pt-4 border-t border-primary/5">
              <div className="text-sm font-bold text-primary tracking-tight">
                {Number(item.totalSupply).toLocaleString()} tokens
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`${CONTRACT_ADDRESSES.BLOCK_EXPLORER}/address/${item.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Search size={14} /> Explorer
                </a>
                <Link
                  href={`/trade/${item.tokenAddress}`}
                  className="text-xs font-bold bg-gold/10 text-gold border border-gold/20 px-4 py-2 rounded-xl uppercase tracking-widest flex items-center gap-2 hover:bg-gold hover:text-secondary hover:scale-105 transition-all"
                >
                  Trade <Activity size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
