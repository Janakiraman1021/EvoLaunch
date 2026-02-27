'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, LineChart, Lock, Zap, Activity, TrendingUp } from 'lucide-react';
import MSSChart from '../../../components/MSSChart';

interface ProjectData {
  symbol: string;
  name: string;
  currentPhase: string;
  mssValue: number;
  phaseDescription: string;
  lastAgentUpdateTime: string;

  tokenInfo: {
    address: string;
    totalSupply: string;
    holders: number;
  };

  liquidityInfo: {
    totalLocked: string;
    totalReleased: string;
    unlockSchedule: Array<{
      tranche: number;
      amount: string;
      threshold: number;
      phase: string;
      status: 'pending' | 'unlocked';
    }>;
    frozen: boolean;
  };

  adaptiveParams: {
    currentSellTax: number;
    currentBuyTax: number;
    maxTx: string;
    incentiveMultiplier: number;
    bounds: {
      minTax: number;
      maxTax: number;
      minMaxTx: string;
      minMaxWallet: string;
    };
  };

  agentLogs: Array<{
    agent: string;
    timestamp: string;
    action: string;
    signature: string;
    verified: boolean;
    block: number;
  }>;

  transactions: Array<{
    type: 'buy' | 'sell';
    amount: string;
    price: string;
    address: string;
    timestamp: string;
    volumeSpike: boolean;
  }>;
}

export default function ProjectDashboard({ params }: { params: { address: string } }) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    // Simulate fetching project data from blockchain
    const mockData: ProjectData = {
      symbol: 'EVOA',
      name: 'EvoToken Alpha',
      currentPhase: 'Growth',
      mssValue: 65,
      phaseDescription: 'Token is in organic growth phase. Moderate taxes applied.',
      lastAgentUpdateTime: '2 minutes ago',

      tokenInfo: {
        address: '0x' + params.address,
        totalSupply: '1,000,000',
        holders: 2450,
      },

      liquidityInfo: {
        totalLocked: '125,340 BNB',
        totalReleased: '23,450 BNB',
        frozen: false,
        unlockSchedule: [
          {
            tranche: 1,
            amount: '25,000 BNB',
            threshold: 25,
            phase: 'Growth',
            status: 'unlocked',
          },
          {
            tranche: 2,
            amount: '30,000 BNB',
            threshold: 50,
            phase: 'Expansion',
            status: 'pending',
          },
          {
            tranche: 3,
            amount: '35,000 BNB',
            threshold: 75,
            phase: 'Governance',
            status: 'pending',
          },
        ],
      },

      adaptiveParams: {
        currentSellTax: 4.5,
        currentBuyTax: 2.1,
        maxTx: '50,000',
        incentiveMultiplier: 1.2,
        bounds: {
          minTax: 0,
          maxTax: 25,
          minMaxTx: '10,000',
          minMaxWallet: '20,000',
        },
      },

      agentLogs: [
        {
          agent: 'Liquidity Agent',
          timestamp: '2 minutes ago',
          action: 'Monitored LP depth, computed MSS delta',
          signature: '0x1234...',
          verified: true,
          block: 12345678,
        },
        {
          agent: 'Market Agent',
          timestamp: '5 minutes ago',
          action: 'Volume spike detected. Recommended tax increase.',
          signature: '0x5678...',
          verified: true,
          block: 12345677,
        },
      ],

      transactions: [
        {
          type: 'buy',
          amount: '5,000 EVOA',
          price: '0.0042 BNB',
          address: '0x123...abc',
          timestamp: 'just now',
          volumeSpike: false,
        },
        {
          type: 'sell',
          amount: '2,500 EVOA',
          price: '0.0041 BNB',
          address: '0x456...def',
          timestamp: '30s ago',
          volumeSpike: false,
        },
        {
          type: 'buy',
          amount: '25,000 EVOA',
          price: '0.0042 BNB',
          address: '0x789...ghi',
          timestamp: '1m ago',
          volumeSpike: true,
        },
      ],
    };

    setProject(mockData);
    setLoading(false);
  }, [params.address]);

  if (loading) {
    return <div className="text-center py-12 text-forest/60">Loading project data...</div>;
  }

  if (!project) {
    return <div className="text-center py-12 text-forest/60">Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-forest/10 bg-forest/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/explore" className="text-forest/60 hover:text-forest transition flex items-center gap-2 mb-4">
            <ArrowLeft size={18} />
            Back to Explorer
          </Link>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-4xl font-bold text-forest">{project.name}</h1>
              <p className="text-forest/60 font-mono text-sm mt-2">{project.symbol}</p>
            </div>
            <div className="flex flex-col justify-end gap-4">
              <div>
                <p className="text-xs text-forest/60 uppercase font-bold mb-1">Current Phase</p>
                <div className="inline-block px-4 py-2 bg-forest text-white rounded-full font-semibold">
                  {project.currentPhase}
                </div>
              </div>
              <div>
                <p className="text-xs text-forest/60 uppercase font-bold mb-1">MSS Score</p>
                <p className="text-3xl font-bold text-forest">{project.mssValue}/100</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-forest/10 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'graph', label: 'MSS Graph', icon: LineChart },
            { id: 'liquidity', label: 'Liquidity', icon: Lock },
            { id: 'params', label: 'Parameters', icon: Zap },
            { id: 'agents', label: 'Agent Logs', icon: TrendingUp },
            { id: 'txs', label: 'Transactions', icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                ? 'border-forest text-forest'
                : 'border-transparent text-forest/60 hover:text-forest'
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-forest/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-forest mb-4">Token Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-forest/60">Address</span>
                    <span className="font-mono text-sm text-forest">{project.tokenInfo.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest/60">Total Supply</span>
                    <span className="font-bold text-forest">{project.tokenInfo.totalSupply}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest/60">Holders</span>
                    <span className="font-bold text-forest">{project.tokenInfo.holders}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-forest/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-forest mb-4">Phase Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-forest/60">Phase</span>
                    <span className="font-bold text-forest">{project.currentPhase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest/60">MSS Value</span>
                    <span className="font-bold text-forest text-lg">{project.mssValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest/60">Last Update</span>
                    <span className="text-sm text-forest">{project.lastAgentUpdateTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-forest/5 border-2 border-forest/20 rounded-lg p-6">
              <p className="text-forest/70">{project.phaseDescription}</p>
            </div>
          </div>
        )}

        {/* MSS Graph Tab */}
        {activeTab === 'graph' && (
          <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
            <MSSChart mss={project.mssValue} />
          </div>
        )}

        {/* Liquidity Tab */}
        {activeTab === 'liquidity' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-forest/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-forest mb-4">Liquidity Status</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-forest/60 mb-1">Total Locked</p>
                    <p className="text-2xl font-bold text-forest">{project.liquidityInfo.totalLocked}</p>
                  </div>
                  <div>
                    <p className="text-sm text-forest/60 mb-1">Total Released</p>
                    <p className="text-2xl font-bold text-forest">{project.liquidityInfo.totalReleased}</p>
                  </div>
                  <div>
                    <p className="text-sm text-forest/60 mb-1">Status</p>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${project.liquidityInfo.frozen
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                      {project.liquidityInfo.frozen ? 'Frozen' : 'Active'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-forest/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-forest mb-4">Unlock Schedule</h3>
                <div className="space-y-3">
                  {project.liquidityInfo.unlockSchedule.map((tranche) => (
                    <div key={tranche.tranche} className="flex justify-between items-center text-sm pb-3 border-b border-forest/10 last:border-b-0">
                      <div>
                        <p className="font-semibold text-forest">Tranche {tranche.tranche}</p>
                        <p className="text-xs text-forest/60">{tranche.amount}</p>
                      </div>
                      <div className={`text-xs font-bold px-2 py-1 rounded ${tranche.status === 'unlocked'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                        }`}>
                        {tranche.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Parameters Tab */}
        {activeTab === 'params' && (
          <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
            <h3 className="text-xl font-bold text-forest mb-6">Current Parameters</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-forest mb-4">Dynamic Taxes</h4>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-forest/5 rounded-lg">
                    <span className="text-forest/70">Sell Tax</span>
                    <span className="font-bold text-forest">{project.adaptiveParams.currentSellTax}%</span>
                  </div>
                  <div className="flex justify-between p-3 bg-forest/5 rounded-lg">
                    <span className="text-forest/70">Buy Tax</span>
                    <span className="font-bold text-forest">{project.adaptiveParams.currentBuyTax}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-forest mb-4">Bounds (Immutable)</h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-forest/5 rounded-lg">
                    <p className="text-forest/60 mb-1">Tax Range</p>
                    <p className="font-mono text-forest">{project.adaptiveParams.bounds.minTax}% - {project.adaptiveParams.bounds.maxTax}%</p>
                  </div>
                  <div className="p-3 bg-forest/5 rounded-lg">
                    <p className="text-forest/60 mb-1">Max Tx Range</p>
                    <p className="font-mono text-forest">{project.adaptiveParams.bounds.minMaxTx} - {project.adaptiveParams.bounds.minMaxWallet}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agent Logs Tab */}
        {activeTab === 'agents' && (
          <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
            <h3 className="text-xl font-bold text-forest mb-6">Agent Activity Log</h3>
            <div className="space-y-4">
              {project.agentLogs.map((log, idx) => (
                <div key={idx} className="border border-forest/10 rounded-lg p-4 hover:border-forest/30 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-forest">{log.agent}</h4>
                      <p className="text-sm text-forest/60">{log.timestamp}</p>
                    </div>
                    <div className={`text-xs font-bold px-3 py-1 rounded ${log.verified
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                      {log.verified ? 'Verified' : 'Unverified'}
                    </div>
                  </div>
                  <p className="text-forest/70 text-sm mb-2">{log.action}</p>
                  <p className="text-xs text-forest/50 font-mono">Block: {log.block} | Sig: {log.signature}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'txs' && (
          <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
            <h3 className="text-xl font-bold text-forest mb-6">Recent Transactions</h3>
            <div className="space-y-3">
              {project.transactions.map((tx, idx) => (
                <div key={idx} className={`border rounded-lg p-4 flex justify-between items-center ${tx.volumeSpike ? 'border-amber-200 bg-amber-50' : 'border-forest/10'
                  }`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold ${tx.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'buy' ? '↑' : '↓'} {tx.type.toUpperCase()}
                      </span>
                      {tx.volumeSpike && <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded font-bold">SPIKE</span>}
                    </div>
                    <p className="text-sm text-forest/70">{tx.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-forest">{tx.amount}</p>
                    <p className="text-sm text-forest/60">{tx.price}</p>
                    <p className="text-xs text-forest/50">{tx.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
