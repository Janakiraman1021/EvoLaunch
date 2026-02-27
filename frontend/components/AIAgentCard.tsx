'use client';

import React, { useState, useEffect } from 'react';

interface AIAgentCardData {
    agentId: number;
    name: string;
    symbol: string;
    strategyType: string;
    status: string;
    performance: {
        roiPercent: number;
        winRatePercent: number;
        totalExecutions: number;
        cumulativePnL: string;
        treasuryBalance: string;
    };
    createdAt: string;
}

interface AIAgentCardProps {
    agent: AIAgentCardData;
}

const strategyColors: Record<string, { bg: string; text: string; border: string }> = {
    trading: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    yield: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    prediction: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    data_service: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    generic: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30' },
};

const strategyLabels: Record<string, string> = {
    trading: 'Trading',
    yield: 'Yield Farming',
    prediction: 'Prediction Arbitrage',
    data_service: 'Data Service',
    generic: 'Generic',
};

export default function AIAgentCard({ agent }: AIAgentCardProps) {
    const colors = strategyColors[agent.strategyType] || strategyColors.generic;
    const roi = agent.performance?.roiPercent || 0;
    const isPositive = roi >= 0;

    return (
        <a
            href={`/ai-agents/${agent.agentId}`}
            className="luxury-card p-8 group hover:border-gold/30 transition-all duration-500 block cursor-pointer"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-gold transition-colors">
                            {agent.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${colors.bg} ${colors.text} ${colors.border}`}>
                            {strategyLabels[agent.strategyType] || agent.strategyType}
                        </span>
                    </div>
                    <p className="text-xs text-muted/60 font-mono">${agent.symbol}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${agent.status === 'active'
                        ? 'bg-status-success/10 text-status-success border-status-success/30'
                        : 'bg-muted/10 text-muted border-muted/30'
                    }`}>
                    {agent.status}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-secondary/40 rounded-xl border border-white/[0.03]">
                    <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1 opacity-60">ROI</p>
                    <p className={`text-lg font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{roi.toFixed(2)}%
                    </p>
                </div>
                <div className="p-4 bg-secondary/40 rounded-xl border border-white/[0.03]">
                    <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1 opacity-60">Win Rate</p>
                    <p className="text-lg font-bold text-white">
                        {(agent.performance?.winRatePercent || 0).toFixed(1)}%
                    </p>
                </div>
                <div className="p-4 bg-secondary/40 rounded-xl border border-white/[0.03]">
                    <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1 opacity-60">Treasury</p>
                    <p className="text-lg font-bold text-gold">
                        {parseFloat(agent.performance?.treasuryBalance || '0').toFixed(4)} BNB
                    </p>
                </div>
                <div className="p-4 bg-secondary/40 rounded-xl border border-white/[0.03]">
                    <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1 opacity-60">Executions</p>
                    <p className="text-lg font-bold text-white">
                        {agent.performance?.totalExecutions || 0}
                    </p>
                </div>
            </div>
        </a>
    );
}
