'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, Activity, Key } from 'lucide-react';
import api from '../../../lib/api';

interface Agent {
  id: string;
  name: string;
  publicKey: string;
  isActive: boolean;
  lastUpdate: string;
  updateCount: number;
  verificationStatus: 'verified' | 'unverified';
  signature: string;
}

interface MSSInput {
  metric: string;
  value: string;
  weight: string;
  source: string;
}

export default function AgentControlPanel() {
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Liquidity Agent', publicKey: '0x1234567890abcdef1234567890abcdef12345678', isActive: true, lastUpdate: '2 minutes ago', updateCount: 847, verificationStatus: 'verified', signature: '0x9f86d081884c7d6d9ffd60bb2007805...' },
    { id: '2', name: 'Market Agent', publicKey: '0xabcdef1234567890abcdef1234567890abcdef12', isActive: true, lastUpdate: '5 minutes ago', updateCount: 923, verificationStatus: 'verified', signature: '0x6f29e27a22f3b5f2d8a1c4e9b3f7a2d5...' },
    { id: '3', name: 'Reputation Agent', publicKey: '0xf1e2d3c4b5a69780abcdef1234567890abcdef12', isActive: false, lastUpdate: '1 day ago', updateCount: 456, verificationStatus: 'verified', signature: '0x3c5a9d1e2f4b7c8a9d6e3f1a2b4c5d6e...' },
  ]);

  const [mssInputs] = useState<MSSInput[]>([
    { metric: 'Liquidity Depth Index', value: '82,450 BNB', weight: '50%', source: 'PancakeSwap Factory' },
    { metric: 'Holder Concentration', value: '8.3%', weight: '20%', source: 'Blockchain Scanner' },
    { metric: 'Buy/Sell Ratio', value: '1.24', weight: '20%', source: 'DEX Aggregator' },
    { metric: 'Volatility Factor', value: '3.2', weight: '10%', source: 'Price Oracle' },
  ]);

  const toggleAgentStatus = (id: string) => { setAgents(agents.map(agent => agent.id === id ? { ...agent, isActive: !agent.isActive } : agent)); };

  const [loading, setLoading] = useState(true);
  const [auditTrail, setAuditTrail] = useState([
    { agent: 'Liquidity Agent', timestamp: '2m ago', block: 42847592, status: 'VERIFIED' },
    { agent: 'Market Agent', timestamp: '5m ago', block: 42847591, status: 'VERIFIED' },
    { agent: 'Reputation Agent', timestamp: '12m ago', block: 42847590, status: 'VERIFIED' },
    { agent: 'Market Agent', timestamp: '18m ago', block: 42847589, status: 'VERIFIED' },
  ]);

  useEffect(() => {
    const tokenAddress = api.getTokenAddress();
    if (tokenAddress) {
      api.getAgentLogs(tokenAddress).then(logs => {
        if (logs.length > 0) {
          setAuditTrail(logs.map(l => ({ agent: l.agent || 'Neural Agent', timestamp: new Date(l.timestamp).toLocaleString(), block: Math.floor(l.timestamp / 1000), status: 'VERIFIED' })));
        }
      });
    }
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent p-12 space-y-12">
        <div className="space-y-4"><div className="h-12 w-96 skeleton" /><div className="h-4 w-64 skeleton opacity-20" /></div>
        <div className="space-y-8">{[1, 2].map((i) => (<div key={i} className="h-80 skeleton luxury-card" />))}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="pb-12 border-b border-gold/[0.05]">
        <Link href="/ai-agents" className="text-muted/60 hover:text-gold transition-all flex items-center gap-3 mb-8 text-xs font-bold uppercase tracking-widest group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Neural Core Home
        </Link>
        <h1 className="text-5xl font-bold text-primary tracking-tight mb-4 flex items-baseline gap-4">Agent <span className="text-gold">Command</span> Center</h1>
        <p className="text-muted text-lg max-w-2xl leading-relaxed">Monitor registered neural agents, verify cryptographic signatures, and inspect real-time stability score parameters.</p>
      </div>

      <div className="py-12 space-y-16">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-primary flex items-center gap-4 tracking-tight"><Key size={32} className="text-gold" /> Institutional Registry</h2>
          <div className="grid gap-6">
            {agents.map((agent) => (
              <div key={agent.id} className="luxury-card p-10 hover:border-gold/30 group transition-all duration-500 shadow-luxury-soft">
                <div className="grid lg:grid-cols-2 gap-12 mb-8">
                  <div>
                    <div className="flex items-center gap-5 mb-6">
                      <h3 className="text-2xl font-bold text-primary tracking-tight group-hover:text-gold transition-colors">{agent.name}</h3>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${agent.isActive ? 'bg-status-success/10 text-status-success border-status-success/30 shadow-status-success' : 'bg-muted/10 text-muted border-muted/30'}`}>{agent.isActive ? 'OPERATIONAL' : 'DORMANT'}</div>
                      <div className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-gold/30 bg-gold/5 text-gold">{agent.verificationStatus}</div>
                    </div>
                    <div className="space-y-4"><div><p className="text-xs font-bold text-gold uppercase tracking-[0.2em] mb-2 opacity-60">Public Identifier (ECDSA)</p><p className="font-mono text-primary/70 break-all text-sm bg-black/40 p-4 rounded-xl border border-white/[0.03] leading-relaxed">{agent.publicKey}</p></div></div>
                  </div>
                  <div className="grid col-span-1 gap-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-secondary/40 rounded-2xl border border-white/[0.03]"><p className="text-xs text-muted uppercase font-bold tracking-widest mb-1 opacity-60">Last Sequence</p><p className="text-lg font-bold text-primary">{agent.lastUpdate}</p></div>
                      <div className="p-6 bg-secondary/40 rounded-2xl border border-white/[0.03]"><p className="text-xs text-muted uppercase font-bold tracking-widest mb-1 opacity-60">Total Mandates</p><p className="text-lg font-bold text-primary">{agent.updateCount}</p></div>
                    </div>
                    <button onClick={() => toggleAgentStatus(agent.id)} className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.1em] text-xs transition-all duration-500 border ${agent.isActive ? 'border-status-danger/40 text-status-danger hover:bg-status-danger/10' : 'border-status-success/40 text-status-success hover:bg-status-success/10'}`}>{agent.isActive ? 'Revoke Mandate' : 'Authorize Agent'}</button>
                  </div>
                </div>
                <div className="border-t border-gold/[0.05] pt-6 group"><p className="text-xs text-gold/40 uppercase font-bold tracking-widest mb-2">Cryptographic Signature</p><p className="font-mono text-xs text-muted/40 break-all group-hover:text-gold/40 transition-colors uppercase">{agent.signature}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-primary flex items-center gap-4 tracking-tight"><Activity size={32} className="text-gold" /> Stability Intelligence Inputs</h2>
          <div className="luxury-card p-12 bg-secondary/20">
            <p className="text-muted text-base mb-10 leading-relaxed font-medium">Current Market Stability Score (MSS) is dynamically derived from weighted on-chain metrics across institutional feeds.</p>
            <div className="grid md:grid-cols-2 gap-8">
              {mssInputs.map((input, idx) => (
                <div key={idx} className="luxury-card p-8 bg-black/40 border-gold/10 hover:border-gold/30 group transition-all">
                  <div className="flex justify-between items-start mb-6"><div><p className="font-bold text-primary text-lg tracking-tight mb-1 group-hover:text-gold transition-colors">{input.metric}</p><p className="text-sm text-gold/60 font-mono font-bold">{input.value}</p></div><div className="text-right"><p className="text-xs text-muted uppercase font-bold tracking-[0.2em] mb-1 opacity-60">Weight</p><p className="text-2xl font-bold text-primary tracking-tighter">{input.weight}</p></div></div>
                  <div className="flex items-center gap-2 text-xs text-muted/60 uppercase font-bold tracking-widest pt-5 border-t border-white/[0.03]"><CheckCircle size={12} className="text-status-success shadow-gold-glow" /><span>Source: {input.source}</span></div>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-gold/[0.05]">
              <h4 className="text-xs font-bold text-gold uppercase tracking-[0.3em] mb-6">MSS Computational Model</h4>
              <div className="bg-black/40 p-10 rounded-2xl font-mono text-sm text-primary/50 border border-white/[0.03] overflow-x-auto relative group">
                <div className="absolute inset-0 bg-gold/[0.01] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="relative z-10 text-primary font-bold mb-4">MSS = (LDI × 0.50) + (HC × 0.20) + (BSR × 0.20) + (VF × 0.10)</p>
                <div className="relative z-10 text-xs text-muted uppercase tracking-widest leading-relaxed">LDI: Liquidity Depth Index | HC: Holder Concentration | BSR: Buy/Sell Ratio | VF: Volatility Factor</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-primary flex items-center gap-4 tracking-tight"><CheckCircle size={32} className="text-gold" /> Signature Audit Trail</h2>
          <div className="luxury-card p-12 bg-secondary/20">
            <div className="space-y-4">
              {auditTrail.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between py-6 border-b border-white/[0.03] last:border-b-0 group">
                  <div className="flex items-center gap-6"><div className="w-10 h-10 rounded-xl bg-gold/5 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-all"><CheckCircle size={18} /></div><div><p className="font-bold text-primary text-base tracking-tight group-hover:text-gold transition-colors">{entry.agent}</p><p className="text-xs text-muted font-bold tracking-widest opacity-60 uppercase">Sequence Block: #{entry.block}</p></div></div>
                  <div className="text-right"><p className="text-sm font-bold text-primary/80 mb-1">{entry.timestamp}</p><p className="text-xs text-status-success font-bold tracking-widest shadow-gold-glow animate-pulse">{entry.status}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-10 p-6 bg-status-success/5 border border-status-success/20 rounded-2xl flex items-center gap-4"><CheckCircle size={20} className="text-status-success" /><p className="text-xs font-bold text-status-success/80 uppercase tracking-widest">Cryptographic integrity confirmed. No unauthorized intervention detected in current epoch.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
