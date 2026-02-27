'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Shield, AlertCircle } from 'lucide-react';
import { useWeb3 } from '../../lib/hooks/useWeb3';

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

    // Simulate fetching reputation data
    const mockReputation: WalletReputation = {
      score: 87,
      category: 'Premium Holder',
      holdingBehavior: 'Long-term accumulator',
      dumpFrequency: 2,
      allocationMultiplier: 1.85,
      launchEligibility: true,
    };

    setReputation(mockReputation);
    setLoading(false);
  }, [wallet]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-forest/10 bg-forest/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-forest/60 hover:text-forest transition flex items-center gap-2 mb-4">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-forest mb-2">Reputation Dashboard</h1>
          <p className="text-forest/60">
            Your wallet-level reputation influences allocation multipliers and launch participation.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!wallet ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 mb-2">Wallet Not Connected</h3>
              <p className="text-amber-800 text-sm">
                Connect your wallet to view your reputation score and allocation status.
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-12 text-forest/60">Loading reputation data...</div>
        ) : reputation ? (
          <div className="space-y-8">
            {/* Main Score Card */}
            <div className="bg-gradient-to-br from-forest/10 to-sage/10 border-2 border-forest/20 rounded-lg p-12 text-center">
              <div className="mb-6">
                <div className="text-7xl font-bold text-forest mb-2">{reputation.score}</div>
                <p className="text-xl text-forest/70">Reputation Score</p>
              </div>

              <div className="flex justify-center gap-4 mb-6 flex-wrap">
                <div className="px-6 py-3 bg-white rounded-full border-2 border-forest/20 font-semibold text-forest">
                  {reputation.category}
                </div>
                {reputation.launchEligibility && (
                  <div className="px-6 py-3 bg-green-50 rounded-full border-2 border-green-200 font-semibold text-green-700 flex items-center gap-2">
                    <Shield size={18} />
                    Launch Eligible
                  </div>
                )}
              </div>

              <p className="text-forest/70">
                Your reputation multiplier gives you {(reputation.allocationMultiplier * 100 - 100).toFixed(0)}% more tokens on new launches
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-forest/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-forest mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-growth" />
                  Holding Behavior
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-forest/60 text-sm mb-1">Category</p>
                    <p className="font-bold text-forest">{reputation.holdingBehavior}</p>
                  </div>
                  <div>
                    <p className="text-forest/60 text-sm mb-1">Dump Frequency</p>
                    <p className="font-bold text-forest">{reputation.dumpFrequency} times in 90 days</p>
                  </div>
                  <div className="pt-4 border-t border-forest/10">
                    <p className="text-xs text-forest/50 mb-2">Score Factors</p>
                    <ul className="space-y-1 text-sm text-forest/70">
                      <li>• Minimal selling during volatility</li>
                      <li>• Long average holding period</li>
                      <li>• Community participation verified</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-forest/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-forest mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-expansion" />
                  Allocation Multiplier
                </h3>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-forest mb-2">{reputation.allocationMultiplier}x</div>
                  <p className="text-forest/60 text-sm">Applied to all new token allocations</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-forest/5 rounded">
                    <span className="text-forest/70">Base Allocation</span>
                    <span className="font-bold text-forest">1.0x</span>
                  </div>
                  <div className="flex justify-between p-2 bg-green-50 rounded border border-green-200">
                    <span className="text-green-700">Your Bonus</span>
                    <span className="font-bold text-green-700">+{((reputation.allocationMultiplier - 1) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reputation History */}
            <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
              <h3 className="text-lg font-bold text-forest mb-6">Score Breakdown</h3>

              <div className="space-y-4">
                {[
                  { label: 'Holding Duration', value: 28, max: 40, desc: 'Months held average' },
                  { label: 'No-Dump Ratio', value: 42, max: 50, desc: 'Launches not sold in 30 days' },
                  { label: 'Community Score', value: 17, max: 10, desc: 'Gov votes & attestations' },
                ].map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="font-semibold text-forest">{metric.label}</p>
                        <p className="text-xs text-forest/60">{metric.desc}</p>
                      </div>
                      <p className="font-bold text-forest">
                        {metric.value}/{metric.max}
                      </p>
                    </div>
                    <div className="w-full bg-forest/10 rounded-full h-2">
                      <div
                        className="bg-forest/60 h-2 rounded-full"
                        style={{ width: `${(metric.value / metric.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Info */}
            <div className="bg-forest/5 border-2 border-forest/20 rounded-lg p-8">
              <h3 className="text-lg font-bold text-forest mb-4">Your Category: Premium Holder</h3>
              <p className="text-forest/70 mb-4">
                Premium Holders demonstrate strong commitment to tokens and earn the highest allocation multiplier.
                Your reputation helps launch creators identify reliable long-term supporters.
              </p>

              <div className="bg-white border border-forest/10 rounded-lg p-4 text-sm">
                <p className="font-bold text-forest mb-2">Benefits:</p>
                <ul className="space-y-1 text-forest/70">
                  <li>✓ 1.85x allocation multiplier on new launches</li>
                  <li>✓ Early access to private launches (tier 4+)</li>
                  <li>✓ Governance voting power boost</li>
                  <li>✓ Featured in community leaderboard</li>
                  <li>✓ Invitations to token founder calls</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
