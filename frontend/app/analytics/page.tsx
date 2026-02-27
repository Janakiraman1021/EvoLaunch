'use client';

import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Globe } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pt-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Protocol Analytics</h1>
        <p className="text-muted text-lg font-body">Deep-dive into ecosystem metrics and liquidity dynamics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Network Velocity', value: '42.5k', icon: Activity, trend: '+12%' },
          { label: 'Active Clusters', value: '1,280', icon: Globe, trend: '+5%' },
          { label: 'Yield Efficiency', value: '98.2%', icon: TrendingUp, trend: 'Optimal' },
        ].map((stat, i) => (
          <div key={i} className="luxury-card p-10 flex flex-col gap-6 group">
            <div className="shine-sweep" />
            <div className="flex justify-between items-center relative z-10">
              <div className="icon-box-lg bg-gold/5 border-gold/20 text-gold shadow-gold-subtle">
                <stat.icon size={24} />
              </div>
              <span className="text-sm font-bold text-status-success">{stat.trend}</span>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-primary tracking-tighter">{stat.value}</div>
              <div className="text-xs text-muted font-bold uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="luxury-card p-12 h-[500px] flex items-center justify-center relative overflow-hidden group">
        <div className="shine-sweep" />
        <div className="absolute inset-0 bg-gold/[0.02] flex items-center justify-center">
            <BarChart3 className="text-gold opacity-5 scale-150" size={200} />
        </div>
        <div className="text-center relative z-10">
           <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6 border border-gold/20">
             <PieChart className="text-gold" size={32} />
           </div>
           <h2 className="text-2xl font-bold text-primary tracking-tight">Advanced Visualizer Booting...</h2>
           <p className="text-muted mt-2 text-sm uppercase tracking-widest font-bold">Synchronizing node data for real-time projection</p>
        </div>
      </div>
    </div>
  );
}
