'use client';

import React, { useState } from 'react';
import { Bot, Zap, ShieldAlert, Cpu, Activity, Settings, BarChart3, Save, TrendingUp } from 'lucide-react';

export default function LaunchAgentPage() {
  const [strategy, setStrategy] = useState('trading');

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pt-8 max-w-4xl mx-auto pb-24">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
          <Bot className="text-gold" size={36} /> Initialize Agent
        </h1>
        <p className="text-white/40 text-lg">
          Configure strategy bounds and deploy an autonomous silicon entity.
        </p>
      </div>

      <div className="luxury-card p-8 border border-gold/20 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[80px] pointer-events-none" />
        
        <div className="space-y-8 relative z-10">
          
          {/* Identity */}
          <section className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gold flex items-center gap-2">
              <Cpu size={16} /> 01. Agent Identity
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Designation Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Nexus Alpha" 
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Strategy Classification</label>
                <select 
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none transition-all appearance-none"
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                >
                  <option value="trading">Market Making / Trading</option>
                  <option value="yield">Yield Optimization</option>
                  <option value="arbitrage">MEV Arbitrage</option>
                  <option value="data">Data Monetization</option>
                </select>
              </div>
            </div>
          </section>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Capital Allocation */}
          <section className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gold flex items-center gap-2">
              <Activity size={16} /> 02. Treasury Parameters
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest text-emerald-400">Initial Funding (BNB)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full bg-background border border-emerald-500/20 rounded-xl px-4 py-3 text-emerald-400 font-black focus:border-emerald-500/50 focus:outline-none transition-all font-mono"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400/50">BNB</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Max Trade Size (BNB)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none transition-all font-mono"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/30">BNB</div>
                </div>
              </div>
            </div>
          </section>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Risk Bounds */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest text-gold flex items-center gap-2">
                <ShieldAlert size={16} /> 03. Institutional Risk Bounds
              </h3>
              <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white/40">Hardcoded at contract level</div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Max Allowed Slippage</label>
                  <span className="text-xs text-gold font-mono">1.5%</span>
                </div>
                <input type="range" className="w-full accent-gold" min="0.1" max="5" step="0.1" defaultValue="1.5" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Auto Circuit Breaker (Drawdown)</label>
                  <span className="text-xs text-rose-400 font-mono">15%</span>
                </div>
                <input type="range" className="w-full accent-rose-400" min="5" max="50" step="1" defaultValue="15" />
              </div>
            </div>
          </section>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Submit */}
          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Network validation ready</span>
            </div>
            
            <button className="px-8 py-4 rounded-xl bg-gold text-background font-black text-sm uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
               <Zap size={18} fill="currentColor" /> Compile & Deploy Agent
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
