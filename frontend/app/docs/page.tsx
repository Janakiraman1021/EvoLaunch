'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Code, Shield, Zap, Lock, CheckCircle } from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  subsections?: Array<{ title: string; content: string }>;
}

export default function DocsPage() {
  const [expanded, setExpanded] = useState<string>('phases');

  const sections: DocSection[] = [
    {
      id: 'phases',
      title: 'Phase Logic',
      icon: <Zap size={24} />,
      content:
        'The EvoLaunch protocol moves through four distinct phases based on Market Stability Score (MSS) thresholds.',
      subsections: [
        {
          title: 'Protective Phase (MSS 0-25)',
          content:
            'Initial launch phase with maximum protection. High transaction taxes (up to 25%), strict wallet limits, and frequent parameter adjustments. Prevents whale accumulation and pump-and-dump schemes during vulnerable early stage.',
        },
        {
          title: 'Growth Phase (MSS 25-50)',
          content:
            'Token demonstrates stable trading patterns. Taxes moderate to encourage volume. Transaction limits increase. First liquidity tranches unlock. Community participation grows.',
        },
        {
          title: 'Expansion Phase (MSS 50-75)',
          content:
            'Organic ecosystem growth phase. Taxes decrease further, limits increase significantly. Larger liquidity releases. Agent-recommended features enabled.',
        },
        {
          title: 'Governance Phase (MSS 75-100)',
          content:
            'Community-driven phase. DAO takes full control of parameters. Minimal tax constraints (0-5%). Full transparency voting on all updates. Maximum freedom for ecosystem.',
        },
      ],
    },
    {
      id: 'mss',
      title: 'MSS Formula',
      icon: <Code size={24} />,
      content:
        'Market Stability Score (0-100) is calculated as a weighted average of on-chain metrics.',
      subsections: [
        {
          title: 'Formula',
          content: 'MSS = (LDI × 0.50) + (HC × 0.20) + (BSR × 0.20) + (VF × 0.10)',
        },
        {
          title: 'Liquidity Depth Index (LDI) - 50%',
          content:
            'Measures available liquidity in the AMM pair. Calculated as: LDI = min(lpBalance / targetLiquidity × 100, 100). Higher liquidity = more stable price, higher MSS.',
        },
        {
          title: 'Holder Concentration (HC) - 20%',
          content:
            'Inverse of whale concentration. HC = 100 - (top10HolderPercent). More distributed ownership = lower risk, higher MSS.',
        },
        {
          title: 'Buy/Sell Ratio (BSR) - 20%',
          content:
            'Volume ratio normalized to 0-100. BSR = (buyVolume / (buyVolume + sellVolume)) × 100. Ratio closer to 50-50 indicates healthy trading.',
        },
        {
          title: 'Volatility Factor (VF) - 10%',
          content:
            'Inverse of price volatility. VF = max(0, 100 - (priceStdDev × 100)). Lower volatility = more stable, higher MSS.',
        },
      ],
    },
    {
      id: 'plu',
      title: 'Progressive Liquidity Unlock (PLU)',
      icon: <Lock size={24} />,
      content:
        'Liquidity is released in tranches tied to both MSS milestones and phase transitions.',
      subsections: [
        {
          title: 'How PLU Works',
          content:
            'LP tokens are held in LiquidityVault. Each tranche has: (1) MSS threshold - minimum MSS required, (2) Phase requirement - must reach specific phase first, (3) Time condition - optional time lock.',
        },
        {
          title: 'Tranche Example',
          content:
            'Tranche 1: 25% LP released when MSS ≥ 25 AND reached Growth phase. Tranche 2: Additional 30% when MSS ≥ 50 AND Expansion phase. Final tranches require Governance phase.',
        },
        {
          title: 'Emergency Freeze',
          content:
            'Governor can freeze all unlocks temporarily if anomalous behavior detected. Max freeze duration: 48 hours. Automatic resume after freeze expires.',
        },
      ],
    },
    {
      id: 'sig',
      title: 'Signature Verification',
      icon: <Shield size={24} />,
      content:
        'All parameter updates must include valid ECDSA signatures from registered agents.',
      subsections: [
        {
          title: 'Agent Registration',
          content:
            'Each agent has a registered public key stored in EvolutionController. Only 3 agents initially: Liquidity Agent, Market Agent, Reputation Agent.',
        },
        {
          title: 'Signature Process',
          content:
            '(1) Agent computes new parameters offline, (2) Creates hash: keccak256(abi.encode(newParams)), (3) Signs with private key, (4) Submits signature + data to EvolutionController',
        },
        {
          title: 'Verification',
          content:
            'EvolutionController recovers signer address from signature. If recovered address matches registered public key AND signature is valid, update proceeds.',
        },
        {
          title: 'Invalid Signatures',
          content:
            'Rejected updates emit FailedUpdate event. Multiple consecutive rejections trigger alert to governance. Persistent failures lead to agent deactivation vote.',
        },
      ],
    },
    {
      id: 'gov',
      title: 'Governance Bounds',
      icon: <CheckCircle size={24} />,
      content:
        'All protocol parameters have immutable bounds set at launch. No amount of voting can exceed these limits.',
      subsections: [
        {
          title: 'Tax Bounds',
          content:
            'Set at launch as [minTax, maxTax]. Example: [0%, 25%]. Agents can only propose taxes within this range. Even DAO votes cannot change bounds.',
        },
        {
          title: 'Transaction Limit Bounds',
          content:
            'Set at launch as [minMaxTx, maxMaxTx]. Example: [10,000 tokens, 1M tokens]. Prevents both excessive restrictions and removal of protections.',
        },
        {
          title: 'Phase Thresholds',
          content:
            'Fixed at [25, 50, 75] MSS boundaries. Cannot be changed. Ensures predictable evolution path for community.',
        },
        {
          title: 'Emergency Override',
          content:
            'Governor can freeze adaptive logic with 48-hour execution delay. Requires 2/3 governance vote to actually freeze. Prevents temporary governance hijacking.',
        },
      ],
    },
    {
      id: 'security',
      title: 'Security Assumptions',
      icon: <Shield size={24} />,
      content:
        'Critical security properties that ensure protocol safety.',
      subsections: [
        {
          title: 'Reentrancy Protection',
          content:
            'All state-changing functions use OpenZeppelin ReentrancyGuard. Nested calls cannot exploit state inconsistencies.',
        },
        {
          title: 'Owner Access Control',
          content:
            'LaunchFactory owner is set to deployer initially. Can be renounced or transferred. All contract roles use proper AccessControl.',
        },
        {
          title: 'Pausable Emergency Stop',
          content:
            'GovernanceModule can pause token transfers globally. Useful for fronting exploit attempts or emergency scenarios.',
        },
        {
          title: 'No Upgradeable Proxies',
          content:
            'All contracts are non-upgradeable. Code is immutable. No risk of runtime logic changes. Ensures security contracts.',
        },
        {
          title: 'Bound Constraints Are Final',
          content:
            'Tax and transaction limits set at launch are immutable. Even protocol upgrade would require fresh deployment.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="pb-12 border-b border-gold/[0.05]">
        <Link href="/" className="text-muted/60 hover:text-gold transition-all flex items-center gap-3 mb-8 text-xs font-bold uppercase tracking-widest group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Neural Core Home
        </Link>
        <h1 className="text-5xl font-bold text-white tracking-tight mb-4 flex items-center gap-6">
          <BookOpen size={48} className="text-gold" />
          Protocol <span className="text-gold italic font-serif">Reference</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl leading-relaxed">
          Technical specifications and cryptographic architecture of the EvoLaunch Protocol. Pure institutional intelligence.
        </p>
      </div>

      <div className="py-12 max-w-4xl mx-auto">
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="luxury-card overflow-hidden group">
              <button
                onClick={() => setExpanded(expanded === section.id ? '' : section.id)}
                className="w-full px-10 py-8 flex items-center justify-between hover:bg-gold/[0.02] transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="text-gold group-hover:scale-110 transition-transform duration-500">{section.icon}</div>
                  <h2 className="text-2xl font-bold text-white tracking-tight text-left group-hover:text-gold transition-colors">{section.title}</h2>
                </div>
                <div className={`text-gold/40 transition-transform duration-500 ${expanded === section.id ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </button>

              {expanded === section.id && (
                <div className="border-t border-gold/[0.05] px-10 py-10 space-y-10 bg-black/20">
                  <p className="text-muted text-lg leading-relaxed font-medium">{section.content}</p>

                  {section.subsections && (
                    <div className="space-y-10 mt-10 pt-10 border-t border-gold/[0.05]">
                      {section.subsections.map((sub, idx) => (
                        <div key={idx} className="luxury-card p-8 bg-black/40 border-gold/10 hover:border-gold/30 transition-all">
                          <h3 className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-4">{sub.title}</h3>
                          <p className="text-white/80 leading-relaxed text-sm font-medium">{sub.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Key Takeaways */}
        <div className="mt-20 luxury-card p-12 bg-secondary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/[0.02] -mr-32 -mt-32 rounded-full blur-3xl" />
          <h3 className="text-3xl font-bold text-white mb-12 tracking-tight">Institutional Mandates</h3>
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {[
              {
                title: 'Immutable Bounds',
                desc: 'Tax and limit boundaries are set during initialization. No mandate can exceed these constants.',
              },
              {
                title: 'Mandate Transparency',
                desc: 'Phase shifts and parameter resets are permanently recorded on the blockchain.',
              },
              {
                title: 'Neural Signatures',
                desc: 'All off-chain intelligence requires valid ECDSA signatures for core state modification.',
              },
              {
                title: 'Override Latency',
                desc: 'Governance can freeze logic with a 48-hour delay, ensuring stability during transitions.',
              },
              {
                title: 'Milestone Releases',
                desc: 'Liquidity triggers are mathematically tied to MSS floors and temporal milestones.',
              },
              {
                title: 'Hardcore Immutability',
                desc: 'Non-upgradeable smart contracts. Code is law. Zero runtime logic volatility.',
              },
            ].map((item, idx) => (
              <div key={idx} className="luxury-card p-8 bg-black/40 border-gold/10 hover:border-gold/30 group transition-all">
                <h4 className="text-lg font-bold text-white mb-3 group-hover:text-gold transition-colors">{item.title}</h4>
                <p className="text-sm text-muted font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
