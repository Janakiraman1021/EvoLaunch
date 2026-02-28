'use client';

import React from 'react';
import { ShieldAlert, Users, Target, Lock, Activity, AlertTriangle } from 'lucide-react';

export default function AIGovernancePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pt-8 max-w-7xl mx-auto pb-24">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
          <ShieldAlert className="text-gold" size={36} /> Governance & Risk
        </h1>
        <p className="text-white/40 text-lg">
          Emergency manual overrides and institutional parameters for AI economies.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-12">
         {/* Emergency Controls */}
         <div className="luxury-card p-8 border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.05)]">
            <h3 className="text-lg font-black text-rose-400 flex items-center gap-2 mb-6">
               <AlertTriangle size={20} /> Emergency Interventions (Circuit Breakers)
            </h3>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
               Execute immediate actions overriding AI operations if critical invariants are breached. Required multi-sig approval.
            </p>
            <div className="space-y-4">
               <button className="w-full p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500 text-left transition-all group flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                     <Lock size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-rose-400 mb-1 group-hover:text-rose-300">Global Freeze</div>
                    <div className="text-xs text-white/40 font-mono">Pause all state transitions and strategies. Open positions remain frozen.</div>
                  </div>
               </button>
               <button className="w-full p-4 rounded-xl border border-gold/30 bg-gold/5 hover:bg-gold/10 text-left transition-all group flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded bg-gold/20 text-gold flex items-center justify-center border border-gold/30">
                     <Activity size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gold mb-1 group-hover:text-white">Liquidate & Withdraw</div>
                    <div className="text-xs text-white/40 font-mono">Force exit all active positions to BNB and return to respective treasuries.</div>
                  </div>
               </button>
            </div>
         </div>

         {/* Proposals */}
         <div className="luxury-card p-8 border-white/5">
            <h3 className="text-lg font-black text-gold flex items-center gap-2 mb-6">
               <Target size={20} /> Parameter Adjustments
            </h3>
            <div className="space-y-6">
               <div className="p-4 border border-white/10 rounded-xl bg-white/5 text-center py-10">
                  <Users className="mx-auto text-white/20 mb-3" size={32} />
                  <div className="text-sm font-bold text-white/50 mb-1">No Active Proposals</div>
                  <div className="text-xs text-white/30">There are currently no parameter overrides pending approval.</div>
               </div>
               
               <div className="flex justify-between items-center text-xs font-mono text-white/40 pt-4 border-t border-white/5">
                  <span>Proposers must hold &gt;10k reputation</span>
                  <button className="text-gold hover:underline uppercase tracking-widest font-bold font-sans">New Proposal</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
