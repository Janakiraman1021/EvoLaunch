'use client';

import React, { useState } from 'react';
import { Network, Activity, Cpu, ShieldAlert, BarChart3, Database, Key } from 'lucide-react';
import Link from 'next/link';

export default function AgentTerminalPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Performance', 'Treasury', 'Strategy', 'Logs', 'Transactions'];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pt-8 pb-32 max-w-7xl mx-auto">
      {/* Header Profile */}
      <div className="luxury-card p-8 border border-gold/20 relative overflow-hidden flex flex-wrap gap-8 justify-between items-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[80px] pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-background to-[#1a1a20] border border-gold/30 flex items-center justify-center p-1 shadow-[0_0_30px_rgba(201,168,76,0.15)] relative group overflow-hidden">
            <Cpu className="text-gold relative z-10" size={32} />
            <div className="absolute inset-0 border border-gold/50 rounded-2xl border-dashed animate-spin-slow opacity-50" />
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-white tracking-tight">Nexus Alpha</h1>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm mt-2 font-mono text-white/50">
              <span className="text-gold">0x1A2B...3C4D</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="uppercase tracking-[0.2em] text-xs font-sans font-bold">MEV Arbitrage</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 relative z-10">
           <div className="text-right">
             <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">30d ROI</div>
             <div className="text-3xl font-black text-emerald-400 font-mono">+42.5%</div>
           </div>
           <div className="h-12 w-[1px] bg-white/10" />
           <div className="text-right">
             <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Managed TVL</div>
             <div className="text-2xl font-black text-white font-mono">1,250 <span className="text-sm text-gold">BNB</span></div>
           </div>
        </div>
      </div>

      {/* Terminal Navigation */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5 pb-px relative">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all relative ${
              activeTab === tab ? 'text-gold' : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gold shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* Terminal Content Tabs */}
      <div className="min-h-[400px]">
        {activeTab === 'Overview' && (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="luxury-card p-8 border border-white/5 space-y-6">
               <h3 className="text-sm font-black uppercase tracking-widest text-gold flex items-center gap-2">
                  <Activity size={16} /> Operational Metrics
               </h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-white/5 pb-4 text-sm">
                   <span className="text-white/50 font-bold">Total Trades Executed</span>
                   <span className="font-mono font-bold text-white">4,281</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-white/5 pb-4 text-sm">
                   <span className="text-white/50 font-bold">Win Rate</span>
                   <span className="font-mono font-bold text-emerald-400">89.4%</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-white/5 pb-4 text-sm">
                   <span className="text-white/50 font-bold">Avg Slippage</span>
                   <span className="font-mono font-bold text-white">0.02%</span>
                 </div>
                 <div className="flex justify-between items-center pb-2 text-sm">
                   <span className="text-white/50 font-bold">Last Execution</span>
                   <span className="font-mono font-bold text-white/50">2 mins ago</span>
                 </div>
               </div>
             </div>
             
             <div className="luxury-card p-8 border border-white/5 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-gold flex items-center gap-2">
                  <Key size={16} /> Node Status
               </h3>
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">Signature Validation</div>
                   <div className="text-emerald-400 text-sm font-mono font-bold">Ed25519 Verified</div>
                 </div>
                 <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">Latency</div>
                   <div className="text-white text-sm font-mono font-bold">42ms</div>
                 </div>
                 <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">Risk Controller</div>
                   <div className="text-emerald-400 text-sm font-mono font-bold">Active</div>
                 </div>
                 <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">Circuit Breaker</div>
                   <div className="text-emerald-400 text-sm font-mono font-bold">Armed, 15%</div>
                 </div>
               </div>
             </div>
          </div>
        )}

        {(activeTab !== 'Overview') && (
          <div className="luxury-card p-16 text-center border-white/5 animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <Database className="text-gold/50" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{activeTab} Interface Terminal</h3>
            <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
              Connecting to secure enclave. Data stream for {activeTab.toLowerCase()} will initialize shortly.
            </p>
            <div className="w-32 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
               <div className="h-full bg-gold w-1/3 animate-pulse rounded-full" />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
