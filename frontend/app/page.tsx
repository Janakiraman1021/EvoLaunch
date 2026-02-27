'use client';

import React, { useState, useEffect } from 'react';
import {
    Activity,
    Shield,
    TrendingUp,
    Zap,
    Lock,
    Unlock,
    MessageSquare,
    Compass,
    Wind,
    LineChart,
    Target,
    ZapOff
} from 'lucide-react';
import MSSChart from '../components/MSSChart';
import PhaseTimeline from '../components/PhaseTimeline';
import AgentLogs from '../components/AgentLogs';
import api from '../lib/api';
import { useContracts } from '../lib/hooks/useContracts';
import { PHASE_NAMES, CONTRACT_ADDRESSES } from '../lib/contracts';

export default function Dashboard() {
    const [mss, setMss] = useState(82);
    const [phase, setPhase] = useState('Growth');
    const [tokenStats, setTokenStats] = useState({
        price: '0.0042 BNB',
        marketCap: '$1.2M',
        liquidity: '$420K',
        holders: '1,240'
    });
    const [mssChartData, setMssChartData] = useState<{ time: string; mss: number }[]>([]);
    const [agentLogs, setAgentLogs] = useState<any[]>([]);
    const [sellTax, setSellTax] = useState('5.0');
    const [buyTax, setBuyTax] = useState('2.0');
    const [vaultFrozen, setVaultFrozen] = useState(false);

    // Read on-chain data from deployed contracts
    const contracts = useContracts();

    useEffect(() => {
        if (contracts.phase) {
            setMss(contracts.phase.mss);
            setPhase(contracts.phase.phaseName);
        }
        if (contracts.token) {
            setSellTax(contracts.token.sellTax.toFixed(1));
            setBuyTax(contracts.token.buyTax.toFixed(1));
            setTokenStats(prev => ({
                ...prev,
                marketCap: `${Number(contracts.token!.totalSupply).toLocaleString()} ${contracts.token!.symbol}`,
            }));
        }
        if (contracts.vault) {
            setVaultFrozen(contracts.vault.isFrozen);
        }
    }, [contracts.phase, contracts.token, contracts.vault]);

    // Supplementary: Fetch history + logs from backend API
    useEffect(() => {
        const tokenAddress = api.getTokenAddress();
        if (tokenAddress) {
            api.getHistory(tokenAddress, 20).then(history => {
                if (history.length > 0) {
                    setMssChartData(history.map(h => ({
                        time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        mss: h.mss,
                    })));
                }
            });
            api.getAgentLogs(tokenAddress).then(logs => {
                if (logs.length > 0) {
                    setAgentLogs(logs.map(l => ({
                        agent: l.agent || 'Neural-Core',
                        type: l.result === 'success' ? 'success' : l.result === 'warning' ? 'warning' : 'info',
                        msg: l.action || '',
                        time: new Date(l.timestamp).toLocaleTimeString(),
                    })));
                }
            });
        }
    }, []);

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pt-6">
            {/* Global Ecosystem Ticker - High End Institutional Feel */}
            <div className="w-full h-8 glass-panel overflow-hidden border-y border-gold/10 flex items-center relative z-20">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex gap-12 items-center px-12">
                            <span className="text-xs font-bold text-gold uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-status-success shadow-gold-glow" /> SYSTEM_MSS: <span className="text-primary">{mss}/100</span>
                            </span>
                            <span className="text-xs font-bold text-muted uppercase tracking-[0.2em]">
                                LIQUIDITY_DEPTH: <span className="text-primary">$420,129.42</span>
                            </span>
                            <span className="text-xs font-bold text-muted uppercase tracking-[0.2em]">
                                AGENT_SYNC: <span className="text-status-success">OPTIMAL</span>
                            </span>
                            <span className="text-xs font-bold text-gold uppercase tracking-[0.2em]">
                                MANDATE_GENESIS: <span className="text-primary">COMPLETED</span>
                            </span>
                            <span className="text-xs font-bold text-muted uppercase tracking-[0.2em]">
                                POE_VALIDATION: <span className="text-primary">0.002s</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Core Institutional Metrics - Refined with hover effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {[
                    { label: 'MSS Stability', value: `${mss}/100`, icon: Activity, trend: '+2.4%', color: 'gold' },
                    { label: 'Market Index', value: tokenStats.price, icon: Compass, trend: 'Optimal', color: 'blue' },
                    { label: 'Total Value', value: tokenStats.marketCap, icon: Wind, trend: 'Growing', color: 'purple' },
                    { label: 'Institutional Trust', value: tokenStats.holders, icon: Shield, trend: 'Verified', color: 'green' },
                ].map((stat, i) => (
                    <div key={i} className="luxury-card p-8 flex flex-col gap-6 group hover:border-gold/30">
                        <div className="shine-sweep" />
                        <div className="flex justify-between items-start relative z-10">
                            <div className="icon-box-lg group-hover:scale-110 transition-transform bg-gold/5 border-gold/10 text-gold shadow-gold-subtle">
                                <stat.icon size={26} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-muted uppercase tracking-[0.2em]">{stat.label}</span>
                                <div className="text-2xl font-bold text-primary mt-1 tracking-tight group-hover:text-gold transition-colors">{stat.value}</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between relative z-10">
                            <div className="h-1 flex-1 bg-[var(--primary-text)]/5 rounded-full overflow-hidden mr-4">
                                <div className="h-full bg-gold/40 w-[70%] group-hover:w-[85%] transition-all duration-1000" />
                            </div>
                            <span className="text-xs font-bold text-status-success tracking-widest">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytical & Execution Layer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    {/* MSS Evolution Intel */}
                    <div className="luxury-card p-10 relative overflow-hidden group">
                        <div className="shine-sweep" />
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/[0.03] -mr-48 -mt-48 rounded-full blur-[100px] pointer-events-none" />
                        <div className="flex flex-wrap justify-between items-center mb-10 relative z-10 gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-primary flex items-center gap-4 tracking-tight">
                                    Strategic Intel <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse shadow-gold-glow" />
                                </h1>
                                <p className="text-muted text-sm mt-2 font-body">Real-time adaptive market stability score (MSS) matrix visualization</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="px-5 py-2.5 rounded-xl bg-primary/[0.03] text-muted text-xs font-bold tracking-[0.1em] border border-primary/5 hover:border-gold/20 transition-all cursor-pointer">
                                    EXPORT_JSON
                                </div>
                                <div className="px-5 py-2.5 rounded-xl bg-gold text-[#0C0C0F] text-xs font-bold tracking-[0.1em] shadow-gold-glow hover:scale-105 active:scale-95 transition-all cursor-pointer">
                                    LIVE_UPDATE
                                </div>
                            </div>
                        </div>
                        <div className="h-[400px] w-full relative z-10">
                            <MSSChart data={mssChartData} />
                        </div>
                    </div>

                    {/* Performance Audit Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="luxury-card p-8 group">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="icon-box bg-gold/10 border-gold/20 text-gold shadow-gold-subtle">
                                    <Target size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-primary tracking-tight italic">Adaptive Target</h3>
                                    <div className="text-[10px] text-muted font-bold uppercase tracking-widest">MSS Threshold: 75.0</div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-muted font-bold uppercase tracking-widest">Stability Buffer</span>
                                    <span className="text-sm font-bold text-gold">8.2%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gold shadow-gold-glow w-[65%]" />
                                </div>
                            </div>
                        </div>

                        <div className="luxury-card p-8 group">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="icon-box bg-status-success/10 border-status-success/20 text-status-success">
                                    <LineChart size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-primary tracking-tight italic">Yield Velocity</h3>
                                    <div className="text-[10px] text-muted font-bold uppercase tracking-widest">Efficiency: 94.2%</div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-muted font-bold uppercase tracking-widest">Network Load</span>
                                    <span className="text-sm font-bold text-status-success">Low</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-status-success shadow-[0_0_10px_#15803D] w-[30%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    {/* Evolutionary Timeline */}
                    <div className="luxury-card p-10 bg-secondary border-gold/20 relative group overflow-hidden">
                        <div className="noise-overlay" />
                        <h2 className="text-2xl font-bold text-primary mb-10 flex items-center gap-5 tracking-tight relative z-10">
                            <Zap className="text-gold" size={28} /> Growth Phase Timeline
                        </h2>
                        <div className="relative z-10">
                            <PhaseTimeline />
                        </div>
                    </div>

                </div>
            </div>

            {/* Agent Decisions Audit - Full Width Container */}
            <div className="luxury-card overflow-hidden w-full relative z-10">
                <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-primary flex items-center gap-4 tracking-tight">
                            <MessageSquare className="text-gold" size={28} /> Audit Command Trail
                        </h2>
                        <p className="text-muted text-sm mt-2 uppercase tracking-widest font-bold">Live Execution Matrix</p>
                    </div>
                </div>
                <div className="w-full bg-secondary/10">
                    <div className="max-h-[520px] overflow-y-auto no-scrollbar pr-2">
                        <AgentLogs logs={agentLogs} />
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
}
