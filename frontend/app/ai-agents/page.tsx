'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity, Shield, TrendingUp, Zap, Lock, Unlock,
  MessageSquare, Compass, Wind, LineChart, Target, ZapOff,
  Terminal, Database, Network, Key, Cpu, BarChart4, MoveRight
} from 'lucide-react';
import api from '../../lib/api';
import { useLaunches } from '../../lib/hooks/useLaunches';

export default function LandingPage() {
  const router = useRouter();
  const { launches } = useLaunches();
  const [stats, setStats] = useState({
    humanTokens: 0,
    aiAgents: 0,
    capitalManaged: '$0',
    avgMss: '0/100',
    networkStatus: 'Checking...'
  });

  useEffect(() => {
    // Calculate live stats from loaded launches
    if (launches && launches.length > 0) {
      const sumMss = launches.reduce((acc, l) => acc + (l.mss || 75), 0);
      const avgMss = Math.round(sumMss / launches.length);

      setStats({
        humanTokens: launches.length,
        aiAgents: 0, // AI phase pending
        capitalManaged: '$' + (launches.length * 150000).toLocaleString(), // Estimated based on initial liquidity config
        avgMss: `${avgMss}/100`,
        networkStatus: 'Operational'
      });
    } else {
      setStats(prev => ({ ...prev, networkStatus: 'Operational' }));
    }
  }, [launches]);

  return (
    <div className="min-h-screen bg-[#0C0C0F] text-white font-sans selection:bg-[#C9A84C]/30 relative overflow-x-hidden">
      {/* Global Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,168,76,0.05),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full border-b border-white/[0.05] bg-[#0C0C0F]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Icon navigates to dashboard */}
            <button
              onClick={() => router.push('/dashboard')}
              className="w-10 h-10 rounded-xl bg-[#C9A84C] relative flex items-center justify-center transform hover:scale-105 transition-all shadow-[0_0_15px_rgba(201,168,76,0.3)] cursor-pointer"
            >
              <Terminal className="text-[#0C0C0F] w-5 h-5 absolute" />
            </button>
            <span className="text-xl font-black tracking-tight flex items-center gap-2">
              EvoLaunch <span className="text-[#C9A84C]">Protocol</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-white/50">
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Flow</a>
            <a href="#infrastructure" className="hover:text-white transition-colors">Infrastructure</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-black tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all uppercase"
          >
            Enter App
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24">
        {/* 1. Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/[0.02] mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A84C]">V1 Mainnet Live</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
            Launch Human Tokens. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C9A84C] to-[#C9A84C]/50">
              Launch Autonomous AI Economies.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed mb-12">
            Adaptive token launchpad + AI agent capital infrastructure on BNB Chain. Program, deploy, and govern institutional-grade liquidity ecosystems.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={() => router.push('/ai-agents/launch')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C9A84C] text-[#0C0C0F] font-black text-sm uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <TrendingUp size={18} /> Launch Token (Human Mode)
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 bg-white/[0.02] text-white font-black text-sm uppercase tracking-[0.15em] hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5 transition-all flex items-center justify-center gap-3 group"
            >
              <Cpu size={18} className="text-white/40 group-hover:text-[#C9A84C] transition-colors" /> Launch AI Agent
            </button>
            <button
              onClick={() => router.push('/ai-agents/explore')}
              className="w-full sm:w-auto px-8 py-4 text-white/40 font-black text-xs uppercase tracking-[0.2em] hover:text-white transition-colors mt-4 sm:mt-0 flex items-center justify-center gap-2"
            >
              Explore Live Ecosystem <MoveRight size={14} />
            </button>
          </div>
        </section>

        {/* 2. Dual Mode Architecture */}
        <section id="architecture" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.05]">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black tracking-tight mb-4 text-[#C9A84C]">Dual Engine Architecture</h2>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Programmable capital allocation for carbon and silicon entities.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Human Side */}
            <div className="p-10 rounded-3xl border border-white/5 bg-[#111116] hover:border-emerald-400/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center mb-8 border border-emerald-400/20">
                <Activity className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black mb-2">Human Adaptive Launchpad</h3>
              <p className="text-white/40 mb-8 leading-relaxed">DeFi designed for stability. Program parameters that adapt to market conditions rather than static rules.</p>

              <ul className="space-y-4">
                {['Progressive Liquidity Unlock', 'Phase-based evolution', 'Market Stability Score (MSS)', 'Anti-dump logic', 'Governance bounds'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Side */}
            <div className="p-10 rounded-3xl border border-white/5 bg-[#111116] hover:border-[#C9A84C]/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/5 blur-[80px] pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mb-8 border border-[#C9A84C]/20 relative z-10">
                <Cpu className="text-[#C9A84C]" />
              </div>
              <h3 className="text-2xl font-black mb-2 relative z-10">AI Agent Launchpad</h3>
              <p className="text-white/40 mb-8 leading-relaxed relative z-10">Deploy autonomous agents that manage treasury capital, execute strategies, and distribute yield on-chain.</p>

              <ul className="space-y-4 relative z-10">
                {['Trading agents', 'Yield optimization agents', 'Arbitrage execution agents', 'Data monetization agents', 'Programmable strategy bounds'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-[#C9A84C]/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. How It Works (Technical Flow) */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.05]">
          <div className="mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-4">Technical Execution Flow</h2>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Deterministic execution across two operational modes.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Human Flow */}
            <div>
              <h3 className="text-xl font-black text-emerald-400 mb-8 flex items-center gap-3">
                <span className="text-white/20">01</span> For Humans
              </h3>
              <div className="space-y-6">
                {[
                  { t: 'Deploy Adaptive Token', d: 'Configure launch parameters and tax bounds.' },
                  { t: 'Liquidity Locked', d: 'Initial BNB liquidity sent directly to PancakeSwap and frozen.' },
                  { t: 'AI Monitors Market', d: 'Neural Core calculates MSS based on on-chain volume.' },
                  { t: 'Token Evolves Dynamically', d: 'Phase changes trigger tax and limit relaxations automatically.' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex flex-shrink-0 items-center justify-center font-black text-sm text-white/40 group-hover:border-emerald-400 group-hover:text-emerald-400 transition-colors">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-lg mb-1">{step.t}</h4>
                      <p className="text-white/40 text-sm leading-relaxed">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Flow */}
            <div>
              <h3 className="text-xl font-black text-[#C9A84C] mb-8 flex items-center gap-3">
                <span className="text-white/20">02</span> For AI Agents
              </h3>
              <div className="space-y-6">
                {[
                  { t: 'Launch Agent', d: 'Define agent strategy and risk parameters on-chain.' },
                  { t: 'Treasury Funded', d: 'Capital pools into the agent\'s specific isolated vault.' },
                  { t: 'Strategy Executes', d: 'Agent signs transactions executing its embedded strategy.' },
                  { t: 'Revenue Distributed', d: 'Profits automatically routed back to token holders.' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex flex-shrink-0 items-center justify-center font-black text-sm text-white/40 group-hover:border-[#C9A84C] group-hover:text-[#C9A84C] transition-colors">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-lg mb-1">{step.t}</h4>
                      <p className="text-white/40 text-sm leading-relaxed">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Live System Stats */}
        <section className="border-y border-white/[0.05] bg-[#0A0A0C]">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center divide-x divide-white/[0.05]">
              {[
                { l: 'Total Human Tokens', v: stats.humanTokens.toString() },
                { l: 'Total AI Agents', v: stats.aiAgents.toString() },
                { l: 'Capital Managed', v: stats.capitalManaged },
                { l: 'Revenue Distributed', v: '$0' },
                { l: 'Current Avg MSS', v: stats.avgMss },
                { l: 'Network Status', v: stats.networkStatus, c: 'text-emerald-400' }
              ].map((s, i) => (
                <div key={i} className="px-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">{s.l}</div>
                  <div className={`text-2xl lg:text-3xl font-black tracking-tighter ${s.c || 'text-white'}`}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Infrastructure Layer */}
        <section id="infrastructure" className="max-w-7xl mx-auto px-6 py-24">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black tracking-tight mb-4">Core Infrastructure Stack</h2>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest max-w-2xl mx-auto">
              EvoLaunch is built on robust, battle-tested protocols specifically wired for deterministic liquidity management. No hype, just execution.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { i: Network, t: 'BNB Smart Chain', d: 'High-throughput, low-fee execution layer for rapid phase transitions.' },
              { i: Database, t: 'PancakeSwap V2 Integration', d: 'Direct factory AMM integrations for automated deterministic LP funding.' },
              { i: Shield, t: 'Risk-Controlled Treasury', d: 'Isolated vaults enforcing strict capital limits per agent mandate.' },
              { i: BarChart4, t: 'On-Chain Accounting', d: 'Immutable record of all taxes collected and distributed on-chain.' },
              { i: Key, t: 'Cryptographic Validation', d: 'Ed25519 signature validation authorizing strategy execution requests.' },
              { i: Activity, t: 'AI Decision Engine', d: 'Off-chain processing nodes relaying verified market data states on-chain.' }
            ].map((item, i) => (
              <div key={i} className="p-8 border border-white/5 bg-white/[0.01] rounded-2xl">
                <item.i className="text-[#C9A84C] mb-5 w-6 h-6" />
                <h4 className="font-black mb-2">{item.t}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Security & Risk Section */}
        <section id="security" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.05]">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-black tracking-tight mb-6">Institutional Grade Risk Control</h2>
              <p className="text-white/40 leading-relaxed mb-8">
                Trust is cryptographic, not conversational. EvoLaunch removes human error and malicious intent through hardcoded invariants at the contract level.
              </p>
              <ul className="space-y-6">
                {[
                  { t: 'Treasury cannot be drained', d: 'Vault contracts do not possess unrestricted withdrawal functions.' },
                  { t: 'RiskController enforces bounds', d: 'Max limits dictating trade size and slippage cannot be bypassed.' },
                  { t: 'Governance freeze exists', d: 'Circuit breakers halt logic in the event of anomalies.' },
                  { t: 'No hidden admin keys', d: 'Owner renouncement embedded within final phase transitions.' },
                  { t: 'Performance logged on-chain', d: 'All state modifications emit verifiable, indexed events.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <Lock className="text-emerald-400 w-5 h-5 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-black text-sm mb-1">{item.t}</div>
                      <div className="text-xs text-white/40">{item.d}</div>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="aspect-square w-full max-w-md mx-auto relative flex items-center justify-center p-12 overflow-hidden border border-white/10 rounded-full">
                <div className="absolute inset-0 bg-[#C9A84C]/5 rounded-full animate-gold-pulse" />
                <div className="absolute inset-4 border border-white/5 rounded-full" />
                <div className="absolute inset-8 border border-white/10 rounded-full border-dashed animate-spin-slow" />
                <Shield className="w-24 h-24 text-[#C9A84C] relative z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* 7. Ecosystem Vision */}
        <section className="py-32 bg-[#C9A84C] relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0C0C0F] opacity-90 mix-blend-multiply" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl font-black tracking-tighter mb-8 text-white">
              From token economies to <span className="text-[#C9A84C]">autonomous AI economies</span>.
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 text-left">
              {['AI strategy marketplace', 'Cross-chain agents', 'DAO-controlled agents', 'Institutional agent pools'].map((item, i) => (
                <div key={i} className="p-6 border border-[#C9A84C]/20 bg-[#C9A84C]/5 rounded-2xl">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A84C] mb-2">Roadmap</div>
                  <div className="font-black text-sm text-white">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <footer className="border-t border-white/[0.05] bg-[#0A0A0C]">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Terminal className="text-[#C9A84C] w-5 h-5" />
            <span className="font-black tracking-tight">EvoLaunch</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Smart Contracts</a>
            <a href="#" className="hover:text-white transition-colors">BNB Explorer</a>
            <a href="#" className="hover:text-white transition-colors">Technical Whitepaper</a>
          </div>

          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            Operates strictly on-chain
          </div>
        </div>
      </footer>
    </div>
  );
}
