import React from 'react';
import { Gavel, ShieldAlert, Key, Settings, TreePine } from 'lucide-react';

export default function GovernancePanel() {
    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button className="p-8 luxury-card flex flex-col items-center gap-6 hover:border-status-danger/40 group transition-all duration-500 bg-secondary/50 backdrop-blur-sm shadow-luxury-soft">
                    <div className="p-5 rounded-2xl bg-status-danger/5 text-status-danger border border-status-danger/10 group-hover:scale-110 group-hover:bg-status-danger/10 transition-all duration-500">
                        <ShieldAlert size={32} />
                    </div>
                    <div className="text-center">
                        <span className="block text-xl font-bold text-white tracking-tight">Emergency Protocol</span>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-2 block">Root-Level Freeze</span>
                    </div>
                </button>
                <button className="p-8 luxury-card flex flex-col items-center gap-6 hover:border-gold/40 group transition-all duration-500 bg-secondary/50 backdrop-blur-sm shadow-luxury-soft">
                    <div className="p-5 rounded-2xl bg-gold/5 text-gold border border-gold/10 group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-500">
                        <Gavel size={32} />
                    </div>
                    <div className="text-center">
                        <span className="block text-xl font-bold text-white tracking-tight">Submit Mandate</span>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-2 block">Protocol Governance</span>
                    </div>
                </button>
                <button className="p-8 luxury-card flex flex-col items-center gap-6 hover:border-gold/40 group transition-all duration-500 bg-secondary/50 backdrop-blur-sm shadow-luxury-soft">
                    <div className="p-5 rounded-2xl bg-gold/5 text-gold border border-gold/10 group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-500">
                        <Key size={32} />
                    </div>
                    <div className="text-center">
                        <span className="block text-xl font-bold text-white tracking-tight">Access Control</span>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-2 block">Authority Rotation</span>
                    </div>
                </button>
                <button className="p-8 luxury-card flex flex-col items-center gap-6 hover:border-white/20 group transition-all duration-500 bg-secondary/50 backdrop-blur-sm shadow-luxury-soft">
                    <div className="p-5 rounded-2xl bg-white/5 text-white border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                        <Settings size={32} />
                    </div>
                    <div className="text-center">
                        <span className="block text-xl font-bold text-white tracking-tight">Configuration</span>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-2 block">Global Parameters</span>
                    </div>
                </button>
            </div>

            <div className="luxury-card p-12 bg-secondary/30 border-dashed border-gold/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-4 tracking-tight">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-gold-glow animate-pulse" />
                    Pending Institutional Votes
                </h3>
                <div className="text-sm text-muted/40 font-medium text-center py-12 tracking-widest uppercase">
                    The governance audit trail is currently pristine.
                </div>
            </div>
        </div>
    );
}
