'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle, Lock, Vote, History } from 'lucide-react';

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  type: 'freeze' | 'agent-rotation' | 'threshold';
  status: 'active' | 'passed' | 'failed';
  votesFor: number;
  votesAgainst: number;
  deadline: string;
  executed: boolean;
}

export default function GovernancePage({ params }: { params: { address: string } }) {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 1,
      title: 'Freeze Adaptive Logic',
      description: 'Emergency proposal to freeze all parameter updates.',
      proposer: '0x123...abc',
      type: 'freeze',
      status: 'active',
      votesFor: 850,
      votesAgainst: 120,
      deadline: '2 days',
      executed: false,
    },
    {
      id: 2,
      title: 'Rotate Agent Keys',
      description: 'Replace liquidity agent with updated version.',
      proposer: '0x456...def',
      type: 'agent-rotation',
      status: 'passed',
      votesFor: 920,
      votesAgainst: 50,
      deadline: '1 hour',
      executed: true,
    },
  ]);

  const getProposalColor = (type: Proposal['type']) => {
    const colors: Record<Proposal['type'], string> = {
      freeze: 'bg-red-50 text-red-700 border-red-200',
      'agent-rotation': 'bg-blue-50 text-blue-700 border-blue-200',
      threshold: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return colors[type];
  };

  const getStatusColor = (status: Proposal['status']) => {
    const colors: Record<Proposal['status'], string> = {
      active: 'bg-amber-50 text-amber-700 border-amber-200',
      passed: 'bg-green-50 text-green-700 border-green-200',
      failed: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="pb-12 border-b border-gold/[0.05]">
        <Link href="/explore" className="text-muted/60 hover:text-gold transition-all flex items-center gap-3 mb-8 text-xs font-bold uppercase tracking-widest group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Market Explorer
        </Link>
        <h1 className="text-5xl font-bold text-primary tracking-tight mb-4 flex items-baseline gap-4">
          Protocol <span className="text-gold">Governance</span> Mandate
        </h1>
        <p className="text-muted text-lg max-w-2xl leading-relaxed">
          The ultimate control vector. Override adaptive intelligence, rotate neural keys, and define protocol constants through decentralized consensus.
        </p>
      </div>

      <div className="py-12 space-y-16">
        {/* Emergency Mandates */}
        <div>
          <h2 className="text-3xl font-bold text-primary mb-8 flex items-center gap-5 tracking-tight">
            <AlertCircle className="text-status-danger shadow-status-danger" size={32} />
            High-Security Overrides
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="luxury-card p-10 bg-status-danger/5 border-status-danger/20 hover:border-status-danger/40 transition-all group">
              <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-4 tracking-tight">
                <Lock size={24} className="text-status-danger" />
                Adaptive Logic Freeze
              </h3>
              <p className="text-muted text-base mb-8 leading-relaxed font-medium">
                Immediately suspend all automated parameter adjustments. Requires a supermajority consensus for reactivation.
              </p>
              <button className="w-full py-4 bg-status-danger text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-status-danger hover:scale-[1.02] transition-transform">
                Propose Logic Suspension
              </button>
            </div>

            <div className="luxury-card p-10 bg-status-warning/5 border-status-warning/20 hover:border-status-warning/40 transition-all group">
              <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-4 tracking-tight">
                <Vote size={24} className="text-status-warning" />
                Protocol Pause
              </h3>
              <p className="text-muted text-base mb-8 leading-relaxed font-medium">
                Global circuit breaker for all token movements. To be utilized only during confirmed cryptographic anomalies.
              </p>
              <button className="w-full py-4 bg-status-warning text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-status-warning hover:scale-[1.02] transition-transform">
                Initiate Epoch Pause
              </button>
            </div>
          </div>
        </div>

        {/* Active Proposals */}
        <div>
          <h2 className="text-3xl font-bold text-primary mb-8 flex items-center gap-5 tracking-tight">
            <Vote size={32} className="text-gold" />
            Consensus Queue
          </h2>

          {proposals.filter(p => p.status === 'active').length === 0 ? (
            <div className="luxury-card p-16 text-center bg-secondary/20">
              <p className="text-muted text-lg font-medium">Zero pending mandates in the current epoch.</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {proposals.filter(p => p.status === 'active').map((proposal) => (
                <div key={proposal.id} className="luxury-card p-12 bg-secondary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    <div className={`px-6 py-2 rounded-full text-xs font-bold tracking-[0.2em] border uppercase ${getProposalColor(proposal.type)}`}>
                      {proposal.type}
                    </div>
                  </div>

                  <div className="mb-10 max-w-2xl">
                    <h3 className="text-3xl font-bold text-primary mb-4 tracking-tight">{proposal.title}</h3>
                    <p className="text-muted text-lg font-medium leading-relaxed">{proposal.description}</p>
                  </div>

                  <div className="bg-black/40 rounded-3xl p-10 border border-white/[0.03] mb-10 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gold/[0.01]" />
                    <div className="relative z-10 mb-8">
                      <div className="flex justify-between items-end mb-6 font-mono">
                        <div className="space-y-1">
                          <p className="text-xs text-status-success uppercase font-bold tracking-widest">Affirmative Vector</p>
                          <p className="text-3xl font-bold text-primary tracking-tighter">{proposal.votesFor.toLocaleString()}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-xs text-status-danger uppercase font-bold tracking-widest">Negative Vector</p>
                          <p className="text-3xl font-bold text-primary tracking-tighter">{proposal.votesAgainst.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="w-full bg-secondary/50 rounded-full h-3 flex overflow-hidden p-0.5 border border-white/5">
                        <div
                          className="bg-status-success h-full rounded-full shadow-status-success transition-all duration-1000"
                          style={{
                            width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%`,
                          }}
                        />
                        <div className="bg-status-danger h-full flex-1 rounded-full shadow-status-danger ml-0.5" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-[0.1em] relative z-10">
                      <span className="text-muted">Temporal Deadline: <span className="text-primary">{proposal.deadline}</span></span>
                      <span className="text-gold">Network Approval: <span className="text-primary">{((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100).toFixed(1)}%</span></span>
                    </div>
                  </div>

                  <div className="flex gap-6 relative z-10">
                    <button className="flex-1 py-5 bg-status-success/[0.05] text-status-success border border-status-success/20 rounded-2xl hover:bg-status-success/10 transition-all font-bold uppercase tracking-widest text-xs">
                      Sign Affirmative
                    </button>
                    <button className="flex-1 py-5 bg-status-danger/[0.05] text-status-danger border border-status-danger/20 rounded-2xl hover:bg-status-danger/10 transition-all font-bold uppercase tracking-widest text-xs">
                      Sign Negative
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historical Mandates */}
        <div>
          <h2 className="text-3xl font-bold text-primary mb-8 flex items-center gap-5 tracking-tight">
            <History size={32} className="text-gold" />
            Consensus Logs
          </h2>

          <div className="grid gap-4">
            {proposals.filter(p => p.status !== 'active').map((proposal) => (
              <div key={proposal.id} className="luxury-card p-8 bg-secondary/10 hover:border-gold/30 transition-all duration-500 group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors tracking-tight">{proposal.title}</h3>
                    <p className="text-muted text-sm font-medium">{proposal.description}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.1em] border uppercase ${getStatusColor(proposal.status)}`}>
                      {proposal.status}
                    </div>
                    {proposal.executed && (
                      <div className="flex items-center gap-3 text-status-success text-xs font-bold uppercase tracking-widest">
                        <CheckCircle size={16} className="shadow-status-success" />
                        Finalized
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Protocol Constants */}
        <div className="luxury-card p-12 bg-secondary/20 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/[0.02] -ml-48 -mb-48 rounded-full blur-3xl" />
          <h2 className="text-3xl font-bold text-primary mb-12 tracking-tight">Protocol Constraints</h2>

          <div className="grid md:grid-cols-2 gap-12 relative z-10">
            <div>
              <h3 className="text-gold font-bold uppercase tracking-[0.2em] text-xs mb-8 opacity-60">Voting Directives</h3>
              <div className="space-y-4">
                {[
                  { label: 'Temporal Period', value: '7 Epochs' },
                  { label: 'Quorum Threshold', value: '40% Network' },
                  { label: 'Approval Mandate', value: '50% Consensus' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between p-5 bg-black/40 rounded-2xl border border-white/[0.03]">
                    <span className="text-sm font-medium text-muted">{item.label}</span>
                    <span className="text-sm font-bold text-primary font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-gold font-bold uppercase tracking-[0.2em] text-xs mb-8 opacity-60">System Guardrails</h3>
              <div className="space-y-4">
                {[
                  { label: 'Max Tax Delta', value: '±5.00%' },
                  { label: 'Reset Cooldown', value: '48 Hours' },
                  { label: 'Freeze Lockout', value: '24 Hours' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between p-5 bg-black/40 rounded-2xl border border-white/[0.03]">
                    <span className="text-sm font-medium text-muted">{item.label}</span>
                    <span className="text-sm font-bold text-primary font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
