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
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-6xl font-bold text-forest mb-4 leading-tight" style={{ color: '#2d4a2b' }}>
                        Protocol <span className="italic text-sage" style={{ color: '#7d8471' }}>Orchestra</span>
                    </h1>
                    <p className="text-forest/60 max-w-lg text-lg leading-relaxed">
                        Real-time adaptive market orchestration for
                        <span className="text-sage font-mono bg-forest/5 px-3 py-1 rounded-md ml-2 border border-forest/10 hover:border-forest/20 transition-colors">
                            0xEVO...3f2a
                        </span>
                    </p>
                </div>
                <div className="px-8 py-4 rounded-2xl border-2 border-growth/30 bg-white shadow-xl shadow-growth/10 flex items-center gap-4 group hover:scale-105 transition-transform duration-500">
                    <div className="w-12 h-12 bg-growth/10 rounded-full flex items-center justify-center text-growth animate-pulse">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-forest/40 uppercase tracking-widest">Active State</div>
                        <div className="text-2xl font-bold text-forest">{phase} Mode</div>
                    </div>
                </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'MSS Stability', value: `${mss}/100`, icon: Activity, color: 'text-expansion', bg: 'bg-expansion/5' },
                    { label: 'Market Index', value: tokenStats.price, icon: Compass, color: 'text-forest', bg: 'bg-forest/5' },
                    { label: 'Organic Growth', value: tokenStats.marketCap, icon: Wind, color: 'text-sage', bg: 'bg-sage/5' },
                    { label: 'Trust Score', value: tokenStats.holders, icon: Shield, color: 'text-olive', bg: 'bg-olive/5' },
                ].map((stat, i) => (
                    <div key={i} className="organic-card p-8 rounded-[2rem] flex flex-col gap-6 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} -mr-12 -mt-12 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700`} />
                        <div className="flex justify-between items-center relative">
                            <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                <stat.icon size={24} className={stat.color} />
                            </div>
                            <span className="text-xs font-bold text-forest/30 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-bold text-forest relative">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Analytical Layer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    {/* MSS Evolution Chart */}
                    <div className="organic-card p-10 rounded-[2.5rem] relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-bold text-forest flex items-center gap-3">
                                    Adaptive Evolution <span className="w-2 h-2 rounded-full bg-expansion animate-pulse" />
                                </h2>
                                <p className="text-forest/40 text-sm mt-1">Real-time market stability score tracking</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 rounded-md bg-forest/5 text-forest/40 text-[10px] font-bold">LIVE-FEED</div>
                                <div className="px-3 py-1 rounded-md bg-forest text-ivory text-[10px] font-bold">60S INTERVAL</div>
                            </div>
                        </div>
                        <div className="h-[400px] w-full mt-4">
                            <MSSChart />
                        </div>
                    </div>

                    {/* Agent Decisions Audit */}
                    <div className="organic-card p-10 rounded-[2.5rem]">
                        <h2 className="text-3xl font-bold text-forest mb-8 flex items-center gap-4">
                            <MessageSquare className="text-sage" size={28} /> Neural Audit Trail
                        </h2>
                        <AgentLogs />
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    {/* Evolutionary Timeline */}
                    <div className="organic-card p-10 rounded-[2.5rem] bg-forest text-ivory">
                        <h2 className="text-3xl font-bold mb-10 flex items-center gap-4">
                            <Zap className="text-olive" size={28} /> Progression
                        </h2>
                        <PhaseTimeline />
                    </div>

                    {/* Liquidity Management */}
                    <div className="organic-card p-10 rounded-[2.5rem]">
                        <h2 className="text-3xl font-bold text-forest mb-10 flex items-center gap-4">
                            <Lock className="text-olive" size={28} /> Tranches
                        </h2>
                        <div className="space-y-6">
                            {[
                                { label: 'Genesis Tranche', amount: '100k ALP', status: 'Active', icon: Unlock, color: 'text-expansion' },
                                { label: 'Growth Tranche', amount: '150k ALP', status: 'Dormant', icon: Lock, color: 'text-forest/20' },
                                { label: 'Maturity Tranche', amount: '250k ALP', status: 'Dormant', icon: Lock, color: 'text-forest/20' },
                            ].map((t, i) => (
                                <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-forest/5 border border-forest/5 hover:border-forest/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform`}>
                                            <t.icon size={20} className={t.color} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-forest">{t.label}</div>
                                            <div className="text-[10px] text-forest/40 font-mono tracking-tighter">{t.amount}</div>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${t.color}`}>{t.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
