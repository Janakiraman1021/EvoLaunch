'use client';

import { Activity, Shield, Zap } from 'lucide-react';

interface SystemStatusCardProps {
  status: {
    health: string;
    uptime: string;
    latency: string;
    throughput: string;
    activeNodes: number;
    lastHeartbeat: string;
  };
}

export default function SystemStatusCard({ status }: SystemStatusCardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="p-6 bg-secondary/30 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3 mb-4 text-gold"><Shield size={18} /><span className="text-xs font-bold uppercase tracking-widest">System Health</span></div>
        <div className="text-2xl font-bold text-primary">{status?.health || 'Optimal'}</div>
      </div>
      <div className="p-6 bg-secondary/30 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3 mb-4 text-gold"><Zap size={18} /><span className="text-xs font-bold uppercase tracking-widest">Uptime</span></div>
        <div className="text-2xl font-bold text-primary">{status?.uptime || '99.9%'}</div>
      </div>
      <div className="p-6 bg-secondary/30 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3 mb-4 text-gold"><Activity size={18} /><span className="text-xs font-bold uppercase tracking-widest">Latency</span></div>
        <div className="text-2xl font-bold text-primary">{status?.latency || '45ms'}</div>
      </div>
    </div>
  );
}
