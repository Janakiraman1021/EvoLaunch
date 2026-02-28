'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Activity, AlertTriangle, Zap, CheckCircle } from 'lucide-react';

interface AnalyticsData {
  liquidityDepthCurve: Array<{ price: number; depth: number }>;
  slippageSensitivity: Array<{ size: string; slippage: number }>;
  holderDistribution: Array<{ range: string; count: number; percentage: number }>;
  phaseMetrics: Array<{ phase: string; duration: string; volumeChange: number }>;
}

export default function AnalyticsPage({ params }: { params: { address: string } }) {
  const [analytics] = useState<AnalyticsData>({
    liquidityDepthCurve: [
      { price: 0.0040, depth: 45000 }, { price: 0.0041, depth: 52000 }, { price: 0.0042, depth: 68000 }, { price: 0.0043, depth: 54000 }, { price: 0.0044, depth: 38000 },
    ],
    slippageSensitivity: [
      { size: '$1,000', slippage: 0.2 }, { size: '$5,000', slippage: 0.8 }, { size: '$10,000', slippage: 2.1 }, { size: '$50,000', slippage: 8.5 }, { size: '$100,000', slippage: 18.3 },
    ],
    holderDistribution: [
      { range: '< 0.01%', count: 1850, percentage: 75 }, { range: '0.01% - 0.1%', count: 380, percentage: 15 }, { range: '0.1% - 1%', count: 180, percentage: 7 }, { range: '> 1%', count: 40, percentage: 3 },
    ],
    phaseMetrics: [
      { phase: 'Protective', duration: '8 days', volumeChange: -12 }, { phase: 'Growth', duration: '18 days', volumeChange: +145 }, { phase: 'Expansion', duration: '12 days', volumeChange: +87 },
    ],
  });

  return (
    <div className="min-h-screen bg-transparent">
      <div className="pb-12 border-b border-gold/[0.05]">
        <Link href="/ai-agents/explore" className="text-muted/60 hover:text-gold transition-all flex items-center gap-3 mb-8 text-xs font-bold uppercase tracking-widest group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Market Explorer
        </Link>
        <h1 className="text-5xl font-bold text-white tracking-tight mb-4 flex items-baseline gap-4">Neural <span className="text-gold italic font-serif">Deep</span> Analytics</h1>
        <p className="text-muted text-lg max-w-2xl leading-relaxed">High-fidelity cryptographic market analysis. Decrypting liquidity depth, slippage sensitivity, and holder concentration dynamics.</p>
      </div>

      <div className="py-12 space-y-12">
        <div className="luxury-card p-12 bg-secondary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/[0.02] -mr-32 -mt-32 rounded-full blur-3xl" />
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-5 tracking-tight"><BarChart3 size={32} className="text-gold" /> Liquidity Depth Matrix</h2>
          <p className="text-muted text-base mb-10 font-medium">Real-time liquidity distribution across the primary AMM mandate.</p>
          <div className="bg-black/40 rounded-2xl p-8 border border-white/[0.03] overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b border-white/5"><th className="text-left py-6 px-4 text-gold/40 text-[10px] font-bold uppercase tracking-[0.3em]">Temporal Price (BNB)</th><th className="text-left py-6 px-4 text-gold/40 text-[10px] font-bold uppercase tracking-[0.3em]">Depth Capacity (Mandates)</th><th className="text-left py-6 px-4 text-gold/40 text-[10px] font-bold uppercase tracking-[0.3em]">Neural Weight</th></tr></thead>
              <tbody className="divide-y divide-white/[0.02]">
                {analytics.liquidityDepthCurve.map((point, idx) => {
                  const maxDepth = Math.max(...analytics.liquidityDepthCurve.map(p => p.depth));
                  const share = (point.depth / maxDepth) * 100;
                  return (
                    <tr key={idx} className="group hover:bg-gold/[0.02] transition-colors">
                      <td className="py-6 px-4 font-mono text-white text-base font-bold">{point.price.toFixed(4)}</td>
                      <td className="py-6 px-4 font-mono text-gold font-bold text-base">{point.depth.toLocaleString()}</td>
                      <td className="py-6 px-4"><div className="w-48 bg-secondary/50 rounded-full h-1.5 p-0.5 border border-white/5"><div className="bg-gold h-full rounded-full transition-all duration-1000 shadow-gold-glow group-hover:bg-white" style={{ width: `${share}%` }} /></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-8 p-6 bg-gold/5 border border-gold/10 rounded-2xl flex items-center gap-4"><BarChart3 size={20} className="text-gold" /><p className="text-xs font-bold text-gold/80 uppercase tracking-widest leading-relaxed">Operational Depth peak detected at 0.0042 BNB. Liquidity buffer optimized for high-volume mandates.</p></div>
        </div>

        <div className="luxury-card p-12 bg-secondary/20">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-5 tracking-tight"><Zap size={32} className="text-gold" /> Slippage Impact Vector</h2>
          <p className="text-muted text-base mb-12 font-medium">Predictive price impact models for institutional trade sizes.</p>
          <div className="grid gap-8">
            {analytics.slippageSensitivity.map((data, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center gap-6 group">
                <div className="w-32 text-[10px] font-bold text-muted uppercase tracking-[0.3em] font-mono group-hover:text-gold transition-colors">{data.size}</div>
                <div className="flex-1 w-full bg-black/40 rounded-full h-2 border border-white/5 overflow-hidden p-0.5"><div className={`h-full rounded-full transition-all duration-1000 ${data.slippage < 5 ? 'bg-status-success shadow-status-success' : data.slippage < 10 ? 'bg-status-warning shadow-status-warning' : 'bg-status-danger shadow-status-danger'}`} style={{ width: `${Math.min(data.slippage * 5, 100)}%` }} /></div>
                <div className="w-24 text-right font-mono text-xl font-bold text-white tracking-tighter">{data.slippage.toFixed(2)}%</div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-white/5"><p className="text-[10px] text-muted uppercase font-bold tracking-[0.2em] leading-relaxed max-w-xl">Execution optimization recommended: Split orders exceeding 50,000 mandates to minimize price displacement.</p></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="luxury-card p-12 bg-secondary/20">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-5 tracking-tight"><Activity size={32} className="text-gold" /> Distribution Balance</h2>
            <p className="text-muted text-base mb-12 font-medium">Supply concentration across the participant network.</p>
            <div className="space-y-10">
              {analytics.holderDistribution.map((dist, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-4"><span className="text-lg font-bold text-white group-hover:text-gold transition-colors tracking-tight">{dist.range} Supply</span><span className="text-[10px] text-muted font-bold tracking-widest uppercase">{dist.count} Identity Wallets</span></div>
                  <div className="w-full bg-black/40 rounded-full h-2 border border-white/5 overflow-hidden p-0.5"><div className="bg-gold h-full rounded-full transition-all duration-1000 shadow-gold-glow group-hover:bg-white" style={{ width: `${dist.percentage}%` }} /></div>
                  <p className="text-[9px] text-gold/40 mt-3 font-bold uppercase tracking-widest">{dist.percentage}% Ecosystem Share</p>
                </div>
              ))}
            </div>
            <div className="mt-12 bg-status-success/5 border border-status-success/20 p-6 rounded-2xl flex items-center gap-4"><CheckCircle size={20} className="text-status-success" /><p className="text-xs font-bold text-status-success/80 uppercase tracking-widest">Concentration risk: MINIMAL. Decentralized distribution confirmed by Neural Scan.</p></div>
          </div>

          <div className="luxury-card p-12 bg-secondary/20">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-5 tracking-tight"><AlertTriangle size={32} className="text-gold" /> Whale Pulse Matrix</h2>
            <p className="text-muted text-base mb-12 font-medium">Temporal mapping of large volume transfers.</p>
            <div className="space-y-6">
              {[
                { day: 'MONDAY', activity: 15, level: 'low' }, { day: 'TUESDAY', activity: 8, level: 'min' }, { day: 'WEDNESDAY', activity: 22, level: 'med' }, { day: 'THURSDAY', activity: 5, level: 'min' }, { day: 'FRIDAY', activity: 32, level: 'high' }, { day: 'SATURDAY', activity: 10, level: 'min' }, { day: 'SUNDAY', activity: 7, level: 'min' },
              ].map((day, idx) => (
                <div key={idx} className="flex items-center gap-6 group">
                  <div className="w-24 text-[10px] font-bold text-muted uppercase tracking-[0.3em] font-mono group-hover:text-gold transition-colors">{day.day}</div>
                  <div className="flex-1 h-8 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden p-1"><div className={`h-full rounded-lg transition-all duration-1000 ${day.level === 'high' ? 'bg-status-danger/40 border border-status-danger/40 shadow-status-danger shadow-inner' : day.level === 'med' ? 'bg-status-warning/40 border border-status-warning/40' : 'bg-status-success/40 border border-status-success/40'}`} style={{ width: `${(day.activity / 35) * 100}%` }} /></div>
                  <span className="w-16 text-right text-xs font-bold text-white/50 font-mono tracking-tighter">{day.activity} TXS</span>
                </div>
              ))}
            </div>
            <div className="mt-12 p-6 bg-status-warning/5 border border-status-warning/20 rounded-2xl flex items-center gap-4"><AlertTriangle size={20} className="text-status-warning" /><p className="text-xs font-bold text-status-warning/80 uppercase tracking-widest">Caution: Peak frequency detected on Friday epoch. High volatility predicted.</p></div>
          </div>
        </div>

        <div className="luxury-card p-12 bg-secondary/20">
          <h2 className="text-3xl font-bold text-white mb-10 tracking-tight">Temporal Phase Evolution Matrix</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {analytics.phaseMetrics.map((metric, idx) => (
              <div key={idx} className="luxury-card p-8 bg-black/40 border-gold/10 hover:border-gold/30 group transition-all">
                <p className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-6">{metric.phase} Protocol</p>
                <div className="space-y-6">
                  <div><p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1 opacity-60">Temporal Duration</p><p className="text-2xl font-bold text-white tracking-tight">{metric.duration}</p></div>
                  <div className="pt-6 border-t border-white/[0.03]"><p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1 opacity-60">Delta Volume Shift</p><p className={`text-2xl font-bold tracking-tighter ${metric.volumeChange > 0 ? 'text-status-success shadow-status-success' : 'text-status-danger shadow-status-danger'}`}>{metric.volumeChange > 0 ? '+' : ''}{metric.volumeChange}%</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
