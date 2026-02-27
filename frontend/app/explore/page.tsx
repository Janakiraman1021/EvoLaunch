'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Search, Filter, ShieldCheck, Zap } from 'lucide-react';
import api from '../../lib/api';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([
    { name: 'Alpha Prime Cluster', type: 'Core protocol', st: 'Stable', cap: '$2.5M' },
    { name: 'Hyper-Liquidity Node', type: 'High Velocity', st: 'Aggressive', cap: '$850k' },
    { name: 'Stability Mandate VI', type: 'Institutional', st: 'Defensive', cap: '$1.2M' },
    { name: 'Genesis Reserve', type: 'Protocol Owned', st: 'Optimal', cap: '$5.0M' },
    { name: 'Yield Aggregator II', type: 'Derivative', st: 'Stable', cap: '$120k' },
    { name: 'Network Governor', type: 'Governance', st: 'Stable', cap: '$0.0' },
  ]);

  // Filter items by search query
  const filteredItems = searchQuery
    ? items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : items;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pt-8 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Ecosystem Explorer</h1>
          <p className="text-muted text-lg font-body">Discover high-stability curated institutional mandates.</p>
        </div>

        <div className="flex items-center gap-4 bg-primary/[0.03] p-2 rounded-2xl border border-primary/10 w-full max-w-md">
          <Search className="text-muted ml-4" size={20} />
          <input
            type="text"
            placeholder="Search clusters, mandates, or entities..."
            className="bg-transparent border-none outline-none text-primary text-sm w-full py-3 px-2 placeholder:text-muted/30"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="px-6 py-2.5 bg-secondary border border-primary/5 rounded-xl text-xs font-bold text-gold uppercase tracking-widest hover:border-gold/30 transition-all">
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item, i) => (
          <div key={i} className="luxury-card p-10 flex flex-col gap-8 group">
            <div className="shine-sweep" />
            <div className="flex justify-between items-start relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-transparent border border-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-gold" size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${item.st === 'Aggressive' ? 'bg-status-warning/10 text-status-warning border border-status-warning/20' : 'bg-status-success/10 text-status-success border border-status-success/20'}`}>
                {item.st}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-primary tracking-tight group-hover:text-gold transition-colors">{item.name}</h3>
              <p className="text-xs text-muted uppercase tracking-[0.2em] font-bold mt-2">{item.type}</p>
            </div>
            <div className="flex justify-between items-center relative z-10 pt-4 border-t border-primary/5">
              <div className="text-sm font-bold text-primary tracking-tight">{item.cap}</div>
              <button className="text-xs font-bold text-gold uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                Inspect <Zap size={14} />
              </button>
            </div>
          </div>
        ))
        }
      </div>
    </div>
  );
}
