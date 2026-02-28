'use client';

import React, { useState, useEffect } from 'react';
import { User, Cpu, Activity, Bot, ArrowRight, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ModeSelectorProps {
  onSelect: (mode: 'human' | 'ai') => void;
  isOpen: boolean;
}

export default function ModeSelector({ onSelect, isOpen }: ModeSelectorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredMode, setHoveredMode] = useState<'human' | 'ai' | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ${isOpen ? 'opacity-100 backdrop-blur-xl bg-background/80' : 'opacity-0 backdrop-blur-none bg-transparent pointer-events-none'}`}>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="neural-grid absolute inset-0 opacity-20" />
      </div>

      <div className={`relative z-10 max-w-5xl w-full px-6 transition-all duration-700 transform ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-12 scale-95 opacity-0'}`}>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6 backdrop-blur-md">
            <Shield size={14} className="text-gold" />
            <span className="text-xs font-bold tracking-widest uppercase text-white/70">System Initialization</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">
            Select Operating <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-gold">Paradigm</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base max-w-lg mx-auto font-medium">
            Choose your deployment architecture. You can switch paradigms at any time from the navigation menu.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 relative">

          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4 hidden md:flex">
            <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <div className="w-10 h-10 rounded-full border border-white/10 bg-background flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <span className="text-xs font-black text-white/30 italic">OR</span>
            </div>
            <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          </div>

          {/* Human Mode Card */}
          <button
            onClick={() => {
              onSelect('human');
              router.push('/dashboard');
            }}
            onMouseEnter={() => setHoveredMode('human')}
            onMouseLeave={() => setHoveredMode(null)}
            className={`group relative overflow-hidden rounded-3xl p-8 text-left transition-all duration-500 luxury-card ${hoveredMode === 'ai' ? 'opacity-40 scale-[0.98]' : 'hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(52,211,153,0.15)]'
              }`}
            style={{
              borderColor: hoveredMode === 'human' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-background transition-all duration-500 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                  <User size={32} />
                </div>
                <div className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${hoveredMode === 'human' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-white/10 text-white/30 bg-white/5'
                  }`}>
                  Current Meta
                </div>
              </div>

              <h2 className="text-2xl font-black mb-3 text-white group-hover:text-emerald-400 transition-colors">Human Launchpad</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 group-hover:text-white/60 transition-colors">
                Deploy and manage adaptive tokens manually. Program progressive liquidity, leverage Market Stability Scores (MSS), and govern your ecosystem.
              </p>

              <div className="space-y-3 mb-10">
                {['Manual Parameter Control', 'Predictable Tokenomics', 'Community Governance'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold text-white/50 group-hover:text-white/80 transition-colors">
                    <Activity size={16} className="text-emerald-400" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 text-emerald-400 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                Initialize Human Mode <ArrowRight size={16} className="animate-pulse" />
              </div>
            </div>

            {/* Scanline Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-50 group-hover:-translate-y-full transition-all duration-1000 ease-in-out" style={{ boxShadow: '0 0 20px rgba(52,211,153,0.5)' }} />
          </button>

          {/* AI Agent Mode Card */}
          <button
            onClick={() => {
              onSelect('ai');
              router.push('/ai-agents');
            }}
            onMouseEnter={() => setHoveredMode('ai')}
            onMouseLeave={() => setHoveredMode(null)}
            className={`group relative overflow-hidden rounded-3xl p-8 text-left transition-all duration-500 luxury-card ${hoveredMode === 'human' ? 'opacity-40 scale-[0.98]' : 'hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(201,168,76,0.15)]'
              }`}
            style={{
              borderColor: hoveredMode === 'ai' ? 'rgba(201, 168, 76, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-background transition-all duration-500 shadow-[0_0_20px_rgba(201,168,76,0.2)]">
                  <Cpu size={32} />
                </div>
                <div className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${hoveredMode === 'ai' ? 'border-gold/30 text-gold bg-gold/10' : 'border-white/10 border-dashed text-white/30 bg-transparent'
                  }`}>
                  <span className="mr-1 inline-block w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> Experimental
                </div>
              </div>

              <h2 className="text-2xl font-black mb-3 text-white group-hover:text-gold transition-colors">AI Agent Launchpad</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 group-hover:text-white/60 transition-colors">
                Launch autonomous silicon entities. Define strategies, fund treasuries, and let AI execute trades, manage yields, and distribute revenue.
              </p>

              <div className="space-y-3 mb-10">
                {['Autonomous Execution', 'Programmable Risk Bounds', 'On-chain AI Strategies'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold text-white/50 group-hover:text-white/80 transition-colors">
                    <Bot size={16} className="text-gold" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 text-gold font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                Initialize AI Mode <Zap size={16} className="animate-pulse" />
              </div>
            </div>

            {/* Shine Sweep Effect */}
            <div className="absolute inset-0 transform -translate-x-[150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-gold/20 to-transparent w-1/2 group-hover:translate-x-[250%] transition-transform duration-1500 ease-out z-20 pointer-events-none" />
          </button>
        </div>
      </div>
    </div>
  );
}
