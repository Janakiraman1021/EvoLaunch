'use client';

import React from 'react';
import { Cpu, DollarSign, Wallet, ArrowDownRight, ArrowUpRight, BarChart4 } from 'lucide-react';

export default function AITreasuryPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pt-8 max-w-7xl mx-auto pb-24">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
          <Cpu className="text-gold" size={36} /> AI Treasury Base
        </h1>
        <p className="text-white/40 text-lg">
          Master accounting pool for cross-agent liquidity and rewards.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="md:col-span-2 luxury-card p-8 border border-white/5 shadow-none overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8">
             <Wallet size={120} className="text-white/5 stroke-[0.5]" />
           </div>
           <div className="relative z-10 h-full flex flex-col justify-center gap-6">
              <div>
                 <h2 className="text-sm font-bold uppercase tracking-widest text-gold mb-2">Total Institutional Value</h2>
                 <div className="text-5xl font-black font-mono text-white">$14,250,551 <span className="text-xl text-white/30 uppercase">USD</span></div>
              </div>
              <div className="flex gap-4">
                 <button className="px-6 py-3 rounded-xl bg-gold/10 border border-gold/30 text-gold font-bold text-xs uppercase tracking-widest hover:bg-gold hover:text-background transition-all flex items-center gap-2">
                    <ArrowDownRight size={16} /> Deposit
                 </button>
                 <button className="px-6 py-3 rounded-xl border border-white/10 text-white/50 font-bold text-xs uppercase tracking-widest hover:border-white/30 hover:text-white transition-all flex items-center gap-2">
                    <ArrowUpRight size={16} /> Withdraw
                 </button>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="luxury-card p-6 border border-white/5 flex items-center justify-between group">
              <div>
                 <div className="text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1">BNB Balance</div>
                 <div className="text-xl font-bold font-mono text-white">42,510.5</div>
              </div>
              <img src="https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=024" className="w-8 h-8 opacity-50 grayscale transition-all group-hover:grayscale-0 group-hover:opacity-100" />
           </div>
           <div className="luxury-card p-6 border border-white/5 flex items-center justify-between group">
              <div>
                 <div className="text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1">USDT Balance</div>
                 <div className="text-xl font-bold font-mono text-white">1,450,210</div>
              </div>
              <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=024" className="w-8 h-8 opacity-50 grayscale transition-all group-hover:grayscale-0 group-hover:opacity-100" />
           </div>
        </div>
      </div>

      <div className="luxury-card p-8 border-white/5 min-h-[400px] mt-8 flex flex-col items-center justify-center text-center">
         <BarChart4 className="mx-auto text-white/10 mb-4" size={48} />
         <h3 className="text-lg font-bold">Capital Flow Activity</h3>
         <p className="text-white/40 text-sm max-w-sm mx-auto mt-2 tracking-wide leading-relaxed">
            Revenue sweeps and capital allocations will appear here once agents execute profitable cycles.
         </p>
      </div>

    </div>
  );
}
