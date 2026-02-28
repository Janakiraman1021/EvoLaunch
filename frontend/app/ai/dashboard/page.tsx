'use client';

import React from 'react';
import { Bot, Zap, Cpu, Activity, TrendingUp, BarChart3, Target, Server } from 'lucide-react';
import Link from 'next/link';

export default function AIDashboard() {
  const stats = [
    { label: 'Total Agents', value: '0', icon: Bot, trend: '+0%' },
    { label: 'Capital Deployed', value: '$0.00', icon: Cpu, trend: '+0%' },
    { label: 'Revenue Generated', value: '$0.00', icon: TrendingUp, trend: '+0%' },
    { label: 'Network Status', value: 'Operational', icon: Activity, trend: 'Optimal', color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pt-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
            <Bot className="text-gold" size={36} /> AI Command Center
          </h1>
          <p className="text-white/40 text-lg">
            Monitor and govern autonomous silicon entities.
          </p>
        </div>
        <Link href="/ai/launch" className="btn-primary flex items-center gap-2 bg-gold text-background">
          <Zap size={18} fill="currentColor" /> Initialize Agent
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="luxury-card p-6 flex flex-col gap-4 border border-gold/10 hover:border-gold/30">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <s.icon size={20} />
              </div>
              <span className={`text-xs font-bold ${s.color || 'text-gold'}`}>
                {s.trend}
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs uppercase tracking-widest text-white/40 font-bold mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Agents empty state */}
          <div className="luxury-card p-8 border border-gold/10 min-h-[300px] flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.05),transparent_70%)] pointer-events-none" />
             <div className="w-20 h-20 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 rounded-full border border-gold/20 border-dashed animate-spin-slow" />
                 <Server className="text-gold/50" size={32} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">No Active Agents</h3>
             <p className="text-white/40 text-sm max-w-md mx-auto mb-6">
                 Your institution currently has zero autonomous agents deployed. Initialize an agent to begin automated strategies.
             </p>
             <Link href="/ai/launch" className="px-6 py-2.5 rounded-xl border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest hover:bg-gold/10 transition-all flex items-center gap-2">
                 Initialize Agent
             </Link>
          </div>
        </div>

        <div className="space-y-8">
          {/* System Logs / Activity Feed */}
          <div className="luxury-card p-6 border border-gold/10 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] pointer-events-none" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white/50 mb-6 flex items-center gap-2">
              <Activity size={14} className="text-gold" /> Execution Log
            </h3>
            
            <div className="space-y-4 font-mono text-xs">
              <div className="flex gap-3 text-white/40">
                <span className="text-gold">[SYS]</span>
                <span>Initializing command center...</span>
              </div>
              <div className="flex gap-3 text-white/40">
                <span className="text-gold">[SYS]</span>
                <span>Connecting to Neural Node 0x7E...</span>
              </div>
              <div className="flex gap-3 text-white/40">
                <span className="text-emerald-400">[OK]</span>
                <span>Connection established.</span>
              </div>
              <div className="flex gap-3 text-white/40">
                <span className="text-gold">[SYS]</span>
                <span>Awaiting agent deployment instructions.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
