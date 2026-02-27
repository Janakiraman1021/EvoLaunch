import React from 'react';
import { CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react';

const phases = [
    { title: 'Protective', status: 'completed', subtitle: 'Genesis Guard', time: '12:00 PM' },
    { title: 'Growth', status: 'current', subtitle: 'Organic Expansion', time: '12:45 PM' },
    { title: 'Expansion', status: 'pending', subtitle: 'Canopy Density', time: 'Waiting...' },
    { title: 'Governance', status: 'pending', subtitle: 'Root Activation', time: 'TBD' },
];

export default function PhaseTimeline() {
    return (
        <div className="relative space-y-10">
            <div className="absolute left-5 top-2 bottom-2 w-[1px] bg-ivory/10 shadow-[0_0_8px_rgba(250,249,246,0.1)]" />
            {phases.map((p, i) => (
                <div key={i} className="relative flex items-start gap-8 pl-12 group">
                    <div className={`absolute left-0 p-2 rounded-full z-10 transition-all duration-500 ${p.status === 'completed' ? 'bg-forest text-ivory border-2 border-ivory/20' :
                            p.status === 'current' ? 'bg-sage text-ivory animate-pulse border-2 border-ivory/40' :
                                'bg-forest/20 text-ivory/20 border-2 border-ivory/5'
                        }`}>
                        {p.status === 'completed' ? <CheckCircle2 size={20} /> :
                            p.status === 'current' ? <Sparkles size={20} /> :
                                <Circle size={20} />}
                    </div>
                    <div className="transition-all duration-300 group-hover:translate-x-1">
                        <div className={`text-xl font-bold tracking-tight ${p.status === 'current' ? 'text-sage' : 'text-ivory'}`}>
                            {p.title}
                        </div>
                        <div className="text-xs text-ivory/40 font-medium">{p.subtitle}</div>
                        <div className="text-[10px] text-ivory/20 font-mono mt-2 bg-ivory/5 px-2 py-0.5 rounded inline-block">
                            {p.time}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
