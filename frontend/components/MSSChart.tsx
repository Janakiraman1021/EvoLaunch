"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface MSSDataPoint {
    time: string;
    mss: number;
}

const fallbackData: MSSDataPoint[] = [
    { time: '12:00', mss: 85 },
    { time: '12:05', mss: 82 },
    { time: '12:10', mss: 78 },
    { time: '12:15', mss: 84 },
    { time: '12:20', mss: 89 },
    { time: '12:25', mss: 81 },
    { time: '12:30', mss: 75 },
];

export default function MSSChart({ mss, data }: { mss?: number; data?: MSSDataPoint[] }) {
    const chartData = data && data.length > 0 ? data : fallbackData;
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorMss" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E6C07B" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#E6C07B" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" stroke="#ffffff" opacity={0.02} vertical={false} />
                <XAxis
                    dataKey="time"
                    stroke="#A1A1AA"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    opacity={0.3}
                    fontFamily="monospace"
                />
                <YAxis
                    domain={[0, 100]}
                    stroke="#A1A1AA"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    opacity={0.3}
                    hide
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1C1C21',
                        border: '1px solid rgba(230, 192, 123, 0.1)',
                        borderRadius: '16px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(10px)'
                    }}
                    itemStyle={{ color: '#E6C07B', fontWeight: 'bold', fontSize: '12px' }}
                    labelStyle={{ color: '#A1A1AA', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}
                    cursor={{ stroke: '#E6C07B', strokeWidth: 1.5, strokeDasharray: '6 6', opacity: 0.3 }}
                />
                <ReferenceLine y={40} stroke="#DC2626" strokeDasharray="4 4" opacity={0.2} label={{ value: 'CRITICAL', position: 'insideBottomLeft', fill: '#DC2626', fontSize: 9, fontWeight: 'bold', letterSpacing: '2px' }} />
                <ReferenceLine y={70} stroke="#E6C07B" strokeDasharray="4 4" opacity={0.2} label={{ value: 'OPTIMAL', position: 'insideBottomLeft', fill: '#E6C07B', fontSize: 9, fontWeight: 'bold', letterSpacing: '2px' }} />
                <Area
                    type="monotone"
                    dataKey="mss"
                    stroke="#E6C07B"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorMss)"
                    animationDuration={2500}
                    strokeLinecap="round"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
