import React from 'react';
import { Gavel, ShieldAlert, Key, Settings, TreePine } from 'lucide-react';

export default function GovernancePanel() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="p-6 organic-card rounded-[2rem] flex flex-col items-center gap-4 hover:border-protective/40 group transition-all duration-500">
                    <div className="p-4 rounded-2xl bg-protective/5 text-protective group-hover:scale-110 transition-transform">
                        <ShieldAlert size={28} />
                    </div>
                    <div className="text-center">
                        <span className="block text-lg font-bold text-forest">Emergency Pause</span>
                        <span className="text-[10px] font-medium text-forest/40 uppercase tracking-widest mt-1 block">Root-Level Freeze</span>
                    </div>
                </button>
                <button className="p-6 organic-card rounded-[2rem] flex flex-col items-center gap-4 hover:border-sage/40 group transition-all duration-500">
                    <div className="p-4 rounded-2xl bg-sage/5 text-sage group-hover:scale-110 transition-transform">
                        <Gavel size={28} />
                    </div>
                    <div className="text-center">
                        <span className="block text-lg font-bold text-forest">New Proposal</span>
                        <span className="text-[10px] font-medium text-forest/40 uppercase tracking-widest mt-1 block">Canopy Evolution</span>
                    </div>
                </button>
                <button className="p-6 organic-card rounded-[2rem] flex flex-col items-center gap-4 hover:border-olive/40 group transition-all duration-500">
                    <div className="p-4 rounded-2xl bg-olive/5 text-olive group-hover:scale-110 transition-transform">
                        <Key size={28} />
                    </div>
                    <div className="text-center">
                        <span className="block text-lg font-bold text-forest">Key Rotation</span>
                        <span className="text-[10px] font-medium text-forest/40 uppercase tracking-widest mt-1 block">Neural Seed Update</span>
                    </div>
                </button>
                <button className="p-6 organic-card rounded-[2rem] flex flex-col items-center gap-4 hover:border-forest/20 group transition-all duration-500">
                    <div className="p-4 rounded-2xl bg-forest/5 text-forest group-hover:scale-110 transition-transform">
                        <Settings size={28} />
                    </div>
                    <div className="text-center">
                        <span className="block text-lg font-bold text-forest">Config Bounds</span>
                        <span className="text-[10px] font-medium text-forest/40 uppercase tracking-widest mt-1 block">Immutable Laws</span>
                    </div>
                </button>
            </div>

            <div className="organic-card p-8 rounded-[2rem] bg-forest/5 border-forest/10 border-dashed">
                <h3 className="text-lg font-bold text-forest mb-4 flex items-center gap-3">
                    <TreePine size={20} className="text-sage" /> Active Proposals
                </h3>
                <div className="text-xs text-forest/30 font-medium text-center py-8">
                    The governance thicket is currently quiet.
                </div>
            </div>
        </div>
    );
}
