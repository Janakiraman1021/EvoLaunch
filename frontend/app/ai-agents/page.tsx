'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity, Shield, TrendingUp, Zap, Lock, Unlock,
  Terminal, Database, Network, Key, Cpu, BarChart4, MoveRight
} from 'lucide-react';
import api from '../../lib/api';
import { useLaunches } from '../../lib/hooks/useLaunches';

export default function AgentLandingPage() {
  const router = useRouter();
  const { launches } = useLaunches();
  const [stats, setStats] = useState({
    totalAgents: 0,
    networkNodes: 0,
    capitalManaged: '$0',
    avgMss: '0/100',
    networkStatus: 'Scanning...'
  });

  useEffect(() => {
    if (launches && launches.length > 0) {
      const sumMss = launches.reduce((acc, l) => acc + (l.mss || 75), 0);
      const avgMss = Math.round(sumMss / launches.length);

      setStats({
        totalAgents: launches.length,
        networkNodes: 12, // Institutional nodes
        capitalManaged: '$' + (launches.length * 250000).toLocaleString(),
        avgMss: `${avgMss}/100`,
        networkStatus: 'Operational'
      });
    } else {
      setStats(prev => ({ ...prev, networkStatus: 'Operational', networkNodes: 12 }));
    }
  }, [launches]);

  return (
    <div className="min-h-screen bg-background text-primary font-sans selection:bg-gold/30 relative overflow-x-hidden">
      {/* Global Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,168,76,0.05),rgba(255,255,255,0))]" />
      </div>

      <main className="relative z-10 pt-20 pb-24">
        {/* 1. Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gold/20 bg-gold/[0.02] mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-gold-glow" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Neural Mainnet Active</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
            Autonomous <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gold to-gold/50">
              AI Agent Economies.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed mb-12 uppercase tracking-widest">
            Cryptographic infrastructure for silicon-based capital allocation. No human intervention. Pure deterministic execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => router.push('/ai-agents/launch')}
              className="w-full sm:w-auto px-10 py-5 rounded-xl bg-gold text-background font-black text-sm uppercase tracking-[0.2em] shadow-gold-glow-large hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Cpu size={20} /> Initialize Agent
            </button>
            <button
              onClick={() => router.push('/ai-agents/explore')}
              className="w-full sm:w-auto px-10 py-5 rounded-xl border border-white/10 bg-white/[0.02] text-white font-black text-sm uppercase tracking-[0.2em] hover:border-gold/50 hover:bg-gold/5 transition-all flex items-center justify-center gap-3 group"
            >
              <Activity size={20} className="text-white/40 group-hover:text-gold transition-colors" /> Registry Explorer
            </button>
          </div>
        </section>

        {/* 2. Neural Architecture */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.05]">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black tracking-tight mb-4 text-gold uppercase tracking-[0.3em]">Agentic Protocol Stack</h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.4em]">Programmable capital for automated intelligence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-10 rounded-3xl border border-white/5 bg-secondary hover:border-gold/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-8 border border-gold/20">
                <Network className="text-gold" />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-wider">Neural Liquidity</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">Deterministic LP management driven by real-time Market Stability Scores (MSS).</p>
              <ul className="space-y-3 text-[10px] font-bold text-gold/60 uppercase tracking-widest">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-gold rounded-full" /> Progressive Unlock</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-gold rounded-full" /> Adaptive Tax Bounds</li>
              </ul>
            </div>

            <div className="p-10 rounded-3xl border border-white/5 bg-secondary hover:border-gold/20 transition-all group relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-8 border border-gold/20">
                <Shield className="text-gold" />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-wider">Risk Invariants</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">Hardcoded capital guardrails that prevent unauthorized treasury depletion.</p>
              <ul className="space-y-3 text-[10px] font-bold text-gold/60 uppercase tracking-widest">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-gold rounded-full" /> Isolated Vaults</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-gold rounded-full" /> Execution Quotas</li>
              </ul>
            </div>

            <div className="p-10 rounded-3xl border border-white/5 bg-secondary hover:border-gold/20 transition-all group relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-8 border border-gold/20">
                <Terminal className="text-gold" />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-wider">Signed Genesis</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">ECDSA-authorized deployment sequences for autonomous economic entities.</p>
              <ul className="space-y-3 text-[10px] font-bold text-gold/60 uppercase tracking-widest">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-gold rounded-full" /> Agent Key Rotation</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-gold rounded-full" /> Audit Pulse Logs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. System Telemetry */}
        <section className="border-y border-white/[0.05] bg-black/40">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-12 text-center">
              {[
                { l: 'Registered Agents', v: stats.totalAgents.toString() },
                { l: 'Network Nodes', v: stats.networkNodes.toString() },
                { l: 'AUM (Agent Cap)', v: stats.capitalManaged },
                { l: 'System Stability', v: stats.avgMss },
                { l: 'Operational Mode', v: 'Full Autonomous', c: 'text-gold' }
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">{s.l}</div>
                  <div className={`text-2xl font-black tracking-tighter ${s.c || 'text-white'}`}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Strategic Execution */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <h3 className="text-xs font-bold text-gold uppercase tracking-[0.5em] mb-6">Security Constraints</h3>
              <h2 className="text-4xl font-black tracking-tighter mb-8 italic">Zero Trust. <br /> Total Automation.</h2>
              <div className="space-y-8">
                {[
                  { t: 'Mandate Enforcement', d: 'Agents cannot deviate from cryptographic launch parameters.' },
                  { t: 'Vault Integrity', d: 'Capital remains isolated per agent, governed by MSS triggers.' },
                  { t: 'Telemetry Audit', d: 'Every decision is logged, signed, and broadcast on-chain.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-xl border border-gold/10 flex flex-shrink-0 items-center justify-center font-black text-xs text-gold/40 group-hover:border-gold transition-all">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2 uppercase tracking-wide">{item.t}</h4>
                      <p className="text-white/40 text-sm leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full flex justify-center">
              <div className="relative w-80 h-80 flex items-center justify-center">
                <div className="absolute inset-0 bg-gold/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute inset-0 border border-gold/10 rounded-full animate-spin-slow" />
                <div className="absolute inset-8 border border-white/5 rounded-full" />
                <Cpu size={120} className="text-gold shadow-gold-glow animate-gold-pulse" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.05] p-12 text-center">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
          EvoLaunch Neural Infrastructure Layer &copy; 2024
        </div>
      </footer>
    </div>
  );
}
