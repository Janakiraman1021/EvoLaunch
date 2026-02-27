import React from 'react';
import { CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react';

const phases = [
    { title: 'Preparation', status: 'completed', subtitle: 'Smart Contract Audit', time: '12:00 PM' },
    { title: 'Launch', status: 'current', subtitle: 'Liquidity Deployment', time: '12:45 PM' },
    { title: 'Stabilization', status: 'pending', subtitle: 'Market making phase', time: 'Waiting...' },
    { title: 'Expansion', status: 'pending', subtitle: 'DAO Handover', time: 'TBD' },
];

export default function PhaseTimeline() {
    return (
        <div className="relative space-y-12 py-4">
            <div className="absolute left-[31px] top-4 bottom-4 w-[1px] bg-gold/10" />
            {phases.map((p, i) => (
                <div key={i} className="relative flex items-start gap-10 pl-20 group">
                    <div className={`absolute left-0 p-3 rounded-2xl z-10 transition-all duration-700 glass-panel border-2 ${
                        p.status === 'completed' ? 'text-gold border-gold/40' :
                        p.status === 'current' ? 'text-gold border-gold shadow-gold-glow animate-pulse' :
                        'text-muted/20 border-white/5 bg-secondary'
                    }`}>
                        {p.status === 'completed' ? <CheckCircle2 size={24} /> :
                            p.status === 'current' ? <Sparkles size={24} /> :
                                <Circle size={24} />}
                    </div>
                    <div className="transition-all duration-500 group-hover:translate-x-2">
                        <div className={`text-2xl font-bold tracking-tight mb-2 ${p.status === 'current' ? 'text-gold' : 'text-primary'}`}>
                            {p.title}
                        </div>
                        <div className="text-sm text-muted/60 font-medium">{p.subtitle}</div>
                        <div className="text-[10px] text-gold/60 font-mono mt-4 bg-gold/5 px-3 py-1.5 border border-gold/10 rounded-lg inline-block tracking-widest uppercase">
                            {p.time}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
