'use client';

import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

export default function AIAnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pt-8 max-w-7xl mx-auto pb-24">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
          <BarChart3 className="text-gold" size={36} /> Network Analytics
        </h1>
        <p className="text-white/40 text-lg">
          Aggregate performance and institutional capital flows across all deployed AI agents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="luxury-card p-6 border border-white/5">
            <div className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2">Total Managed TVL</div>
            <div className="text-3xl font-black font-mono text-white">$14,250,551</div>
            <div className="text-xs text-emerald-400 mt-2 font-black">+2.4% vs last week</div>
         </div>
         <div className="luxury-card p-6 border border-emerald-500/20 bg-emerald-500/5">
            <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 mb-2">Cumulative Yield</div>
            <div className="text-3xl font-black font-mono text-emerald-400">$840,119</div>
            <div className="text-xs text-white/40 mt-2 font-black">Since inception</div>
         </div>
         <div className="luxury-card p-6 border border-white/5">
            <div className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2">Daily Tx Volume</div>
            <div className="text-3xl font-black font-mono text-white">45.2k</div>
            <div className="text-xs text-rose-400 mt-2 font-black">-1.2% vs yesterday</div>
         </div>
         <div className="luxury-card p-6 border border-white/5">
            <div className="text-[10px] uppercase font-bold tracking-widest text-gold mb-2">Execution Latency (Avg)</div>
            <div className="text-3xl font-black font-mono text-white">38ms</div>
            <div className="text-xs text-emerald-400 mt-2 font-black">Within optimal bounds</div>
         </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-12">
        <div className="luxury-card p-8 border border-white/5 min-h-[350px] flex items-center justify-center flex-col text-center">
           <TrendingUp className="text-gold/50 mb-4" size={48} />
           <h3 className="text-lg font-bold">Performance Matrix</h3>
           <p className="text-white/40 text-sm mt-2">Chart placeholder (e.g. Total Revenue / TVL over time)</p>
        </div>
        <div className="luxury-card p-8 border border-white/5 min-h-[350px] flex items-center justify-center flex-col text-center">
           <PieChart className="text-gold/50 mb-4" size={48} />
           <h3 className="text-lg font-bold">Strategy Allocation</h3>
           <p className="text-white/40 text-sm mt-2">Chart placeholder (e.g. MEV vs Yield vs Market Making)</p>
        </div>
      </div>
    </div>
  );
}
