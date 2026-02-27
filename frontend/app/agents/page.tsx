'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, Activity, Key } from 'lucide-react';

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
    {
      id: '1',
      name: 'Liquidity Agent',
      publicKey: '0x1234567890abcdef1234567890abcdef12345678',
      isActive: true,
      lastUpdate: '2 minutes ago',
      updateCount: 847,
      verificationStatus: 'verified',
      signature: '0x9f86d081884c7d6d9ffd60bb2007805...',
    },
    {
      id: '2',
      name: 'Market Agent',
      publicKey: '0xabcdef1234567890abcdef1234567890abcdef12',
      isActive: true,
      lastUpdate: '5 minutes ago',
      updateCount: 923,
      verificationStatus: 'verified',
      signature: '0x6f29e27a22f3b5f2d8a1c4e9b3f7a2d5...',
    },
    {
      id: '3',
      name: 'Reputation Agent',
      publicKey: '0xf1e2d3c4b5a69780abcdef1234567890abcdef12',
      isActive: false,
      lastUpdate: '1 day ago',
      updateCount: 456,
      verificationStatus: 'verified',
      signature: '0x3c5a9d1e2f4b7c8a9d6e3f1a2b4c5d6e...',
    },
  ]);

  const [mssInputs] = useState<MSSInput[]>([
    {
      metric: 'Liquidity Depth Index',
      value: '82,450 BNB',
      weight: '50%',
      source: 'PancakeSwap Factory',
    },
    {
      metric: 'Holder Concentration',
      value: '8.3%',
      weight: '20%',
      source: 'Blockchain Scanner',
    },
    {
      metric: 'Buy/Sell Ratio',
      value: '1.24',
      weight: '20%',
      source: 'DEX Aggregator',
    },
    {
      metric: 'Volatility Factor',
      value: '3.2',
      weight: '10%',
      source: 'Price Oracle',
    },
  ]);

  const toggleAgentStatus = (id: string) => {
    setAgents(agents.map(agent =>
      agent.id === id ? { ...agent, isActive: !agent.isActive } : agent
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-forest/10 bg-forest/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-forest/60 hover:text-forest transition flex items-center gap-2 mb-4">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-forest mb-2">Agent Control Panel</h1>
          <p className="text-forest/60">
            Monitor registered agents, verify signatures, and inspect MSS computation inputs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Agent Registry */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-forest mb-6 flex items-center gap-2">
            <Key size={24} className="text-growth" />
            Registered Agents
          </h2>

          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white border-2 border-forest/20 rounded-lg p-6 hover:border-forest/50 transition">
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-forest">{agent.name}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        agent.isActive
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}>
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        agent.verificationStatus === 'verified'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {agent.verificationStatus}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-forest/60 mb-1">Public Key (ECDSA)</p>
                        <p className="font-mono text-forest/70 break-all text-xs bg-forest/5 p-2 rounded">
                          {agent.publicKey}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-forest/5 rounded-lg">
                      <span className="text-forest/70">Last Update</span>
                      <span className="font-bold text-forest">{agent.lastUpdate}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-forest/5 rounded-lg">
                      <span className="text-forest/70">Total Updates</span>
                      <span className="font-bold text-forest">{agent.updateCount}</span>
                    </div>
                    <button
                      onClick={() => toggleAgentStatus(agent.id)}
                      className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                        agent.isActive
                          ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                      }`}
                    >
                      {agent.isActive ? 'Deactivate Agent' : 'Activate Agent'}
                    </button>
                  </div>
                </div>

                <div className="border-t border-forest/10 pt-4">
                  <p className="text-xs text-forest/60 mb-2">Last Signature</p>
                  <p className="font-mono text-xs text-forest/50 break-all">{agent.signature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MSS Computation Inputs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-forest mb-6 flex items-center gap-2">
            <Activity size={24} className="text-expansion" />
            MSS Computation Inputs
          </h2>

          <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
            <p className="text-forest/70 mb-6">
              Current Market Stability Score (MSS) is computed as a weighted average of these on-chain metrics:
            </p>

            <div className="space-y-4">
              {mssInputs.map((input, idx) => (
                <div key={idx} className="border border-forest/10 rounded-lg p-4 hover:border-forest/30 transition">
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="font-bold text-forest mb-1">{input.metric}</p>
                      <p className="text-sm text-forest/70">{input.value}</p>
                    </div>
                    <div>
                      <p className="text-xs text-forest/60 uppercase font-bold mb-1">Weight</p>
                      <p className="text-lg font-bold text-forest">{input.weight}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-forest/60 pt-3 border-t border-forest/10">
                    <CheckCircle size={14} className="text-green-600" />
                    <span>Source: {input.source}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-forest/10">
              <h4 className="font-bold text-forest mb-4">MSS Formula</h4>
              <div className="bg-forest/5 p-6 rounded-lg font-mono text-sm text-forest/70 overflow-x-auto">
                <p>MSS = (LDI × 0.50) + (HC × 0.20) + (BSR × 0.20) + (VF × 0.10)</p>
                <p className="mt-4 text-forest/60 text-xs">
                  Where: LDI = Liquidity Depth Index, HC = Holder Concentration,<br />
                  BSR = Buy/Sell Ratio, VF = Volatility Factor
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification History */}
        <div>
          <h2 className="text-2xl font-bold text-forest mb-6 flex items-center gap-2">
            <CheckCircle size={24} className="text-sage" />
            Signature Verification History
          </h2>

          <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
            <div className="space-y-3">
              {[
                { agent: 'Liquidity Agent', timestamp: '2m ago', block: 42847592, status: 'verified' },
                { agent: 'Market Agent', timestamp: '5m ago', block: 42847591, status: 'verified' },
                { agent: 'Reputation Agent', timestamp: '12m ago', block: 42847590, status: 'verified' },
                { agent: 'Market Agent', timestamp: '18m ago', block: 42847589, status: 'verified' },
              ].map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-forest/10 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-600" />
                    <div>
                      <p className="font-semibold text-forest">{entry.agent}</p>
                      <p className="text-xs text-forest/60">Block {entry.block}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-forest/70">{entry.timestamp}</p>
                    <p className="text-xs text-green-600 font-bold">{entry.status}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-forest/60 text-sm mt-6 p-4 bg-green-50 border border-green-200 rounded">
              ✓ All signatures verified against registered public keys. No unauthorized updates detected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
