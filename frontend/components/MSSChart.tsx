"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
    { time: '12:00', mss: 85 },
    { time: '12:05', mss: 82 },
    { time: '12:10', mss: 78 },
    { time: '12:15', mss: 84 },
    { time: '12:20', mss: 89 },
    { time: '12:25', mss: 81 },
    { time: '12:30', mss: 75 },
];

export default function MSSChart({ mss }: { mss?: number }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorMss" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2d4a2b" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#2d4a2b" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d4a2b" opacity={0.05} vertical={false} />
                <XAxis
                    dataKey="time"
                    stroke="#2d4a2b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    opacity={0.3}
                />
                <YAxis
                    domain={[0, 100]}
                    stroke="#2d4a2b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    opacity={0.3}
                    hide
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(45, 74, 43, 0.1)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: '#2d4a2b', fontWeight: 'bold' }}
                    cursor={{ stroke: '#2d4a2b', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <ReferenceLine y={40} stroke="#8b3a3a" strokeDasharray="3 3" opacity={0.2} label={{ value: 'PROTECTIVE', position: 'insideBottomLeft', fill: '#8b3a3a', fontSize: 8, fontWeight: 'bold' }} />
                <ReferenceLine y={70} stroke="#d4a373" strokeDasharray="3 3" opacity={0.2} label={{ value: 'GROWTH', position: 'insideBottomLeft', fill: '#d4a373', fontSize: 8, fontWeight: 'bold' }} />
                <Area
                    type="monotone"
                    dataKey="mss"
                    stroke="#2d4a2b"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMss)"
                    animationDuration={2000}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
