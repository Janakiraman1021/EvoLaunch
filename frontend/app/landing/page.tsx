'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingUp, Gauge, Lock, Anchor } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-gold/10 blur-[120px] rounded-full animate-gold-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[100px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-gold/[0.05] sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-gold-glow">
              <Anchor size={20} className="text-black" />
            </div>
            EVO<span className="text-gold italic font-serif">LAUNCH</span>
          </div>
          <div className="flex gap-10 items-center">
            <Link href="/docs" className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] hover:text-gold transition-all">
              Protocol Reference
            </Link>
            <Link href="/system" className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] hover:text-gold transition-all">
              System Health
            </Link>
            <Link href="/launch" className="px-8 py-3 bg-gold text-black rounded-full font-bold uppercase tracking-widest text-[10px] shadow-gold-glow hover:scale-[1.05] transition-transform">
              Deploy Mandate
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-32">
        {/* Hero Section */}
        <div className="text-center mb-40 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-10 leading-[0.9] tracking-tighter">
            Adaptive <span className="text-gold italic font-serif">Tokenomics</span> <br />
            Orchestrated by Intelligence.
          </h1>
          <p className="text-2xl text-muted max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
            Evolutionary cryptographic deployment. Real-time neural agents synchronizing market-responsive tax vectors and liquidity depth.
          </p>
          <div className="flex gap-8 justify-center flex-wrap">
            <Link
              href="/launch"
              className="px-12 py-5 bg-gold text-black rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-gold-glow hover:scale-[1.05] transition-transform flex items-center gap-3"
            >
              Initialize Deployment <ArrowRight size={18} />
            </Link>
            <Link
              href="/explore"
              className="px-12 py-5 border border-gold/20 text-gold rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold/5 hover:border-gold/40 transition-all flex items-center gap-3"
            >
              Access Explorer <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Core Methodology */}
        <div className="grid lg:grid-cols-2 gap-20 mb-40">
          <div className="space-y-12">
            <h2 className="text-5xl font-bold text-white tracking-tight">Ecosystem methodology</h2>
            <div className="space-y-8 text-muted text-lg leading-relaxed font-medium">
              <p>
                EvoLaunch is a high-fidelity smart contract protocol facilitating token deployments with integrated adaptive governance.
              </p>
              <p>
                Unlike static architectures, EvoLaunch protocols dynamically synchronize critical vectors:
              </p>
              <div className="grid gap-6">
                {[
                  { title: 'Taxation Matrix', desc: 'Real-time Buy/Sell tax optimization based on volatility' },
                  { title: 'Transaction Guardrails', desc: 'Institutional TX limits preventing large-scale displacement' },
                  { title: 'Temporal Phases', desc: 'Protective → Growth → Expansion → Governance evolution' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full mt-3 shadow-gold-glow group-hover:scale-150 transition-transform" />
                    <div>
                      <h4 className="text-white font-bold text-xl mb-1">{item.title}</h4>
                      <p className="text-muted/60 text-base">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="pt-6 border-t border-white/5 italic font-serif text-gold/60">
                All algorithmic adjustments are verified through cryptographically-secured neural signals.
              </p>
            </div>
          </div>

          <div className="grid gap-8">
            <div className="luxury-card p-12 bg-secondary/10 hover:border-gold/30 transition-all duration-700 group">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-5 tracking-tight group-hover:text-gold transition-colors">
                <Gauge size={32} className="text-gold" />
                01. Neural Monitoring
              </h3>
              <p className="text-muted text-base leading-relaxed font-medium">
                Agents compute the Stability Score (MSS) by decrypting liquidity depth, holder concentration, and buy/sell ratios.
              </p>
            </div>

            <div className="luxury-card p-12 bg-secondary/10 hover:border-gold/30 transition-all duration-700 group">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-5 tracking-tight group-hover:text-gold transition-colors">
                <Zap size={32} className="text-gold" />
                02. Dynamic Recalibration
              </h3>
              <p className="text-muted text-base leading-relaxed font-medium">
                Based on active MSS, the controller recalibrates tax rates, transaction limits, and fee distribution vectors.
              </p>
            </div>

            <div className="luxury-card p-12 bg-secondary/10 hover:border-gold/30 transition-all duration-700 group">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-5 tracking-tight group-hover:text-gold transition-colors">
                <Shield size={32} className="text-gold" />
                03. Cryptographic Execution
              </h3>
              <p className="text-muted text-base leading-relaxed font-medium">
                Every recalibration pulse must include a verified ECDSA signature, ensuring institutional-grade security.
              </p>
            </div>
          </div>
        </div>

        {/* Phase Evolution Matrix */}
        <div className="mb-40">
          <h2 className="text-5xl font-bold text-white mb-16 text-center tracking-tight">Phase Evolution Matrix</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                name: 'Protective',
                num: 0,
                desc: 'Maximum taxation, restricted transaction capacity. Deployment stabilization.',
                mss: '0-25',
              },
              {
                name: 'Growth',
                num: 1,
                desc: 'Balanced taxation, expanded transaction limits. Targeted volume expansion.',
                mss: '25-50',
              },
              {
                name: 'Expansion',
                num: 2,
                desc: 'Optimized low-taxation. High-velocity ecosystem scaling.',
                mss: '50-75',
              },
              {
                name: 'Governance',
                num: 3,
                desc: 'Consensus-controlled architecture. Minimal protocol restrictions.',
                mss: '75-100',
              },
            ].map((phase) => (
              <div key={phase.num} className="luxury-card p-10 bg-secondary/10 hover:border-gold/40 transition-all duration-700 group">
                <div className="inline-block px-5 py-2 bg-gold/10 text-gold font-bold rounded-full text-[9px] uppercase tracking-[0.2em] mb-8 border border-gold/20 shadow-gold-glow group-hover:bg-gold group-hover:text-black transition-all">
                  Mandate Phase {phase.num}
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 tracking-tighter group-hover:text-gold transition-colors">{phase.name}</h3>
                <p className="text-muted font-medium text-base mb-8 leading-relaxed">{phase.desc}</p>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-40">MSS Range</span>
                  <span className="text-xl font-bold text-white/50 font-mono tracking-tighter">{phase.mss}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Architecture */}
        <div className="mb-40">
          <h2 className="text-5xl font-bold text-white mb-16 text-center tracking-tight">Neural Intelligence Architecture</h2>
          <div className="luxury-card p-16 bg-secondary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gold/[0.01]" />
            <p className="text-muted text-xl mb-16 leading-relaxed text-center max-w-4xl mx-auto font-medium">
              Autonomous agents analyzing real-time on-chain data streams and submitting cryptographically-secured recalibration pulses to the primary controller.
            </p>
            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {[
                {
                  name: 'Liquidity Intelligence',
                  role: 'Decrypting LP depth and rebalancing protocols.',
                  icon: Anchor
                },
                {
                  name: 'Market Intelligence',
                  role: 'Analyzing price displacement and volume vectors.',
                  icon: TrendingUp
                },
                {
                  name: 'Reputation Intelligence',
                  role: 'Mapping holder dynamics and stability scoring.',
                  icon: Shield
                },
              ].map((agent) => (
                <div key={agent.name} className="p-10 bg-black/40 border border-white/[0.03] rounded-3xl hover:border-gold/30 transition-all group">
                  <agent.icon size={32} className="text-gold mb-8 opacity-40 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{agent.name}</h3>
                  <p className="text-muted text-base leading-relaxed font-medium">{agent.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional CTA */}
        <div className="text-center py-20 border-t border-white/5 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/10 blur-[150px] rounded-full -translate-y-1/2 pointer-events-none" />
          <h2 className="text-6xl font-bold text-white mb-10 tracking-tight">Initialize Your Mandate.</h2>
          <p className="text-2xl text-muted/60 mb-16 max-w-2xl mx-auto font-medium">
            Deploy your adaptive neural token today. Advanced protocol recalibration, institutional security, and algorithmic transparency.
          </p>
          <Link
            href="/launch"
            className="px-16 py-6 bg-gold text-black rounded-full font-bold uppercase tracking-[0.3em] text-xs shadow-gold-glow hover:scale-[1.1] transition-transform inline-flex items-center gap-4"
          >
            Deploy Alpha Mandate <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
