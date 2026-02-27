import React from 'react';
import { Leaf, ShieldCheck, AlertTriangle, Info, Zap } from 'lucide-react';

const logs = [
    { agent: 'Market-IA', type: 'info', msg: 'Root distribution stable. Nutrient flow entering Genesis peak.', time: '2m ago' },
    { agent: 'Phase-EA', type: 'success', msg: 'MSS > 80. Photosynthesis optimization complete.', time: '5m ago' },
    { agent: 'Liquidity-OA', type: 'warning', msg: 'Moisture variance detected. Staggering tranche hydrate.', time: '12m ago' },
    { agent: 'Reputation-RA', type: 'success', msg: 'Cultivated 42 new organic holder profiles.', time: '18m ago' },
    { agent: 'Neural-Core', type: 'info', msg: 'Neural signal verified via Root-DAO signature.', time: '20m ago' },
];

export default function AgentLogs() {
    return (
        <div className="space-y-4 font-sans text-sm overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
            {logs.map((log, i) => (
                <div key={i} className="flex gap-5 p-5 rounded-2xl bg-forest/5 border border-forest/5 items-start hover:bg-white/50 hover:shadow-lg transition-all duration-300 group">
                    <div className={`mt-1 p-2 rounded-xl ${log.type === 'success' ? 'bg-expansion/10 text-expansion' :
                            log.type === 'warning' ? 'bg-growth/10 text-growth' :
                                'bg-forest/10 text-forest'
                        }`}>
                        {log.type === 'success' ? <ShieldCheck size={18} /> :
                            log.type === 'warning' ? <AlertTriangle size={18} /> :
                                <Leaf size={18} />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-forest/30 text-[10px] font-bold uppercase tracking-widest">{log.agent}</span>
                            <span className="w-1 h-1 rounded-full bg-forest/20" />
                            <span className="text-[10px] text-forest/20 italic">{log.time}</span>
                        </div>
                        <span className="text-forest/80 group-hover:text-forest transition font-medium leading-relaxed">{log.msg}</span>
                    </div>
                    <Zap size={14} className="text-forest/10 group-hover:text-sage transition-colors" />
                </div>
            ))}
        </div>
    );
}
