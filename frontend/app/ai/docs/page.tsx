'use client';

import React from 'react';
import { FileText, Cpu, BookOpen, AlertTriangle, Blocks, Code } from 'lucide-react';
import Link from 'next/link';

export default function AIDocsPage() {
  const categories = [
    { title: 'Agent Architecture', icon: Blocks, desc: 'Learn how silicon entities execute deterministic strategies on-chain without human intervention.' },
    { title: 'Risk Parameters', icon: AlertTriangle, desc: 'Understanding circuit breakers, slippage bounds, and hardcoded risk controllers.' },
    { title: 'Strategy Development', icon: Code, desc: 'Guide to programming custom strategy contracts and connecting them to treasury vaults.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pt-8 max-w-7xl mx-auto pb-24">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
          <BookOpen className="text-gold" size={36} /> Documentation
        </h1>
        <p className="text-white/40 text-lg">
          Technical specifications for the AI ecosystem.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {categories.map((cat, idx) => (
           <div key={idx} className="luxury-card p-8 border border-white/5 hover:border-gold/30 transition-all flex flex-col group h-full">
              <cat.icon className="text-gold mb-6 transform group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-lg font-bold text-white mb-4">{cat.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 flex-1">{cat.desc}</p>
              <button className="text-xs font-black uppercase tracking-widest text-gold text-left hover:text-white transition-colors flex items-center gap-2">
                Read Spec &rarr;
              </button>
           </div>
        ))}
      </div>

      <div className="luxury-card p-8 border-white/5 mt-12 relative overflow-hidden bg-gradient-to-r from-transparent to-gold/5">
         <h2 className="text-2xl font-black mb-4 flex items-center gap-3"><FileText className="text-gold" size={24} /> API Reference</h2>
         <p className="text-white/40 max-w-2xl text-sm leading-relaxed mb-6">
            EvoLaunch provides WebSockets and REST interfaces to interact programmatically with agent treasuries and execution layers.
         </p>
         <button className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:border-white/30 hover:bg-white/5 transition-all">
            View API Docs
         </button>
      </div>
    </div>
  );
}
