'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingUp, Gauge, Lock, Anchor, Activity } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-gold/10 blur-[120px] rounded-full animate-gold-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[100px] rounded-full" />
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 pt-40 pb-32 relative">
        <div className="text-center mb-40 animate-in fade-in slide-in-from-bottom-12 duration-1000 relative z-10">
          <div className="inline-block px-5 py-2 bg-gold/10 border border-gold/20 rounded-full text-xs font-bold text-gold uppercase tracking-[0.3em] mb-12 shadow-gold-glow">
            Institutional Grade Protocol
          </div>
          <h1 className="text-7xl md:text-9xl font-bold text-primary mb-10 leading-[0.85] tracking-tighter">
            Adaptive <span className="text-gold">Tokenomics</span> <br />
            <span className="opacity-90">Orchestrated by AI.</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-16 leading-relaxed">
            Revolutionary cryptographic deployment. Neural agents synchronizing market-responsive tax vectors and institutional liquidity depth.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link
              href="/ai-agents/launch"
              className="btn-primary flex items-center gap-3 px-12"
            >
              Start Deployment <ArrowRight size={18} />
            </Link>
            <Link
              href="/ai-agents/explore"
              className="px-12 py-3.5 border border-gold/20 text-gold rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold/5 transition-all flex items-center gap-3"
            >
              Access Explorer
            </Link>
          </div>
        </div>

        {/* Core Methodology Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-40 relative z-10">
          {[
            {
              title: 'Neural Monitoring',
              icon: Gauge,
              desc: 'Agents compute the Stability Score (MSS) by decrypting liquidity depth and concentration.'
            },
            {
              title: 'Recalibration',
              icon: Zap,
              desc: 'Based on active MSS, the controller recalibrates tax rates and transaction limits.'
            },
            {
              title: 'Verified Security',
              icon: Shield,
              desc: 'Every pulse must include a verified ECDSA signature, ensuring institutional-grade safety.'
            }
          ].map((item, i) => (
            <div key={i} className="luxury-card p-10 group hover:translate-y-[-8px] transition-all duration-500">
              <div className="shine-sweep" />
              <div className="icon-box-lg mb-8 group-hover:bg-gold/10 transition-colors">
                <item.icon size={28} className="text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4 tracking-tight group-hover:text-gold transition-colors">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Intelligence Architecture Section */}
        <div className="mb-40">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-primary mb-6 tracking-tight">Intelligence Architecture</h2>
            <div className="w-24 h-1 bg-gold/30 mx-auto rounded-full" />
          </div>

          <div className="luxury-card p-1 bg-secondary/20 relative overflow-hidden">
            <div className="grid md:grid-cols-2 gap-1 px-1">
              <div className="p-12 space-y-8 flex flex-col justify-center">
                <h3 className="text-4xl font-bold text-primary tracking-tight">Autonomous <br />Signal Integrity</h3>
                <p className="text-muted text-lg leading-relaxed">
                  EvoLaunch agents process petabytes of on-chain signals every millisecond, transforming raw data into verified protocol mandates.
                </p>
                <div className="flex items-center gap-4 text-gold text-xs font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-status-success shadow-gold-glow" />
                  Live Node Synchronization Active
                </div>
              </div>
              <div className="bg-secondary/40 p-12 rounded-[1.8rem] m-2 border border-white/5 space-y-8">
                {[
                  { label: 'MSS Precision', value: '0.0001', icon: TrendingUp },
                  { label: 'Network Latency', value: '2ms', icon: Activity },
                  { label: 'Asset Protection', value: 'Tier 1', icon: Lock },
                ].map((node, i) => (
                  <div key={i} className="flex justify-between items-center group cursor-default">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gold/5 flex items-center justify-center border border-gold/10 group-hover:border-gold/30 transition-all">
                        <node.icon size={14} className="text-gold" />
                      </div>
                      <span className="text-xs text-muted font-bold uppercase tracking-widest">{node.label}</span>
                    </div>
                    <span className="text-sm font-mono text-primary font-bold">{node.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Institutional CTA */}
        <div className="text-center py-20 relative">
          <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
          <h2 className="text-5xl md:text-6xl font-bold text-primary mb-10 tracking-tight">Initialize Your Mandate.</h2>
          <p className="text-xl text-muted/60 mb-16 max-w-xl mx-auto">
            Deploy your adaptive neural token today. Advanced protocol recalibration and algorithmic transparency.
          </p>
          <Link
            href="/ai-agents/launch"
            className="btn-primary px-16 py-5 inline-flex items-center gap-4"
          >
            Deploy Alpha Mandate <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
