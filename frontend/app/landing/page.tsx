'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingUp, Gauge, Lock, Anchor } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-forest/10 sticky top-0 z-50 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-forest">EvoLaunch</div>
          <div className="flex gap-6 items-center">
            <Link href="/docs" className="text-forest/60 hover:text-forest transition">
              Docs
            </Link>
            <Link href="/system" className="text-forest/60 hover:text-forest transition">
              System Status
            </Link>
            <Link href="/launch" className="px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest/90 transition">
              Launch Token
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-bold text-forest mb-6 leading-tight">
            Adaptive Tokenomics <br />
            <span className="text-sage">Orchestrated by Agents</span>
          </h1>
          <p className="text-xl text-forest/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            EvoLaunch is a protocol that deploys token launches with dynamic, market-responsive tax structures.
            Real-time agent signals drive phase transitions and parameter adjustments based on Market Stability Score.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/launch"
              className="px-8 py-4 bg-forest text-white rounded-lg font-semibold hover:bg-forest/90 transition flex items-center gap-2"
            >
              Launch a Token <ArrowRight size={20} />
            </Link>
            <Link
              href="/explore"
              className="px-8 py-4 border-2 border-forest text-forest rounded-lg font-semibold hover:bg-forest/5 transition flex items-center gap-2"
            >
              Explore Live Launches <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* Core Concepts */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* What is EvoLaunch */}
          <div>
            <h2 className="text-3xl font-bold text-forest mb-6">What is EvoLaunch?</h2>
            <div className="space-y-4 text-forest/70 leading-relaxed">
              <p>
                EvoLaunch is a smart contract protocol that deploys token launches with built-in adaptive governance.
              </p>
              <p>
                Unlike traditional token launches with static parameters, EvoLaunch tokens adjust their:
              </p>
              <ul className="space-y-2 ml-4 border-l-2 border-forest/20 pl-4">
                <li>• <strong>Buy & Sell Taxes</strong>: Dynamically updated based on market conditions</li>
                <li>• <strong>Transaction Limits</strong>: Prevent whale accumulation and pump-and-dump schemes</li>
                <li>• <strong>Protocol Phase</strong>: Moves through Protective → Growth → Expansion → Governance</li>
              </ul>
              <p>
                All changes are driven by cryptographically verified agent signals authenticated via ECDSA signatures.
              </p>
            </div>
          </div>

          {/* How Adaptive Tokenomics Works */}
          <div>
            <h2 className="text-3xl font-bold text-forest mb-6">How Adaptive Tokenomics Works</h2>
            <div className="space-y-4 space-y-6">
              <div className="bg-forest/5 p-6 rounded-lg border border-forest/10">
                <h3 className="font-bold text-forest mb-2 flex items-center gap-2">
                  <Gauge size={20} className="text-sage" />
                  1. Market Monitoring
                </h3>
                <p className="text-forest/70 text-sm">
                  Agents compute the Market Stability Score (MSS) by analyzing on-chain metrics: liquidity depth, holder concentration, buy/sell volume ratio, and volatility.
                </p>
              </div>

              <div className="bg-forest/5 p-6 rounded-lg border border-forest/10">
                <h3 className="font-bold text-forest mb-2 flex items-center gap-2">
                  <Zap size={20} className="text-growth" />
                  2. Parameter Adjustment
                </h3>
                <p className="text-forest/70 text-sm">
                  Based on MSS, the EvolutionController updates tax rates, transaction limits, and fee collectors. Changes are bounded by min/max constraints set at launch.
                </p>
              </div>

              <div className="bg-forest/5 p-6 rounded-lg border border-forest/10">
                <h3 className="font-bold text-forest mb-2 flex items-center gap-2">
                  <Shield size={20} className="text-expansion" />
                  3. Verification & Execution
                </h3>
                <p className="text-forest/70 text-sm">
                  Every parameter update must include a valid signature. Only authorized agents can submit updates. All actions are logged on-chain for transparency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Model */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-forest mb-8 text-center">Protocol Phase Model</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                name: 'Protective',
                num: 0,
                desc: 'High taxes, strict tx limits. Prevents dumping during launch.',
                mss: '0-25',
              },
              {
                name: 'Growth',
                num: 1,
                desc: 'Moderate taxes, larger tx limits. Encourages trading volume.',
                mss: '25-50',
              },
              {
                name: 'Expansion',
                num: 2,
                desc: 'Low taxes, high tx limits. Organic ecosystem growth.',
                mss: '50-75',
              },
              {
                name: 'Governance',
                num: 3,
                desc: 'Community-controlled via DAO votes. Minimal restrictions.',
                mss: '75-100',
              },
            ].map((phase) => (
              <div key={phase.num} className="bg-white border-2 border-forest/20 rounded-lg p-6 hover:border-forest/50 transition">
                <div className="inline-block px-3 py-1 bg-forest/10 text-forest font-semibold rounded-full text-sm mb-3">
                  Phase {phase.num}
                </div>
                <h3 className="text-xl font-bold text-forest mb-2">{phase.name}</h3>
                <p className="text-forest/70 text-sm mb-4">{phase.desc}</p>
                <p className="text-xs text-forest/50 font-mono">MSS: {phase.mss}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Adaptive Logic */}
        <div className="bg-forest/5 border-2 border-forest/20 rounded-lg p-12 mb-20">
          <h2 className="text-3xl font-bold text-forest mb-8">Real-Time Adaptive Logic</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-forest mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-growth" />
                MSS Calculation
              </h3>
              <p className="text-forest/70 mb-4">
                The Market Stability Score is computed from:
              </p>
              <ul className="space-y-2 text-forest/70 text-sm ml-4 border-l-2 border-forest/20 pl-4">
                <li>• Liquidity Depth Index (50%)</li>
                <li>• Holder Concentration (20%)</li>
                <li>• Buy/Sell Ratio (20%)</li>
                <li>• Volatility Factor (10%)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-forest mb-4 flex items-center gap-2">
                <Lock size={20} className="text-expansion" />
                Liquidity Lock Mechanism
              </h3>
              <p className="text-forest/70 mb-4">
                LP tokens are held in LiquidityVault and released in tranches:
              </p>
              <ul className="space-y-2 text-forest/70 text-sm ml-4 border-l-2 border-forest/20 pl-4">
                <li>• Each tranche has an MSS unlock threshold</li>
                <li>• Minimum phase requirement (e.g., must reach Growth)</li>
                <li>• Can be frozen by governance</li>
                <li>• Transparent on-chain schedule</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Agent Architecture */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-forest mb-8 text-center">Agent-Driven Evolution</h2>
          <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
            <p className="text-forest/70 mb-6 leading-relaxed">
              Agents are off-chain processes that analyze market data and submit signed payloads to EvolutionController.
              Each agent has a registered public key and proves authenticity via ECDSA signature verification.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Liquidity Agent',
                  role: 'Monitors LP depth, triggers rebalancing',
                },
                {
                  name: 'Market Agent',
                  role: 'Analyzes price action and volume patterns',
                },
                {
                  name: 'Reputation Agent',
                  role: 'Tracks holder behavior and scoring',
                },
              ].map((agent) => (
                <div key={agent.name} className="p-4 bg-forest/5 border border-forest/10 rounded-lg">
                  <h3 className="font-bold text-forest mb-2">{agent.name}</h3>
                  <p className="text-sm text-forest/70">{agent.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Transparency */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-2xl font-bold text-forest mb-6 flex items-center gap-2">
              <Shield size={24} className="text-expansion" />
              Security by Design
            </h2>
            <ul className="space-y-3 text-forest/70">
              <li className="flex gap-2">
                <span className="text-sage font-bold">✓</span>
                <span>All tax updates bounded by immutable min/max at launch</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage font-bold">✓</span>
                <span>Signature verification prevents unauthorized changes</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage font-bold">✓</span>
                <span>Reentrancy guards on all state-changing functions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage font-bold">✓</span>
                <span>Governor can freeze adaptive logic as failsafe</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-forest mb-6 flex items-center gap-2">
              <Anchor size={24} className="text-growth" />
              Full Transparency
            </h2>
            <ul className="space-y-3 text-forest/70">
              <li className="flex gap-2">
                <span className="text-sage font-bold">✓</span>
                <span>Every phase transition emits on-chain events</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage font-bold">✓</span>
                <span>Agent logs accessible via project dashboard</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage font-bold">✓</span>
                <span>Liquidity release schedule fully visible</span>
              </li>
              <li className="flex gap-2">
                <span className="text-sage font-bold">✓</span>
                <span>Real-time MSS computation from blockchain</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="text-center py-12 border-t border-forest/10">
          <h2 className="text-3xl font-bold text-forest mb-6">Ready to Launch?</h2>
          <p className="text-forest/60 mb-8 max-w-xl mx-auto">
            Deploy your adaptive token today. Full transparency, real-time adjustments, and community-driven governance.
          </p>
          <Link
            href="/launch"
            className="px-8 py-4 bg-forest text-white rounded-lg font-semibold hover:bg-forest/90 transition inline-flex items-center gap-2"
          >
            Start Your Launch <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
