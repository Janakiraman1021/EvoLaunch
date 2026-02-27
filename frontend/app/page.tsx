"use client";

import React, { useState } from 'react';
import { Activity, Shield, TrendingUp, Zap, Lock, Unlock, MessageSquare, Compass, Wind } from 'lucide-react';
import MSSChart from '../components/MSSChart';
import PhaseTimeline from '../components/PhaseTimeline';
import AgentLogs from '../components/AgentLogs';

export default function Dashboard() {
    const [mss] = useState(82);
    const [phase] = useState('Growth');
    const [tokenStats] = useState({
        price: '0.0042 BNB',
        marketCap: '$1.2M',
        liquidity: '$420K',
        holders: '1,240'
    });

    return (
        <div className="space-y-16 animate-in fade-in duration-1000">
            {/* Elite Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-gold/[0.05]">
                <div>
                    <h1 className="text-7xl font-bold tracking-tight mb-4 flex items-baseline gap-4">
                        <span className="text-white">Protocol</span>
                        <span className="text-gold italic font-serif">Orchestra</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <p className="text-muted text-lg font-medium">
                            Institutional Market Intelligence for
                        </p>
                        <code className="text-gold/80 bg-gold/5 px-4 py-1.5 rounded-lg border border-gold/10 font-mono text-sm hover:border-gold/30 transition-all cursor-pointer">
                            0xEVO...3f2a
                        </code>
                    </div>
                </div>
                
                <div className="glass-panel px-8 py-5 rounded-2xl flex items-center gap-6 group hover:border-gold/30 transition-all duration-500 shadow-luxury-soft">
                    <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold relative">
                        <div className="absolute inset-0 bg-gold/20 blur-md rounded-2xl animate-pulse" />
                        <TrendingUp size={28} className="relative z-10" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-1">Active Mandate</div>
                        <div className="text-3xl font-bold text-white tracking-tight">{phase} Mode</div>
                    </div>
                </div>
            </div>

            {/* Core Institutional Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'MSS Stability', value: `${mss}/100`, icon: Activity, trend: '+2.4%' },
                    { label: 'Market Index', value: tokenStats.price, icon: Compass, trend: 'Optimal' },
                    { label: 'Total Value', value: tokenStats.marketCap, icon: Wind, trend: 'Growing' },
                    { label: 'Institutional Trust', value: tokenStats.holders, icon: Shield, trend: 'Verified' },
                ].map((stat, i) => (
                    <div key={i} className="luxury-card p-10 flex flex-col gap-8 group">
                        <div className="flex justify-between items-start">
                            <div className="p-4 rounded-2xl bg-secondary border border-gold/10 group-hover:border-gold/30 transition-all duration-500">
                                <stat.icon size={26} className="text-gold" />
                            </div>
                            <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">{stat.label}</span>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2 tracking-tight group-hover:text-gold transition-colors duration-500">{stat.value}</div>
                            <div className="text-xs font-bold text-status-success tracking-wide flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-status-success" />
                                {stat.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytical & Execution Layer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    {/* MSS Evolution Intel */}
                    <div className="luxury-card p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/[0.02] -mr-32 -mt-32 rounded-full blur-3xl" />
                        <div className="flex justify-between items-center mb-12 relative z-10">
                            <div>
                                <h2 className="text-3xl font-bold text-white flex items-center gap-4 tracking-tight">
                                    Strategic Intel <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse shadow-gold-glow" />
                                </h2>
                                <p className="text-muted text-base mt-2">Real-time adaptive market stability score tracking</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 rounded-xl bg-secondary text-muted text-[10px] font-bold tracking-[0.1em] border border-white/5">LIVE-FEED</div>
                                <div className="px-4 py-2 rounded-xl bg-gold text-[#0C0C0F] text-[10px] font-bold tracking-[0.1em]">ENCRYPTED</div>
                            </div>
                        </div>
                        <div className="h-[450px] w-full relative z-10">
                            <MSSChart />
                        </div>
                    </div>

                    {/* Agent Decisions Audit */}
                    <div className="luxury-card p-12">
                        <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-5 tracking-tight">
                            <MessageSquare className="text-gold" size={32} /> Audit Command Trail
                        </h2>
                        <AgentLogs />
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-12">
                    {/* Evolutionary Timeline */}
                    <div className="luxury-card p-12 bg-secondary border-gold/20">
                        <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-5 tracking-tight">
                            <Zap className="text-gold" size={32} /> Progress
                        </h2>
                        <PhaseTimeline />
                    </div>

                    {/* Asset Lock Management */}
                    <div className="luxury-card p-12 shadow-luxury-soft">
                        <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-5 tracking-tight">
                            <Lock className="text-gold" size={32} /> Tranches
                        </h2>
                        <div className="space-y-8">
                            {[
                                { label: 'Genesis Tranche', amount: '100k ALP', status: 'Active', icon: Unlock, active: true },
                                { label: 'Growth Tranche', amount: '150k ALP', status: 'Dormant', icon: Lock, active: false },
                                { label: 'Maturity Tranche', amount: '250k ALP', status: 'Dormant', icon: Lock, active: false },
                            ].map((t, i) => (
                                <div key={i} className={`flex justify-between items-center p-6 rounded-2xl transition-all duration-500 border group ${t.active ? 'bg-gold/[0.03] border-gold/20 shadow-[inset_0_0_20px_rgba(230,192,123,0.02)]' : 'bg-secondary border-white/[0.03] opacity-60 hover:opacity-100 hover:border-white/10'}`}>
                                    <div className="flex items-center gap-5">
                                        <div className={`p-3 rounded-xl border transition-all duration-500 ${t.active ? 'bg-gold/10 text-gold border-gold/30' : 'bg-background text-muted/30 border-white/5'}`}>
                                            <t.icon size={22} />
                                        </div>
                                        <div>
                                            <div className={`text-base font-bold tracking-tight ${t.active ? 'text-white' : 'text-muted'}`}>{t.label}</div>
                                            <div className="text-[10px] text-muted/60 font-mono tracking-widest uppercase mt-1">{t.amount}</div>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${t.active ? 'text-gold' : 'text-muted/30'}`}>{t.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
