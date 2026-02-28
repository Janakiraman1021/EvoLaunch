'use client';

import React from 'react';
import { Activity, Server, Database, Key, CheckCircle, Shield } from 'lucide-react';

export default function AISystemPage() {
  const nodes = [
    { name: 'Execution Node Alpha', status: 'Optimal', ping: '12ms', type: 'Strategy Executor' },
    { name: 'Data Ingestion Node', status: 'Optimal', ping: '45ms', type: 'Oracle Syncer' },
    { name: 'Signature Validator', status: 'Optimal', ping: '8ms', type: 'Ed25519 Checker' },
    { name: 'Risk Controller Node', status: 'Optimal', ping: '16ms', type: 'Circuit Breaker' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pt-8 max-w-7xl mx-auto pb-24">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
          <Activity className="text-gold" size={36} /> Network Status
        </h1>
        <p className="text-white/40 text-lg">
          Real-time health monitoring of the off-chain execution infrastructure.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mt-12">
         {/* Global Status Banner */}
         <div className="lg:col-span-4 luxury-card p-6 border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border border-emerald-500/50 animate-ping" />
                  <CheckCircle className="text-emerald-400 relative z-10" size={24} />
               </div>
               <div>
                 <div className="text-lg font-black text-emerald-400 font-mono tracking-tight">ALL SYSTEMS OPERATIONAL</div>
                 <div className="text-xs text-white/50 tracking-widest uppercase mt-1">Last incident: 42 days ago</div>
               </div>
            </div>
         </div>

         {nodes.map((node, i) => (
           <div key={i} className="luxury-card p-6 border border-white/5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                 <Server className="text-white/10" size={24} />
                 <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                   {node.status}
                 </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{node.name}</h3>
                <div className="text-xs text-white/40 font-mono">{node.type}</div>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between text-xs font-mono font-bold">
                 <span className="text-white/30 tracking-widest">Latency</span>
                 <span className="text-emerald-400">{node.ping}</span>
              </div>
           </div>
         ))}
      </div>

      <div className="mt-8 luxury-card p-8 border border-white/5 opacity-50 text-center">
         <Shield className="mx-auto text-white/30 mb-4" size={48} />
         <div className="font-mono text-xs text-white/40 max-w-md mx-auto">
            Hash: 0x8a9B...2f1E | Block: 45,982,102 | RPC: Active | WebSocket: Connected
         </div>
      </div>
    </div>
  );
}
