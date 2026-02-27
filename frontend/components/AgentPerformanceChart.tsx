'use client';

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PerformanceDataPoint {
    date: string;
    roi: number;
    pnl: number;
    executions: number;
}

interface AgentPerformanceChartProps {
    data: PerformanceDataPoint[];
    title?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#1C1C21] border border-gold/20 rounded-xl px-4 py-3 shadow-2xl">
            <p className="text-[10px] text-muted uppercase tracking-widest mb-2">{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
                    {p.name}: {typeof p.value === 'number' ? p.value.toFixed(4) : p.value}
                </p>
            ))}
        </div>
    );
};

export default function AgentPerformanceChart({ data, title = 'Performance' }: AgentPerformanceChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="luxury-card p-8">
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{title}</h3>
                <div className="h-64 flex items-center justify-center text-muted/40 text-sm">
                    No performance data yet. Executions will appear here.
                </div>
            </div>
        );
    }

    return (
        <div className="luxury-card p-8 space-y-6">
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>

            {/* ROI Chart */}
            <div>
                <p className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold mb-3 opacity-60">ROI Over Time</p>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#E6C07B" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#E6C07B" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#A1A1AA' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#A1A1AA' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="roi"
                            stroke="#E6C07B"
                            strokeWidth={2}
                            fill="url(#roiGradient)"
                            name="ROI %"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* PnL Bars */}
            <div>
                <p className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold mb-3 opacity-60">Profit / Loss</p>
                <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#A1A1AA' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#A1A1AA' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="pnl"
                            name="PnL (BNB)"
                            fill="#E6C07B"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
