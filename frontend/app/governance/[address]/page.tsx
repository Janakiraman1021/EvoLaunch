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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-forest/10 bg-forest/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/explore" className="text-forest/60 hover:text-forest transition flex items-center gap-2 mb-4">
            <ArrowLeft size={18} />
            Back to Explorer
          </Link>
          <h1 className="text-4xl font-bold text-forest mb-2">Governance Control</h1>
          <p className="text-forest/60">
            Manage protocol parameters, freeze adaptive logic, and rotate agent keys via on-chain governance.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Emergency Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-forest mb-6 flex items-center gap-2">
            <AlertCircle className="text-red-600" size={24} />
            Emergency Actions
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button className="bg-white border-2 border-red-200 rounded-lg p-6 hover:border-red-400 transition text-left">
              <h3 className="font-bold text-forest mb-2 flex items-center gap-2">
                <Lock size={20} className="text-red-600" />
                Freeze Adaptive Logic
              </h3>
              <p className="text-forest/70 text-sm mb-4">
                Immediately disable all parameter updates. Requires on-chain voting override.
              </p>
              <button className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition font-semibold text-sm">
                Propose Freeze
              </button>
            </button>

            <button className="bg-white border-2 border-amber-200 rounded-lg p-6 hover:border-amber-400 transition text-left">
              <h3 className="font-bold text-forest mb-2 flex items-center gap-2">
                <Vote size={20} className="text-amber-600" />
                Pause Trading
              </h3>
              <p className="text-forest/70 text-sm mb-4">
                Trigger global trading pause if extreme volatility detected.
              </p>
              <button className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition font-semibold text-sm">
                Initiate Vote
              </button>
            </button>
          </div>
        </div>

        {/* Active Proposals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-forest mb-6 flex items-center gap-2">
            <Vote size={24} />
            Active Proposals
          </h2>

          {proposals.filter(p => p.status === 'active').length === 0 ? (
            <div className="bg-forest/5 border-2 border-forest/20 rounded-lg p-6 text-center">
              <p className="text-forest/60">No active proposals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.filter(p => p.status === 'active').map((proposal) => (
                <div key={proposal.id} className="bg-white border-2 border-forest/20 rounded-lg p-6">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-forest">{proposal.title}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getProposalColor(proposal.type)}`}>
                        {proposal.type.toUpperCase()}
                      </div>
                    </div>
                    <p className="text-forest/70 text-sm">{proposal.description}</p>
                  </div>

                  <div className="bg-forest/5 rounded-lg p-4 mb-4">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-forest">For: {proposal.votesFor.toLocaleString()}</span>
                        <span className="font-semibold text-forest">Against: {proposal.votesAgainst.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-forest/20 rounded-full h-3 flex overflow-hidden">
                        <div
                          className="bg-green-600 h-full"
                          style={{
                            width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%`,
                          }}
                        />
                        <div className="bg-red-600 h-full flex-1" />
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-forest/60">
                      <span>Deadline: {proposal.deadline}</span>
                      <span>Approval: {((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition font-semibold">
                      Vote For
                    </button>
                    <button className="flex-1 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition font-semibold">
                      Vote Against
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Proposals & Execution Logs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-forest mb-6 flex items-center gap-2">
            <History size={24} />
            Proposal History
          </h2>

          <div className="space-y-3">
            {proposals.filter(p => p.status !== 'active').map((proposal) => (
              <div key={proposal.id} className="bg-white border border-forest/10 rounded-lg p-4 hover:border-forest/30 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-forest mb-1">{proposal.title}</h3>
                    <p className="text-sm text-forest/60">{proposal.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border mb-2 ${getStatusColor(proposal.status)}`}>
                      {proposal.status.toUpperCase()}
                    </div>
                    {proposal.executed && (
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <CheckCircle size={14} />
                        Executed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance Parameters */}
        <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-forest mb-6">Protocol Parameters</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-forest mb-4">Voting Rules</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 bg-forest/5 rounded-lg">
                  <span className="text-forest/70">Voting Period</span>
                  <span className="font-bold text-forest">7 days</span>
                </div>
                <div className="flex justify-between p-3 bg-forest/5 rounded-lg">
                  <span className="text-forest/70">Quorum Required</span>
                  <span className="font-bold text-forest">40%</span>
                </div>
                <div className="flex justify-between p-3 bg-forest/5 rounded-lg">
                  <span className="text-forest/70">Approval Threshold</span>
                  <span className="font-bold text-forest">50%</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-forest mb-4">Constraints</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 bg-forest/5 rounded-lg">
                  <span className="text-forest/70">Max Tax Adjustment</span>
                  <span className="font-bold text-forest">±5% per vote</span>
                </div>
                <div className="flex justify-between p-3 bg-forest/5 rounded-lg">
                  <span className="text-forest/70">Min Time Between Votes</span>
                  <span className="font-bold text-forest">48 hours</span>
                </div>
                <div className="flex justify-between p-3 bg-forest/5 rounded-lg">
                  <span className="text-forest/70">Emergency Freeze Cooldown</span>
                  <span className="font-bold text-forest">24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
