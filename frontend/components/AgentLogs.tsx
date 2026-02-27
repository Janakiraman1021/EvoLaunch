import React from 'react';
import { Shield, ShieldAlert, AlertTriangle, Zap, CheckCircle } from 'lucide-react';

interface LogEntry {
    agent: string;
    type: string;
    msg: string;
    time: string;
}

const fallbackLogs: LogEntry[] = [
    { agent: 'Market-IA', type: 'info', msg: 'Root distribution stable. Flow entering Genesis peak.', time: '2m ago' },
    { agent: 'Phase-EA', type: 'success', msg: 'MSS > 80. Liquidity optimization complete.', time: '5m ago' },
    { agent: 'Liquidity-OA', type: 'warning', msg: 'Market variance detected. Staggering tranche hydrate.', time: '12m ago' },
    { agent: 'Reputation-RA', type: 'success', msg: 'Cultivated 42 new organic holder profiles.', time: '18m ago' },
    { agent: 'Neural-Core', type: 'info', msg: 'Neural signal verified via Root-DAO signature.', time: '20m ago' },
];

export default function AgentLogs({ logs }: { logs?: LogEntry[] }) {
    const displayLogs = logs && logs.length > 0 ? logs : fallbackLogs;
    return (
<<<<<<< HEAD
        <div className="space-y-6 font-sans text-sm overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
            {displayLogs.map((log, i) => (
                <div key={i} className="flex gap-6 p-6 rounded-2xl bg-[var(--secondary)]/40 border border-[var(--gold)]/[0.1] items-start hover:border-[var(--gold)]/30 hover:bg-[var(--gold)]/[0.04] transition-all duration-500 group">
                    <div className={`mt-1 p-3 rounded-xl border transition-all duration-300 ${log.type === 'success' ? 'bg-status-success/5 text-status-success border-status-success/20' :
                        log.type === 'warning' ? 'bg-status-warning/5 text-status-warning border-status-warning/20' :
                            'bg-gold/5 text-gold border-gold/10 group-hover:border-gold/30'
                        }`}>
                        {log.type === 'success' ? <CheckCircle size={20} /> :
                            log.type === 'warning' ? <AlertTriangle size={20} /> :
                                <Shield size={20} />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-gold text-[10px] font-bold uppercase tracking-[0.2em]">{log.agent}</span>
                            <span className="w-1 h-1 rounded-full bg-primary/10" />
                            <span className="text-[10px] text-muted/60 font-mono italic">{log.time}</span>
                        </div>
                        <span className="text-primary/90 group-hover:text-primary transition-colors duration-300 font-medium leading-relaxed block text-[15px]">{log.msg}</span>
                    </div>
                    <Zap size={16} className="text-primary/5 group-hover:text-gold/40 transition-colors duration-500" />
                </div>
            ))}
=======
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left font-sans">
                <thead>
                    <tr className="bg-primary/[0.02] text-xs font-bold text-muted uppercase tracking-[0.15em] border-b border-white/5">
                        <th className="px-10 py-5">Agent Identifier</th>
                        <th className="px-10 py-5">Event Mandate</th>
                        <th className="px-10 py-5 text-right whitespace-nowrap">Temporal State</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {logs.map((log, i) => (
                        <tr key={i} className="hover:bg-gold/[0.02] transition-colors group">
                            <td className="px-10 py-6 whitespace-nowrap">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl border transition-all duration-300 ${
                                        log.type === 'success' ? 'bg-status-success/5 text-status-success border-status-success/20' :
                                        log.type === 'warning' ? 'bg-status-warning/5 text-status-warning border-status-warning/20' :
                                        'bg-gold/5 text-gold border-gold/10 group-hover:border-gold/30'
                                    }`}>
                                        {log.type === 'success' ? <CheckCircle size={16} /> :
                                            log.type === 'warning' ? <AlertTriangle size={16} /> :
                                                <Shield size={16} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-mono text-gold font-bold uppercase tracking-[0.2em]">{log.agent}</span>
                                        <span className="text-xs text-primary/40 capitalize tracking-wider">{log.type}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-10 py-6 min-w-[300px]">
                                <span className="text-[15px] font-medium text-primary/90 group-hover:text-primary transition-colors duration-300 leading-relaxed block">
                                    {log.msg}
                                </span>
                            </td>
                            <td className="px-10 py-6 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-3">
                                    <span className="text-xs font-mono text-muted/60 italic">{log.time}</span>
                                    <Zap size={14} className="text-primary/10 group-hover:text-gold/40 transition-colors duration-500" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
>>>>>>> d475b0ad5b3502058dfe17b1afed54db44c104b8
        </div>
    );
}
