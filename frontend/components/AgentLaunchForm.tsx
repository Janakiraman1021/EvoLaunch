'use client';

import React, { useState } from 'react';
import { Rocket, Shield, Zap, Database, Code, TrendingUp } from 'lucide-react';

interface LaunchFormData {
    name: string;
    symbol: string;
    strategyType: string;
    initialCapital: string;
    maxCapitalBps: string;
    maxDailyBps: string;
    maxDrawdownBps: string;
}

interface AgentLaunchFormProps {
    onLaunch: (data: LaunchFormData) => void;
    isLoading?: boolean;
}

const strategies = [
    {
        id: 'trading',
        label: 'Trading',
        icon: TrendingUp,
        desc: 'Momentum-based PancakeSwap trading',
        color: 'blue',
    },
    {
        id: 'yield',
        label: 'Yield Farming',
        icon: Database,
        desc: 'Staking & LP farming optimization',
        color: 'emerald',
    },
    {
        id: 'prediction',
        label: 'Prediction Arbitrage',
        icon: Zap,
        desc: 'Prediction market spread capture',
        color: 'purple',
    },
    {
        id: 'data_service',
        label: 'Data Service',
        icon: Database,
        desc: 'AI signal API monetization',
        color: 'amber',
    },
    {
        id: 'generic',
        label: 'Generic Agent',
        icon: Code,
        desc: 'Custom programmable strategy',
        color: 'gray',
    },
];

export default function AgentLaunchForm({ onLaunch, isLoading }: AgentLaunchFormProps) {
    const [form, setForm] = useState<LaunchFormData>({
        name: '',
        symbol: '',
        strategyType: '',
        initialCapital: '0.01',
        maxCapitalBps: '2000',
        maxDailyBps: '5000',
        maxDrawdownBps: '1500',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.symbol || !form.strategyType) return;
        onLaunch(form);
    };

    const updateField = (field: keyof LaunchFormData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="luxury-card p-10 space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-4 mb-2">
                    <Rocket size={28} className="text-gold" />
                    Launch AI <span className="text-gold italic font-serif">Agent</span>
                </h2>
                <p className="text-muted text-sm">Deploy an autonomous economic agent with its own treasury and strategy.</p>
            </div>

            {/* Strategy Selection */}
            <div>
                <label className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold mb-4 block opacity-60">
                    Select Strategy
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {strategies.map(s => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => updateField('strategyType', s.id)}
                            className={`p-4 rounded-xl border text-left transition-all duration-300 ${form.strategyType === s.id
                                    ? 'border-gold/50 bg-gold/10 shadow-[0_0_20px_rgba(230,192,123,0.1)]'
                                    : 'border-white/[0.05] bg-secondary/30 hover:border-gold/20 hover:bg-secondary/60'
                                }`}
                        >
                            <s.icon size={20} className={form.strategyType === s.id ? 'text-gold mb-2' : 'text-muted mb-2'} />
                            <p className={`text-sm font-bold mb-1 ${form.strategyType === s.id ? 'text-gold' : 'text-white'}`}>
                                {s.label}
                            </p>
                            <p className="text-[10px] text-muted/60">{s.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Agent Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold mb-2 block opacity-60">
                        Agent Name
                    </label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={e => updateField('name', e.target.value)}
                        placeholder="Alpha Trading Bot"
                        className="w-full bg-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted/30 focus:border-gold/30 focus:outline-none transition"
                        required
                    />
                </div>
                <div>
                    <label className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold mb-2 block opacity-60">
                        Token Symbol
                    </label>
                    <input
                        type="text"
                        value={form.symbol}
                        onChange={e => updateField('symbol', e.target.value.toUpperCase())}
                        placeholder="ATB"
                        maxLength={6}
                        className="w-full bg-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted/30 focus:border-gold/30 focus:outline-none transition"
                        required
                    />
                </div>
                <div>
                    <label className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold mb-2 block opacity-60">
                        Initial Capital (BNB)
                    </label>
                    <input
                        type="number"
                        value={form.initialCapital}
                        onChange={e => updateField('initialCapital', e.target.value)}
                        step="0.001"
                        min="0.001"
                        className="w-full bg-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted/30 focus:border-gold/30 focus:outline-none transition"
                        required
                    />
                </div>
            </div>

            {/* Risk Parameters */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <Shield size={18} className="text-gold" />
                    <label className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold opacity-60">Risk Parameters</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="text-[10px] text-muted uppercase tracking-widest mb-2 block opacity-60">
                            Max Capital Per Trade (%)
                        </label>
                        <input
                            type="number"
                            value={(parseInt(form.maxCapitalBps) / 100).toString()}
                            onChange={e => updateField('maxCapitalBps', (parseFloat(e.target.value) * 100).toString())}
                            step="1"
                            min="1"
                            max="100"
                            className="w-full bg-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-white text-sm focus:border-gold/30 focus:outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-muted uppercase tracking-widest mb-2 block opacity-60">
                            Max Daily Deployment (%)
                        </label>
                        <input
                            type="number"
                            value={(parseInt(form.maxDailyBps) / 100).toString()}
                            onChange={e => updateField('maxDailyBps', (parseFloat(e.target.value) * 100).toString())}
                            step="1"
                            min="1"
                            max="100"
                            className="w-full bg-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-white text-sm focus:border-gold/30 focus:outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-muted uppercase tracking-widest mb-2 block opacity-60">
                            Max Drawdown (%)
                        </label>
                        <input
                            type="number"
                            value={(parseInt(form.maxDrawdownBps) / 100).toString()}
                            onChange={e => updateField('maxDrawdownBps', (parseFloat(e.target.value) * 100).toString())}
                            step="1"
                            min="1"
                            max="100"
                            className="w-full bg-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-white text-sm focus:border-gold/30 focus:outline-none transition"
                        />
                    </div>
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading || !form.name || !form.symbol || !form.strategyType}
                className="btn-primary w-full py-4 disabled:opacity-30 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Deploying Agent...' : 'Deploy AI Agent'}
            </button>
        </form>
    );
}
