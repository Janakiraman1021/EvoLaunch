'use client';

import React, { useState } from 'react';
import { Compass, Search, Filter, Cpu, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AIExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for AI agents since we don't have Smart Contracts for it yet
  const agents = [
    { name: 'Nexus Alpha', address: '0x1A2B...3C4D', strategy: 'MEV Arbitrage', roi: '+42.5%', status: 'Active', tvl: '1,250 BNB' },
    { name: 'Yield Constructor', address: '0x5E6F...7G8H', strategy: 'Yield Optimization', roi: '+18.2%', status: 'Active', tvl: '8,400 BNB' },
    { name: 'Market Maker V2', address: '0x9I0J...1K2L', strategy: 'Market Making', roi: '+5.7%', status: 'Paused', tvl: '500 BNB' },
  ];

  const filteredItems = searchQuery
    ? agents.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : agents;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pt-8 max-w-7xl mx-auto pb-24">
      <div className="flex flex-wrap items-center justify-between gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
            <Compass className="text-gold" size={36} /> Agent Explorer
          </h1>
          <p className="text-white/40 text-lg font-body">
            Browse and monitor autonomous AI entities in the ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/[0.03] p-2 rounded-2xl border border-white/10 w-full max-w-md">
          <Search className="text-white/40 ml-4" size={20} />
          <input
            type="text"
            placeholder="Search agents by name or address..."
            className="bg-transparent border-none outline-none text-white text-sm w-full py-3 px-2 placeholder:text-white/30"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="px-6 py-2.5 bg-background border border-white/5 rounded-xl text-xs font-bold text-gold uppercase tracking-widest hover:border-gold/30 transition-all">
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item, i) => (
          <div key={i} className="luxury-card p-10 flex flex-col gap-8 group border border-gold/10 hover:border-gold/30">
            <div className="shine-sweep" />
            <div className="flex justify-between items-start relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-transparent border border-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cpu className="text-gold" size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                 item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {item.status}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black text-white tracking-tight group-hover:text-gold transition-colors">{item.name}</h3>
              <p className="text-xs text-gold uppercase tracking-[0.2em] font-bold mt-2">{item.strategy}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <div className="text-[10px] uppercase text-white/30 font-bold mb-1 tracking-widest">30d ROI</div>
                <div className="text-lg text-emerald-400 font-mono font-bold">{item.roi}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-white/30 font-bold mb-1 tracking-widest">TVL</div>
                <div className="text-lg text-white font-mono font-bold">{item.tvl}</div>
              </div>
            </div>

            <div className="flex justify-between items-center relative z-10 pt-4 border-t border-white/5">
              <div className="text-xs font-mono text-white/40 tracking-tight flex items-center gap-2">
                Id: {item.address}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/ai/agent/${item.address}`}
                  className="text-[10px] font-black bg-gold/10 text-gold border border-gold/20 px-4 py-2 rounded-xl uppercase tracking-widest flex items-center gap-2 hover:bg-gold hover:text-background hover:scale-105 transition-all"
                >
                  Terminal <Activity size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
         <div className="text-center py-20 text-white/40">No agents found matching this criteria.</div>
      )}
    </div>
  );
}
