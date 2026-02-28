'use client';

import React from 'react';
import { TrendingUp, Copy, Eye, Play, History, Download } from 'lucide-react';
import Link from 'next/link';

export default function AIStrategiesPage() {
  const strategies = [
    { title: 'Delta Neutral Yield', type: 'Farming', risk: 'Low', return: '8-12% APY', used: 14 },
    { title: 'DEX Arbitrage Swarm', type: 'MEV', risk: 'Medium', return: '15-25% APY', used: 32 },
    { title: 'Momentum Scalper', type: 'Trading', risk: 'High', return: 'Variable', used: 8 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pt-8 max-w-7xl mx-auto pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
            <TrendingUp className="text-gold" size={36} /> Strategy Library
          </h1>
          <p className="text-white/40 text-lg">
            Institutional-grade algorithms for AI deployment.
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2 bg-transparent border border-gold/30 text-gold hover:bg-gold/10 shadow-none">
          <Download size={18} /> Upload Custom
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-12">
        {strategies.map((strat, idx) => (
           <div key={idx} className="luxury-card p-6 border border-gold/10 flex flex-col hover:border-gold/30 transition-all group relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-24 h-24 bg-gold/10 rounded-full blur-[30px] group-hover:bg-gold/20 transition-all pointer-events-none" />
               <div className="flex justify-between items-start mb-6 z-10">
                  <h3 className="text-xl font-bold text-white group-hover:text-gold">{strat.title}</h3>
                  <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded border ${strat.risk==='Low' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' : strat.risk==='High' ? 'border-rose-500/20 text-rose-400 bg-rose-500/10' : 'border-gold/20 text-gold bg-gold/10'}`}>
                    {strat.risk} Risk
                  </span>
               </div>
               
               <div className="space-y-3 mb-8 z-10 flex-1">
                 <div className="flex justify-between text-xs font-mono">
                   <span className="text-white/40">Category</span>
                   <span className="font-bold text-white">{strat.type}</span>
                 </div>
                 <div className="flex justify-between text-xs font-mono">
                   <span className="text-white/40">Est. Returns</span>
                   <span className="font-bold text-emerald-400">{strat.return}</span>
                 </div>
                 <div className="flex justify-between text-xs font-mono">
                   <span className="text-white/40">Active Agents</span>
                   <span className="font-bold text-white">{strat.used}</span>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-3 z-10 pt-4 border-t border-white/5">
                 <button className="py-2.5 rounded-xl border border-white/10 text-white/50 text-xs font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2">
                   <History size={14} /> Backtest
                 </button>
                 <Link href={`/ai/launch?strategy=${strat.title}`} className="py-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-background transition-all flex items-center justify-center gap-2">
                   <Play size={14} /> Deploy
                 </Link>
               </div>
           </div>
        ))}
      </div>
    </div>
  );
}
