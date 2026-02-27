'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, TrendingUp, Shield, Zap, Database, Code, Activity, RefreshCw } from 'lucide-react';
import AIAgentCard from '../../components/AIAgentCard';
import AgentLaunchForm from '../../components/AgentLaunchForm';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Demo agents for display when API is unavailable
const demoAgents = [
    {
        agentId: 0,
        name: 'Alpha Momentum Trader',
        symbol: 'AMT',
        strategyType: 'trading',
        status: 'active',
        performance: {
            roiPercent: 12.45,
            winRatePercent: 68.5,
            totalExecutions: 47,
            cumulativePnL: '0.1245',
            treasuryBalance: '1.2340',
        },
        createdAt: new Date().toISOString(),
    },
    {
        agentId: 1,
        name: 'Yield Optimizer v2',
        symbol: 'YOV2',
        strategyType: 'yield',
        status: 'active',
        performance: {
            roiPercent: 8.32,
            winRatePercent: 92.1,
            totalExecutions: 23,
            cumulativePnL: '0.0832',
            treasuryBalance: '2.5000',
        },
        createdAt: new Date().toISOString(),
    },
    {
        agentId: 2,
        name: 'Prediction Arbitrage Bot',
        symbol: 'PAB',
        strategyType: 'prediction',
        status: 'paused',
        performance: {
            roiPercent: 3.21,
            winRatePercent: 55.0,
            totalExecutions: 12,
            cumulativePnL: '0.0321',
            treasuryBalance: '0.5000',
        },
        createdAt: new Date().toISOString(),
    },
    {
        agentId: 3,
        name: 'Signal Intelligence API',
        symbol: 'SIA',
        strategyType: 'data_service',
        status: 'active',
        performance: {
            roiPercent: 15.60,
            winRatePercent: 100.0,
            totalExecutions: 89,
            cumulativePnL: '0.1560',
            treasuryBalance: '0.8750',
        },
        createdAt: new Date().toISOString(),
    },
];

export default function AIAgentsPage() {
    const [agents, setAgents] = useState(demoAgents);
    const [showLaunchForm, setShowLaunchForm] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [engineStatus, setEngineStatus] = useState<any>(null);

    useEffect(() => {
        fetchAgents();
        fetchEngineStatus();
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const fetchAgents = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/ai-agents`);
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) setAgents(data);
            }
        } catch (err) {
            console.log('Using demo agents (API unavailable)');
        }
    };

    const fetchEngineStatus = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/ai-agents/engine/status`);
            if (res.ok) setEngineStatus(await res.json());
        } catch (err) { /* API unavailable */ }
    };

    const handleLaunch = async (formData: any) => {
        setIsLaunching(true);
        try {
            const res = await fetch(`${API_BASE}/api/ai-agents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: agents.length,
                    name: formData.name,
                    symbol: formData.symbol,
                    strategyType: formData.strategyType,
                    creator: '0x0000000000000000000000000000000000000000',
                    initialCapital: formData.initialCapital,
                    riskParams: {
                        maxCapitalAllocationBps: parseInt(formData.maxCapitalBps),
                        maxDailyDeploymentBps: parseInt(formData.maxDailyBps),
                        maxDrawdownBps: parseInt(formData.maxDrawdownBps),
                    },
                }),
            });

            if (res.ok) {
                fetchAgents();
                setShowLaunchForm(false);
            }
        } catch (err) {
            // Add to local state for demo
            setAgents(prev => [...prev, {
                agentId: prev.length,
                name: formData.name,
                symbol: formData.symbol,
                strategyType: formData.strategyType,
                status: 'active',
                performance: {
                    roiPercent: 0,
                    winRatePercent: 0,
                    totalExecutions: 0,
                    cumulativePnL: '0',
                    treasuryBalance: formData.initialCapital,
                },
                createdAt: new Date().toISOString(),
            }]);
            setShowLaunchForm(false);
        }
        setIsLaunching(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent p-0 space-y-12">
                <div className="space-y-4">
                    <div className="h-12 w-96 skeleton" />
                    <div className="h-4 w-64 skeleton opacity-20" />
                </div>
                <div className="grid gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 skeleton luxury-card" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent">
            {/* Header */}
            <div className="pb-12 border-b border-gold/[0.05]">
                <Link href="/" className="text-muted/60 hover:text-gold transition-all flex items-center gap-3 mb-8 text-xs font-bold uppercase tracking-widest group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Neural Core Home
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-5xl font-bold text-white tracking-tight mb-4 flex items-baseline gap-4">
                            AI Agent <span className="text-gold italic font-serif">Launchpad</span>
                        </h1>
                        <p className="text-muted text-lg max-w-2xl leading-relaxed">
                            Deploy autonomous economic agents with isolated treasuries, real execution strategies, and on-chain revenue distribution.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowLaunchForm(!showLaunchForm)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Bot size={14} />
                        {showLaunchForm ? 'Close' : 'Launch Agent'}
                    </button>
                </div>
            </div>

            <div className="py-12 space-y-12">
                {/* Engine Status Banner */}
                <div className="luxury-card p-6 bg-secondary/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${engineStatus?.running ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        <span className="text-sm font-bold text-white">
                            Engine {engineStatus?.running ? 'Running' : 'Idle'}
                        </span>
                        {engineStatus && (
                            <span className="text-xs text-muted">
                                Cycles: {engineStatus.cycleCount || 0} | Active Agents: {engineStatus.activeAgents?.length || 0}
                            </span>
                        )}
                    </div>
                    <button onClick={fetchEngineStatus} className="text-muted hover:text-gold transition">
                        <RefreshCw size={16} />
                    </button>
                </div>

                {/* Strategy Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Trading', count: agents.filter(a => a.strategyType === 'trading').length, icon: TrendingUp, color: 'blue' },
                        { label: 'Yield', count: agents.filter(a => a.strategyType === 'yield').length, icon: Database, color: 'emerald' },
                        { label: 'Prediction', count: agents.filter(a => a.strategyType === 'prediction').length, icon: Zap, color: 'purple' },
                        { label: 'Data Service', count: agents.filter(a => a.strategyType === 'data_service').length, icon: Database, color: 'amber' },
                        { label: 'Generic', count: agents.filter(a => a.strategyType === 'generic').length, icon: Code, color: 'gray' },
                    ].map((s, i) => (
                        <div key={i} className="luxury-card p-6 text-center">
                            <s.icon size={24} className="text-gold mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white mb-1">{s.count}</p>
                            <p className="text-[10px] text-muted uppercase tracking-widest font-bold">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Launch Form */}
                {showLaunchForm && (
                    <AgentLaunchForm onLaunch={handleLaunch} isLoading={isLaunching} />
                )}

                {/* Agent Grid */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-white flex items-center gap-4 tracking-tight">
                            <Activity size={28} className="text-gold" />
                            Active <span className="text-gold italic font-serif">Agents</span>
                        </h2>
                        <span className="text-xs text-muted font-bold uppercase tracking-widest">
                            {agents.length} Agents Deployed
                        </span>
                    </div>

                    <div className="grid gap-6">
                        {agents.map(agent => (
                            <AIAgentCard key={agent.agentId} agent={agent} />
                        ))}
                    </div>

                    {agents.length === 0 && (
                        <div className="luxury-card p-16 text-center">
                            <Bot size={48} className="text-gold/30 mx-auto mb-4" />
                            <p className="text-muted text-lg">No agents deployed yet.</p>
                            <p className="text-muted/60 text-sm mt-2">Click &quot;Launch Agent&quot; to deploy your first autonomous economic agent.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
