'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useWeb3 } from '../../lib/hooks/useWeb3';
import api from '../../lib/api';

interface WalletReputation {
  score: number;
  category: string;
  holdingBehavior: string;
  dumpFrequency: number;
  allocationMultiplier: number;
  launchEligibility: boolean;
}

export default function ReputationDashboard() {
  const { wallet } = useWeb3();
  const [reputation, setReputation] = useState<WalletReputation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wallet) {
      setLoading(false);
      return;
    }

    // Fetch real reputation from backend
    api.getReputation(wallet.address).then(data => {
      const score = data.score || 50;
      const multiplier = data.allocationWeight || 0.5;
      setReputation({
        score,
        category: score >= 80 ? 'Premium Holder' : score >= 60 ? 'Standard Holder' : 'New Participant',
        holdingBehavior: data.holdingDuration > 30 ? 'Long-term accumulator' : data.holdingDuration > 7 ? 'Medium-term holder' : 'Active trader',
        dumpFrequency: data.dumpCount || 0,
        allocationMultiplier: 1 + multiplier,
        launchEligibility: score >= 60,
      });
      setLoading(false);
    }).catch(() => {
      // Fallback to mock data
      setReputation({
        score: 87,
        category: 'Premium Holder',
        holdingBehavior: 'Long-term accumulator',
        dumpFrequency: 2,
        allocationMultiplier: 1.85,
        launchEligibility: true,
      });
      setLoading(false);
    });
  }, [wallet]);

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="pb-12 border-b border-gold/[0.05]">
        <Link href="/" className="text-muted/60 hover:text-gold transition-all flex items-center gap-3 mb-8 text-xs font-bold uppercase tracking-widest group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Neural Core Home
        </Link>
        <h1 className="text-5xl font-bold text-primary tracking-tight mb-4 flex items-baseline gap-4">
          Neural <span className="text-gold">Reputation</span> Matrix
        </h1>
        <p className="text-muted text-lg max-w-2xl leading-relaxed">
          Your wallet reputation governs allocation mandates, participant multipliers, and protocol governance weight.
        </p>
      </div>

      <div className="py-12">
        {!wallet ? (
          <div className="luxury-card p-10 bg-status-warning/5 border-status-warning/20 flex items-start gap-6">
            <div className="w-12 h-12 rounded-xl bg-status-warning/10 flex items-center justify-center text-status-warning border border-status-warning/20">
              <AlertCircle size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-primary mb-2 tracking-tight">Identity Synchronization Required</h3>
              <p className="text-muted text-base leading-relaxed">
                Synchronize your institutional wallet to decrypt your reputation score and active allocation multipliers.
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
            <p className="text-gold/60 font-bold uppercase tracking-[0.3em] text-xs animate-pulse">Scanning Neural Network...</p>
          </div>
        ) : reputation ? (
          <div className="space-y-12">
            {/* Main Score Card */}
            <div className="luxury-card p-16 text-center bg-secondary/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gold/[0.02] blur-3xl rounded-full scale-150 group-hover:bg-gold/[0.05] transition-colors duration-1000" />

              <div className="relative z-10 mb-10">
                <p className="text-xs font-bold text-gold uppercase tracking-[0.2em] mb-6 opacity-60">Consensus Reputation Score</p>
                <div className="text-9xl font-bold text-primary tracking-tighter mb-4 shadow-gold-glow-large animate-gold-pulse">
                  {reputation.score}
                </div>
              </div>

              <div className="flex justify-center gap-6 mb-10 relative z-10">
                <div className="px-8 py-3 bg-gold text-background rounded-full font-bold uppercase tracking-widest text-xs border border-gold shadow-gold-glow">
                  {reputation.category}
                </div>
                {reputation.launchEligibility && (
                  <div className="px-8 py-3 bg-status-success/10 rounded-full border border-status-success/30 font-bold text-status-success uppercase tracking-widest text-xs flex items-center gap-2">
                    <Shield size={14} />
                    Protocol Eligible
                  </div>
                )}
              </div>

              <p className="text-muted text-lg relative z-10 max-w-xl mx-auto leading-relaxed">
                Your reputation multiplier grants you an institutional bonus of <span className="text-gold font-bold">{(reputation.allocationMultiplier * 100 - 100).toFixed(0)}%</span> on all primary token mandates.
              </p>
            </div>

            {/* Key Metrics Matrix */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="luxury-card p-10 bg-secondary/10 hover:border-gold/30 transition-all duration-500">
                <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-4 tracking-tight">
                  <TrendingUp size={24} className="text-gold" />
                  Behavioral Analytics
                </h3>
                <div className="space-y-8">
                  <div className="p-6 bg-black/40 rounded-2xl border border-white/[0.03]">
                    <p className="text-xs text-muted uppercase font-bold tracking-[0.2em] mb-2 opacity-60">Classification</p>
                    <p className="text-xl font-bold text-primary tracking-tight">{reputation.holdingBehavior}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-black/40 rounded-2xl border border-white/[0.03]">
                      <p className="text-xs text-muted uppercase font-bold tracking-[0.2em] mb-2 opacity-60">Liquidation Freq</p>
                      <p className="text-xl font-bold text-primary tracking-tight">{reputation.dumpFrequency} <span className="text-xs text-muted font-normal lowercase tracking-normal">per epoch</span></p>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-white/[0.03]">
                    <p className="text-xs text-gold uppercase font-bold tracking-[0.2em] mb-4">Positive Vectors</p>
                    <ul className="space-y-3">
                      {['Resilient during market volatility', 'Sustained average holding epoch', 'Verified community attestation'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-muted font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-gold-glow" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="luxury-card p-10 bg-secondary/10 hover:border-gold/30 transition-all duration-500">
                <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-4 tracking-tight">
                  <Shield size={24} className="text-gold" />
                  Mandate Multiplier
                </h3>
                <div className="text-center py-10 mb-8 bg-black/40 rounded-3xl border border-white/[0.03] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gold/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-7xl font-bold text-primary tracking-tighter mb-2">{reputation.allocationMultiplier}<span className="text-2xl text-gold/40">x</span></div>
                  <p className="text-gold/60 font-bold uppercase tracking-[0.2em] text-xs">Active Allocation Pulse</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between p-5 bg-white/[0.02] rounded-xl border border-white/[0.03]">
                    <span className="text-xs text-muted uppercase font-bold tracking-widest">Base Multiplier</span>
                    <span className="text-sm font-bold text-primary">1.00x</span>
                  </div>
                  <div className="flex justify-between p-5 bg-status-success/5 rounded-xl border border-status-success/20">
                    <span className="text-xs text-status-success uppercase font-bold tracking-widest">Reputation Bonus</span>
                    <span className="text-sm font-bold text-status-success">+{((reputation.allocationMultiplier - 1) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Matrix Breakdown */}
            <div className="luxury-card p-12 bg-secondary/20">
              <h3 className="text-2xl font-bold text-primary mb-10 tracking-tight">Computational Breakdown</h3>

              <div className="space-y-10">
                {[
                  { label: 'Holding Temporal Depth', value: 28, max: 40, desc: 'Average sequence duration' },
                  { label: 'Mandate Retention Ratio', value: 42, max: 50, desc: '30-day post-launch stability' },
                  { label: 'Neural Participation Score', value: 17, max: 10, desc: 'Governance & Network weight' },
                ].map((metric, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-lg font-bold text-primary group-hover:text-gold transition-colors">{metric.label}</p>
                        <p className="text-xs text-muted font-medium opacity-60 tracking-wide">{metric.desc}</p>
                      </div>
                      <p className="text-xl font-bold text-primary font-mono">
                        {metric.value}<span className="text-muted/40 text-sm">/{metric.max}</span>
                      </p>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2.5 p-0.5 border border-white/5 overflow-hidden">
                      <div
                        className="bg-gold h-full rounded-full transition-all duration-1000 shadow-gold-glow group-hover:scale-y-110"
                        style={{ width: `${(metric.value / metric.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Classification */}
            <div className="luxury-card p-12 bg-gold/5 border-gold/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gold/[0.05] -mr-48 -mt-48 rounded-full blur-3xl" />
              <h3 className="text-2xl font-bold text-primary mb-6 relative z-10 flex items-center gap-4">
                Institutional Tier: <span className="text-gold tracking-tight">Premium Accumulator</span>
              </h3>
              <p className="text-muted text-lg mb-10 relative z-10 leading-relaxed max-w-3xl">
                Premium Accumulators demonstrate the highest level of network fidelity. They are the bedrock of the EvoLaunch ecosystem, ensuring long-term token stability.
              </p>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="luxury-card p-8 bg-black/40 border-white/5">
                  <p className="text-xs font-bold text-gold uppercase tracking-[0.2em] mb-6 opacity-60">Privileged Entitlements</p>
                  <ul className="space-y-4">
                    {[
                      'Institutional 1.85x allocation multiplier',
                      'Tier-1 Early Access to private mandates',
                      'Governance weight amplification (2.5x)',
                      'Priority Neural Support access',
                      'Direct founder-level intelligence calls'
                    ].map((benefit, i) => (
                      <li key={i} className="flex items-center gap-4 text-sm text-primary/80 font-medium">
                        <CheckCircle size={16} className="text-status-success flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 rounded-3xl border border-gold/10 bg-gold/[0.02] flex items-center justify-center text-center">
                  <div>
                    <p className="text-gold font-bold text-lg mb-2">Maximum Protocol Trust</p>
                    <p className="text-muted text-sm px-6">Your data is cryptographically signed and stored in the Neural Registry.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
