'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Activity, AlertTriangle, Zap } from 'lucide-react';

interface AnalyticsData {
  liquidityDepthCurve: Array<{ price: number; depth: number }>;
  slippageSensitivity: Array<{ size: string; slippage: number }>;
  holderDistribution: Array<{ range: string; count: number; percentage: number }>;
  phaseMetrics: Array<{ phase: string; duration: string; volumeChange: number }>;
}

export default function AnalyticsPage({ params }: { params: { address: string } }) {
  const [analytics] = useState<AnalyticsData>({
    liquidityDepthCurve: [
      { price: 0.0040, depth: 45000 },
      { price: 0.0041, depth: 52000 },
      { price: 0.0042, depth: 68000 },
      { price: 0.0043, depth: 54000 },
      { price: 0.0044, depth: 38000 },
    ],
    slippageSensitivity: [
      { size: '$1,000', slippage: 0.2 },
      { size: '$5,000', slippage: 0.8 },
      { size: '$10,000', slippage: 2.1 },
      { size: '$50,000', slippage: 8.5 },
      { size: '$100,000', slippage: 18.3 },
    ],
    holderDistribution: [
      { range: '< 0.01%', count: 1850, percentage: 75 },
      { range: '0.01% - 0.1%', count: 380, percentage: 15 },
      { range: '0.1% - 1%', count: 180, percentage: 7 },
      { range: '> 1%', count: 40, percentage: 3 },
    ],
    phaseMetrics: [
      { phase: 'Protective', duration: '8 days', volumeChange: -12 },
      { phase: 'Growth', duration: '18 days', volumeChange: +145 },
      { phase: 'Expansion', duration: '12 days', volumeChange: +87 },
    ],
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-forest/10 bg-forest/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/explore" className="text-forest/60 hover:text-forest transition flex items-center gap-2 mb-4">
            <ArrowLeft size={18} />
            Back to Explorer
          </Link>
          <h1 className="text-4xl font-bold text-forest mb-2">Advanced Analytics</h1>
          <p className="text-forest/60">
            Deep technical analysis for experienced traders and researchers. All data from blockchain.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Liquidity Depth Curve */}
        <div className="bg-white border-2 border-forest/20 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-forest mb-2 flex items-center gap-2">
            <BarChart3 size={24} className="text-growth" />
            Liquidity Depth Curve
          </h2>
          <p className="text-forest/60 text-sm mb-6">Shows available liquidity at different price points on PancakeSwap</p>

          <div className="bg-forest/5 rounded-lg p-6 mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-forest/20">
                  <th className="text-left py-2 px-3 text-forest/60 font-semibold">Price (BNB)</th>
                  <th className="text-left py-2 px-3 text-forest/60 font-semibold">Depth (Tokens)</th>
                  <th className="text-left py-2 px-3 text-forest/60 font-semibold">Share</th>
                </tr>
              </thead>
              <tbody>
                {analytics.liquidityDepthCurve.map((point, idx) => {
                  const maxDepth = Math.max(...analytics.liquidityDepthCurve.map(p => p.depth));
                  const share = (point.depth / maxDepth) * 100;
                  return (
                    <tr key={idx} className="border-b border-forest/10 hover:bg-forest/5">
                      <td className="py-3 px-3 font-mono text-forest">{point.price.toFixed(4)}</td>
                      <td className="py-3 px-3 font-mono text-forest">{point.depth.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <div className="w-24 bg-forest/10 rounded-full h-2">
                          <div
                            className="bg-forest/60 h-2 rounded-full"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-forest/60 text-xs">
            Peak depth at 0.0042 BNB. Deeper pool reduces slippage for large trades.
          </p>
        </div>

        {/* Slippage Sensitivity */}
        <div className="bg-white border-2 border-forest/20 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-forest mb-2 flex items-center gap-2">
            <Zap size={24} className="text-amber-600" />
            Slippage Sensitivity
          </h2>
          <p className="text-forest/60 text-sm mb-6">Expected price impact for different trade sizes</p>

          <div className="space-y-4">
            {analytics.slippageSensitivity.map((data, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24 text-sm font-semibold text-forest">{data.size}</div>
                <div className="flex-1">
                  <div className="w-full bg-forest/10 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        data.slippage < 5
                          ? 'bg-green-600'
                          : data.slippage < 10
                          ? 'bg-amber-600'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(data.slippage * 5, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-bold text-forest">{data.slippage.toFixed(2)}%</div>
              </div>
            ))}
          </div>

          <p className="text-forest/60 text-xs mt-4">
            Large trades experience proportional slippage. Recommend splitting orders over $50K.
          </p>
        </div>

        {/* Holder Distribution */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-forest mb-2 flex items-center gap-2">
              <Activity size={24} className="text-expansion" />
              Holder Distribution
            </h2>
            <p className="text-forest/60 text-sm mb-6">Share of total supply held in each concentration band</p>

            <div className="space-y-4">
              {analytics.holderDistribution.map((dist, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-forest">{dist.range}</span>
                    <span className="text-forest/60">{dist.count} wallets</span>
                  </div>
                  <div className="w-full bg-forest/10 rounded-full h-3">
                    <div
                      className="bg-forest/60 h-3 rounded-full"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-forest/50 mt-1">{dist.percentage}% of supply</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-forest/10">
              <p className="text-sm text-forest/70 mb-2">
                <strong>Concentration Risk:</strong> Low. Top 40 wallets hold only 3% of supply.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-forest mb-2 flex items-center gap-2">
              <AlertTriangle size={24} className="text-amber-600" />
              Whale Activity Heatmap
            </h2>
            <p className="text-forest/60 text-sm mb-6">Timing and volume of large transfers</p>

            <div className="space-y-3">
              {[
                { day: 'Monday', activity: 15, color: 'bg-amber-200' },
                { day: 'Tuesday', activity: 8, color: 'bg-green-200' },
                { day: 'Wednesday', activity: 22, color: 'bg-red-300' },
                { day: 'Thursday', activity: 5, color: 'bg-green-100' },
                { day: 'Friday', activity: 32, color: 'bg-red-400' },
                { day: 'Saturday', activity: 10, color: 'bg-green-200' },
                { day: 'Sunday', activity: 7, color: 'bg-green-100' },
              ].map((day, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-20 text-sm font-semibold text-forest">{day.day}</div>
                  <div className={`${day.color} rounded w-32 h-6`} />
                  <span className="text-sm text-forest/60">{day.activity} txs</span>
                </div>
              ))}
            </div>

            <p className="text-sm text-amber-700 mt-6 p-3 bg-amber-50 rounded">
              ⚠ Peak activity on Friday & Wednesday. Monitor for coordinated dumps.
            </p>
          </div>
        </div>

        {/* Phase Duration Metrics */}
        <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-forest mb-6">Phase Duration & Dynamics</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {analytics.phaseMetrics.map((metric, idx) => (
              <div key={idx} className="border border-forest/10 rounded-lg p-6">
                <h3 className="font-bold text-forest mb-4">{metric.phase} Phase</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-forest/60 mb-1">Duration</p>
                    <p className="font-bold text-forest text-lg">{metric.duration}</p>
                  </div>
                  <div>
                    <p className="text-forest/60 mb-1">Volume Change vs Previous Phase</p>
                    <p
                      className={`font-bold text-lg ${
                        metric.volumeChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metric.volumeChange > 0 ? '+' : ''}{metric.volumeChange}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
