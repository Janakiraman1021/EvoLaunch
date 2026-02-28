'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, LineChart, Lock, Zap, Activity, TrendingUp } from 'lucide-react';
import MSSChart from '../../../../components/MSSChart';
import api from '../../../../lib/api';

interface ProjectData {
  symbol: string;
  name: string;
  currentPhase: string;
  mssValue: number;
  phaseDescription: string;
  lastAgentUpdateTime: string;

  tokenInfo: {
    address: string;
    totalSupply: string;
    holders: number;
  };

  liquidityInfo: {
    totalLocked: string;
    totalReleased: string;
    unlockSchedule: Array<{
      tranche: number;
      amount: string;
      threshold: number;
      phase: string;
      status: 'pending' | 'unlocked';
    }>;
    frozen: boolean;
  };

  adaptiveParams: {
    currentSellTax: number;
    currentBuyTax: number;
    maxTx: string;
    incentiveMultiplier: number;
    bounds: {
      minTax: number;
      maxTax: number;
      minMaxTx: string;
      minMaxWallet: string;
    };
  };

  agentLogs: Array<{
    agent: string;
    timestamp: string;
    action: string;
    signature: string;
    verified: boolean;
    block: number;
  }>;

  transactions: Array<{
    type: 'buy' | 'sell';
    amount: string;
    price: string;
    address: string;
    timestamp: string;
    volumeSpike: boolean;
  }>;
}

export default function ProjectDashboard({ params }: { params: { address: string } }) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    async function loadProjectData() {
      try {
        const address = params.address as string;
        const [statusData, historyData, metricsData, unlocksData] = await Promise.all([
          api.getStatus(address), api.getPhaseHistory(address), api.getMetrics(address), api.getLiquidityUnlocks(address)
        ]);
        const { launch, mss, logs } = statusData;
        if (!launch) { setProject(null); setLoading(false); return; }

        const formattedLogs = (logs || []).map((l: any) => ({
          agent: l.agentId || 'Neural Core', timestamp: new Date(l.timestamp).toLocaleString(),
          action: l.action || 'Performed state update', signature: l.transactionHash || '0xSystem...', verified: true, block: l.blockNumber || 0,
        }));

        const projectData: ProjectData = {
          symbol: launch.symbol || 'UNK', name: launch.name || 'Unknown Agent',
          currentPhase: launch.phaseName || 'Genesis', mssValue: mss || 50,
          phaseDescription: `Agent is operating in ${launch.phaseName || 'Genesis'} epoch. Dynamic bounds active.`,
          lastAgentUpdateTime: formattedLogs.length > 0 ? formattedLogs[0].timestamp : 'Waiting for telemetry...',
          tokenInfo: { address: launch.tokenAddress, totalSupply: launch.totalSupply || '0', holders: metricsData?.holders || 0 },
          liquidityInfo: {
            totalLocked: `${metricsData?.liquidity || 0} BNB Locked`, totalReleased: '0 BNB', frozen: launch.status === 'paused',
            unlockSchedule: (unlocksData || []).map((u: any, i: number) => ({
              tranche: i + 1, amount: `${u.amount || '0'} BNB`, threshold: u.mssThreshold || 0,
              phase: u.phaseName || 'Unknown', status: u.unlocked ? 'unlocked' : 'pending'
            })),
          },
          adaptiveParams: {
            currentSellTax: launch.sellTax || 0, currentBuyTax: launch.buyTax || 0,
            maxTx: 'Dynamic', incentiveMultiplier: 1.0,
            bounds: { minTax: 0, maxTax: 25, minMaxTx: 'Dynamic', minMaxWallet: 'Dynamic' },
          },
          agentLogs: formattedLogs.length > 0 ? formattedLogs : [{ agent: 'System Init', timestamp: 'Just now', action: 'Awaiting intelligence stream', signature: 'N/A', verified: true, block: 0 }],
          transactions: [],
        };
        setProject(projectData); setLoading(false);
      } catch (err) { console.error('Failed to load project details:', err); setProject(null); setLoading(false); }
    }
    loadProjectData();
  }, [params.address]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent p-12 space-y-12">
        <div className="space-y-4"><div className="h-4 w-32 skeleton opacity-20" /><div className="h-12 w-96 skeleton" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="h-64 skeleton luxury-card" /><div className="h-64 skeleton luxury-card" /></div>
        <div className="h-[500px] skeleton luxury-card" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-card p-12 text-center max-w-md">
          <AlertCircle size={48} className="text-status-danger mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Neural Asset Not Found</h2>
          <p className="text-muted mb-8">The requested address is not registered in the Evolution Controller.</p>
          <Link href="/ai-agents/explore" className="btn-primary inline-block">Return to Explorer</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="pb-12 border-b border-gold/[0.05]">
        <Link href="/ai-agents/explore" className="text-muted/60 hover:text-gold transition-all flex items-center gap-3 mb-8 text-xs font-bold uppercase tracking-widest group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Neural Explorer
        </Link>
        <div className="grid md:grid-cols-3 gap-12 items-end">
          <div className="md:col-span-2">
            <h1 className="text-6xl font-bold text-primary tracking-tighter mb-4 flex items-baseline gap-4">
              {project.name} <span className="text-gold text-3xl opacity-60">[{project.symbol}]</span>
            </h1>
            <p className="text-muted text-lg font-medium max-w-2xl leading-relaxed">
              Synthesizing real-time market dynamics for <span className="text-primary font-bold">{project.name}</span>. Currently operating within <span className="text-gold font-bold tracking-tight">{project.currentPhase} Epoch</span>.
            </p>
          </div>
          <div className="flex justify-end gap-12 border-l border-white/5 pl-12 h-full">
            <div className="text-right">
              <p className="text-xs text-gold font-bold uppercase tracking-[0.2em] mb-4 opacity-40">Maturity Phase</p>
              <div className="inline-block px-8 py-2 bg-gold text-background rounded-full font-bold uppercase tracking-widest text-xs shadow-gold-glow">{project.currentPhase}</div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gold font-bold uppercase tracking-[0.2em] mb-4 opacity-40">Network Stability (MSS)</p>
              <p className="text-5xl font-bold text-primary tracking-tighter shadow-gold-glow-large animate-gold-pulse">{project.mssValue}<span className="text-xl text-gold/40">/100</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="flex gap-10 border-b border-white/5 mb-12 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Mandate Overview', icon: Activity },
            { id: 'graph', label: 'Stability Visualization', icon: LineChart },
            { id: 'liquidity', label: 'Liquidity Vault', icon: Lock },
            { id: 'params', label: 'Adaptive Constants', icon: Zap },
            { id: 'agents', label: 'Neural Logs', icon: TrendingUp },
            { id: 'txs', label: 'Transaction Stream', icon: TrendingUp },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`pb-6 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-4 relative whitespace-nowrap ${activeTab === tab.id ? 'text-gold' : 'text-muted/40 hover:text-muted'}`}>
              <tab.icon size={14} /> {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gold shadow-gold-glow" />}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="luxury-card p-10 bg-secondary/10 hover:border-gold/30 transition-all duration-500">
                <h3 className="text-xl font-bold text-primary mb-8 tracking-tight">Ecosystem Intelligence</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/[0.03]"><span className="text-xs text-muted uppercase font-bold tracking-widest">Temporal Signature</span><span className="font-mono text-sm text-gold font-bold">{project.tokenInfo.address}</span></div>
                  <div className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/[0.03]"><span className="text-xs text-muted uppercase font-bold tracking-widest">Consensus Supply</span><span className="font-bold text-primary text-xl tracking-tighter">{project.tokenInfo.totalSupply}</span></div>
                  <div className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/[0.03]"><span className="text-xs text-muted uppercase font-bold tracking-widest">Neural Participants</span><span className="font-bold text-primary text-xl tracking-tighter">{project.tokenInfo.holders.toLocaleString()}</span></div>
                </div>
              </div>
              <div className="luxury-card p-10 bg-secondary/10 hover:border-gold/30 transition-all duration-500">
                <h3 className="text-xl font-bold text-primary mb-8 tracking-tight">Epoch Summary</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/[0.03]"><span className="text-xs text-muted uppercase font-bold tracking-widest">Current Protocol</span><span className="font-bold text-gold uppercase tracking-[0.2em] text-xs">{project.currentPhase}</span></div>
                  <div className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/[0.03]"><span className="text-xs text-muted uppercase font-bold tracking-widest">Neural Stability Score</span><span className="font-bold text-primary text-2xl tracking-tighter">{project.mssValue}</span></div>
                  <div className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/[0.03]"><span className="text-xs text-muted uppercase font-bold tracking-widest">Last Intelligence Pulse</span><span className="text-sm font-bold text-primary/50">{project.lastAgentUpdateTime}</span></div>
                </div>
              </div>
            </div>
            <div className="luxury-card p-10 bg-gold/5 border-gold/10"><p className="text-primary/80 text-lg leading-relaxed tracking-wide">{project.phaseDescription}</p></div>
          </div>
        )}

        {activeTab === 'graph' && (
          <div className="luxury-card p-12 bg-secondary/20 h-[600px] animate-in fade-in duration-700 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 flex items-center gap-6">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gold shadow-gold-glow" /><span className="text-xs text-gold uppercase font-bold tracking-widest">Stability Index</span></div>
            </div>
            <MSSChart mss={project.mssValue} />
          </div>
        )}

        {activeTab === 'liquidity' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="luxury-card p-12 bg-secondary/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gold/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-2xl font-bold text-primary mb-10 tracking-tight">Liquidity Matrix</h3>
                <div className="space-y-10">
                  <div className="p-8 bg-black/40 rounded-3xl border border-white/[0.03]"><p className="text-xs text-muted uppercase font-bold tracking-[0.2em] mb-3 opacity-60">Consensus Locked</p><p className="text-4xl font-bold text-primary tracking-tighter">{project.liquidityInfo.totalLocked}</p></div>
                  <div className="p-8 bg-black/40 rounded-3xl border border-white/[0.03]"><p className="text-xs text-muted uppercase font-bold tracking-[0.2em] mb-3 opacity-60">Mandate Released</p><p className="text-4xl font-bold text-primary tracking-tighter">{project.liquidityInfo.totalReleased}</p></div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted uppercase font-bold tracking-[0.2em]">Operational Status</p>
                    <div className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-500 shadow-gold-glow-large ${project.liquidityInfo.frozen ? 'bg-status-danger/10 text-status-danger border-status-danger/40' : 'bg-status-success/10 text-status-success border-status-success/40'}`}>
                      {project.liquidityInfo.frozen ? 'Suspended' : 'Operational'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="luxury-card p-12 bg-secondary/20">
                <h3 className="text-2xl font-bold text-primary mb-10 tracking-tight">Release Matrix</h3>
                <div className="space-y-6">
                  {project.liquidityInfo.unlockSchedule.map((tranche) => (
                    <div key={tranche.tranche} className="p-6 bg-black/40 rounded-2xl border border-white/[0.03] flex justify-between items-center hover:border-gold/20 transition-all group">
                      <div><p className="text-xs font-bold text-gold uppercase tracking-[0.2em] mb-1">Tranche {tranche.tranche}</p><p className="text-xl font-bold text-primary tracking-tight">{tranche.amount}</p></div>
                      <div className="text-right">
                        <div className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest transition-all ${tranche.status === 'unlocked' ? 'bg-status-success/10 text-status-success border border-status-success/30' : 'bg-gold/[0.05] text-gold/40 border border-gold/10'}`}>{tranche.status}</div>
                        <p className="text-xs text-muted mt-2 uppercase font-bold tracking-widest opacity-40">MSS Threshold: {tranche.threshold}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'params' && (
          <div className="luxury-card p-12 bg-secondary/20 animate-in fade-in duration-700">
            <h3 className="text-3xl font-bold text-primary mb-12 tracking-tight">Active Computational Constants</h3>
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-10">
                <h4 className="text-xs text-gold font-bold uppercase tracking-[0.2em] mb-10 opacity-60">Adaptive Tax Matrix</h4>
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-10 bg-black/40 rounded-[2.5rem] border border-white/[0.03] text-center hover:border-gold/30 transition-all group"><p className="text-xs text-muted uppercase font-bold tracking-[0.2em] mb-4 opacity-40">Liquidication Tax</p><p className="text-5xl font-bold text-primary tracking-tighter group-hover:text-gold transition-colors">{project.adaptiveParams.currentSellTax}<span className="text-lg text-gold/40 font-normal">%</span></p></div>
                  <div className="p-10 bg-black/40 rounded-[2.5rem] border border-white/[0.03] text-center hover:border-gold/30 transition-all group"><p className="text-xs text-muted uppercase font-bold tracking-[0.2em] mb-4 opacity-40">Acquisition Tax</p><p className="text-5xl font-bold text-primary tracking-tighter group-hover:text-gold transition-colors">{project.adaptiveParams.currentBuyTax}<span className="text-lg text-gold/40 font-normal">%</span></p></div>
                </div>
                <div className="p-8 bg-gold/5 border border-gold/10 rounded-3xl"><div className="flex justify-between items-center"><span className="text-xs text-gold uppercase font-bold tracking-widest">Incentive Multiplier Pulse</span><span className="text-2xl font-bold text-gold font-mono">{project.adaptiveParams.incentiveMultiplier}x</span></div></div>
              </div>
              <div className="space-y-10">
                <h4 className="text-xs text-gold font-bold uppercase tracking-[0.2em] mb-10 opacity-60">Neural Safety Bounds</h4>
                <div className="space-y-6">
                  <div className="p-8 bg-black/40 rounded-3xl border border-white/[0.03]">
                    <div className="flex justify-between items-center mb-6"><p className="text-xs text-muted uppercase font-bold tracking-widest">Tax Boundary Range</p><span className="text-xs font-bold text-gold font-mono uppercase tracking-widest">Immutable</span></div>
                    <div className="flex items-center gap-6"><span className="text-2xl font-bold text-primary/40">{project.adaptiveParams.bounds.minTax}%</span><div className="flex-1 h-1.5 bg-white/5 rounded-full p-0.5"><div className="h-full bg-gold rounded-full shadow-gold-glow" style={{ width: '40%' }} /></div><span className="text-2xl font-bold text-primary">{project.adaptiveParams.bounds.maxTax}%</span></div>
                  </div>
                  <div className="p-8 bg-black/40 rounded-3xl border border-white/[0.03]">
                    <div className="flex justify-between items-center mb-6"><p className="text-xs text-muted uppercase font-bold tracking-widest">Transaction Volume Ceiling</p><span className="text-xs font-bold text-gold font-mono uppercase tracking-widest">Immutable</span></div>
                    <p className="text-2xl font-bold text-primary tracking-tighter font-mono">{project.adaptiveParams.bounds.minMaxTx} <span className="text-muted text-sm tracking-normal">---</span> {project.adaptiveParams.bounds.minMaxWallet}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="luxury-card p-12 bg-secondary/20 animate-in fade-in duration-700">
            <h3 className="text-3xl font-bold text-primary mb-12 tracking-tight">Neural Intelligence Stream</h3>
            <div className="space-y-6">
              {project.agentLogs.map((log, idx) => (
                <div key={idx} className="luxury-card p-8 bg-black/40 border-white/[0.03] hover:border-gold/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    <div className={`px-6 py-2 rounded-full text-xs font-bold tracking-[0.2em] border transition-all duration-500 uppercase ${log.verified ? 'bg-status-success/10 text-status-success border-status-success/40 shadow-status-success shadow-inner' : 'bg-status-danger/10 text-status-danger border-status-danger/40'}`}>{log.verified ? 'Verified Intelligence' : 'Corrupted Data'}</div>
                  </div>
                  <div className="mb-8"><h4 className="text-xl font-bold text-primary mb-2 tracking-tight group-hover:text-gold transition-colors">{log.agent}</h4><p className="text-xs text-muted uppercase font-bold tracking-[0.2em] opacity-40 font-mono">{log.timestamp}</p></div>
                  <p className="text-primary/80 text-lg leading-relaxed font-medium mb-10 max-w-3xl">{log.action}</p>
                  <div className="pt-8 border-t border-white/5 flex gap-12 items-center text-xs text-muted font-bold uppercase tracking-widest font-mono"><span>Block Height: <span className="text-primary">{log.block}</span></span><span>Neural Sig: <span className="text-gold">{log.signature}</span></span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'txs' && (
          <div className="luxury-card p-12 bg-secondary/20 animate-in fade-in duration-700">
            <h3 className="text-3xl font-bold text-primary mb-12 tracking-tight">Real-Time Participant Stream</h3>
            <div className="space-y-4">
              {project.transactions.map((tx, idx) => (
                <div key={idx} className={`luxury-card p-6 flex justify-between items-center transition-all duration-500 hover:scale-[1.01] ${tx.volumeSpike ? 'bg-status-warning/10 border-status-warning/40' : 'bg-black/40 border-white/5'}`}>
                  <div className="flex items-center gap-10">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border ${tx.type === 'buy' ? 'bg-status-success/10 text-status-success border-status-success/40 font-bold' : 'bg-status-danger/10 text-status-danger border-status-danger/40 font-bold'}`}>{tx.type === 'buy' ? '↑' : '↓'}</div>
                    <div>
                      <div className="flex items-center gap-4 mb-2"><span className={`text-xs font-bold uppercase tracking-[0.2em] ${tx.type === 'buy' ? 'text-status-success' : 'text-status-danger'}`}>{tx.type === 'buy' ? 'Neural Acquisition' : 'Mandate Liquidation'}</span>{tx.volumeSpike && <span className="text-xs bg-status-warning/20 text-status-warning px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-status-warning/20">Anomalous Spike</span>}</div>
                      <p className="text-primary font-mono text-sm font-bold opacity-60">{tx.address}</p>
                    </div>
                  </div>
                  <div className="text-right"><p className="text-2xl font-bold text-primary tracking-tighter mb-1">{tx.amount}</p><p className="text-xs font-bold text-gold font-mono tracking-widest">{tx.price}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
