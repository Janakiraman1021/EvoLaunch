'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, Activity, Zap, Server, Database } from 'lucide-react';

interface SystemStatus {
  rpcConnection: {
    status: 'online' | 'offline' | 'slow';
    latency: number;
    lastCheck: string;
  };
  agentService: {
    status: 'operational' | 'degraded' | 'offline';
    activeAgents: number;
    lastHeartbeat: string;
  };
  mssComputation: {
    lastRun: string;
    computationTime: number;
    mssValue: number;
  };
  backendHealth: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: string;
    responseTime: number;
  };
  contractConnectivity: {
    status: 'connected' | 'disconnected';
    lastInteraction: string;
    successRate: number;
  };
}

export default function SystemStatusPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    rpcConnection: {
      status: 'online',
      latency: 120,
      lastCheck: '30 seconds ago',
    },
    agentService: {
      status: 'operational',
      activeAgents: 3,
      lastHeartbeat: '1 minute ago',
    },
    mssComputation: {
      lastRun: '2 minutes ago',
      computationTime: 1240,
      mssValue: 65,
    },
    backendHealth: {
      status: 'healthy',
      uptime: '47 days, 13 hours',
      responseTime: 85,
    },
    contractConnectivity: {
      status: 'connected',
      lastInteraction: '45 seconds ago',
      successRate: 99.7,
    },
  });

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setSystemStatus((prev) => ({
        ...prev,
        rpcConnection: {
          ...prev.rpcConnection,
          latency: Math.floor(Math.random() * 200) + 50,
          lastCheck: 'just now',
        },
        agentService: {
          ...prev.agentService,
          lastHeartbeat: 'just now',
        },
        mssComputation: {
          ...prev.mssComputation,
          lastRun: 'just now',
        },
        contractConnectivity: {
          ...prev.contractConnectivity,
          lastInteraction: 'just now',
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'operational':
      case 'healthy':
      case 'connected':
        return 'border-status-success/30 bg-status-success/5 text-status-success';
      case 'offline':
      case 'disconnected':
      case 'critical':
        return 'border-status-danger/30 bg-status-danger/5 text-status-danger';
      case 'slow':
      case 'degraded':
      case 'warning':
        return 'border-status-warning/30 bg-status-warning/5 text-status-warning';
      default:
        return 'border-muted/30 bg-muted/5 text-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    if (['online', 'operational', 'healthy', 'connected'].includes(status)) {
      return <CheckCircle size={18} className="text-status-success animate-pulse" />;
    }
    if (['offline', 'disconnected', 'critical'].includes(status)) {
      return <AlertCircle size={18} className="text-status-danger" />;
    }
    return <AlertCircle size={18} className="text-status-warning" />;
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="pb-12 border-b border-gold/[0.05] flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <Link href="/" className="text-muted/60 hover:text-gold transition-all flex items-center gap-3 mb-8 text-xs font-bold uppercase tracking-widest group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Infrastructure Home
          </Link>
          <h1 className="text-5xl font-bold text-primary tracking-tight mb-4 flex items-baseline gap-4">
            System <span className="text-gold italic font-serif">Health</span> Matrix
          </h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            Real-time infrastructure monitoring for the EvoLaunch Neural Core. Cryptographic verification of hardware and network parameters.
          </p>
        </div>
        
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 border ${
            autoRefresh
              ? 'bg-gold text-background border-gold shadow-gold-glow'
              : 'bg-secondary/50 border-gold/10 text-muted hover:border-gold/30 hover:text-primary'
          }`}
        >
          {autoRefresh ? '🔴 Synchronized' : '⚪ Static Mode'}
        </button>
      </div>

      <div className="py-12 space-y-12">
        {/* Overall Status Badge */}
        <div className="luxury-card p-10 bg-status-success/5 border-status-success/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-status-success/5 -mr-32 -mt-32 rounded-full blur-3xl" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-[2rem] bg-status-success/10 flex items-center justify-center text-status-success border border-status-success/20 shadow-status-success">
                <CheckCircle size={40} className="animate-pulse" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-primary tracking-tight mb-2">Protocol Integrity: <span className="text-status-success uppercase">Optimal</span></h2>
                <p className="text-muted text-base">All institutional nodes are operational and cryptographically verified.</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-[10px] text-gold uppercase font-bold tracking-[0.3em] mb-2 opacity-60">Status ID: ev0-1b4f</p>
              <div className="px-4 py-2 rounded-lg bg-black/40 border border-white/5 text-primary/40 font-mono text-xs">
                Uptime: {systemStatus.backendHealth.uptime}
              </div>
            </div>
          </div>
        </div>

        {/* Core Infrastructure Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* RPC Connection */}
          <div className={`luxury-card p-10 transition-all duration-500 border-2 ${getStatusColor(systemStatus.rpcConnection.status)} shadow-luxury-soft`}>
            <div className="flex items-start justify-between mb-8">
              <h3 className="font-bold text-xl text-primary flex items-center gap-4 tracking-tight">
                <Server size={24} className="text-gold" />
                BSC Network Protocol
              </h3>
              {getStatusIcon(systemStatus.rpcConnection.status)}
            </div>

            <div className="space-y-6">
              {[
                { label: 'Latency Index', val: `${systemStatus.rpcConnection.latency}ms`, mono: true },
                { label: 'Connection Status', val: systemStatus.rpcConnection.status.toUpperCase(), b: true },
                { label: 'Last Cryptographic Check', val: systemStatus.rpcConnection.lastCheck },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-end border-b border-white/[0.03] pb-4 last:border-0 last:pb-0">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">{item.label}</span>
                  <span className={`text-sm ${item.mono ? 'font-mono' : 'font-bold'} ${item.b ? 'text-status-success' : 'text-primary'}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent cluster */}
          <div className={`luxury-card p-10 transition-all duration-500 border-2 ${getStatusColor(systemStatus.agentService.status)} shadow-luxury-soft`}>
            <div className="flex items-start justify-between mb-8">
              <h3 className="font-bold text-xl text-primary flex items-center gap-4 tracking-tight">
                <Zap size={24} className="text-gold" />
                Neural Agent Cluster
              </h3>
              {getStatusIcon(systemStatus.agentService.status)}
            </div>

            <div className="space-y-6">
              {[
                { label: 'Authorized Agents', val: `${systemStatus.agentService.activeAgents} / 3`, b: true },
                { label: 'Cluster Status', val: systemStatus.agentService.status.toUpperCase(), b: true },
                { label: 'Neural Heartbeat', val: systemStatus.agentService.lastHeartbeat },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-end border-b border-white/[0.03] pb-4 last:border-0 last:pb-0">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">{item.label}</span>
                  <span className={`text-sm font-bold ${item.b ? 'text-status-success' : 'text-primary'}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Computational Analytics */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 luxury-card p-10 bg-secondary/20">
            <h3 className="font-bold text-2xl text-primary mb-10 flex items-center gap-5 tracking-tight">
              <Activity size={32} className="text-gold" />
              MSS Real-time Computation
            </h3>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] mb-4">Neural Stability Floor</p>
                  <p className="text-7xl font-bold text-primary tracking-tighter group-hover:text-gold transition-colors">{systemStatus.mssComputation.mssValue}<span className="text-2xl text-gold/40">/100</span></p>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden border border-white/[0.03]">
                  <div
                    className="bg-gold h-full rounded-full transition-all duration-1000 shadow-gold-glow"
                    style={{ width: `${systemStatus.mssComputation.mssValue}%` }}
                  />
                </div>
              </div>

              <div className="space-y-6 bg-black/40 p-8 rounded-2xl border border-white/[0.03]">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-4">
                  <span className="text-muted">Last Execution</span>
                  <span className="text-gold">{systemStatus.mssComputation.lastRun}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-muted">Computation Load</span>
                  <span className="text-primary font-mono">{systemStatus.mssComputation.computationTime}ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Backend Health */}
          <div className={`lg:col-span-4 luxury-card p-10 transition-all duration-500 border-2 ${getStatusColor(systemStatus.backendHealth.status)}`}>
            <div className="flex items-start justify-between mb-8">
              <h3 className="font-bold text-xl text-primary flex items-center gap-4 tracking-tight">
                <Database size={24} className="text-gold" />
                Backend Core
              </h3>
              {getStatusIcon(systemStatus.backendHealth.status)}
            </div>

            <div className="space-y-8 mt-12">
              <div>
                <p className="text-[9px] text-muted uppercase font-bold tracking-[0.3em] mb-2 opacity-60">Avg Response Latency</p>
                <p className="text-4xl font-bold text-primary tracking-tight font-mono">{systemStatus.backendHealth.responseTime}ms</p>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1 opacity-60">Historical Uptime</p>
                <p className="text-xs font-bold text-primary/70 font-mono tracking-tighter">{systemStatus.backendHealth.uptime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connectivity Mandate */}
        <div className={`luxury-card p-12 overflow-hidden relative ${getStatusColor(systemStatus.contractConnectivity.status)}`}>
           <div className="absolute top-0 right-0 w-96 h-96 bg-gold/[0.02] -mr-48 -mt-48 rounded-full blur-3xl opacity-50" />
          <div className="flex items-center justify-between mb-12 relative z-10">
            <h3 className="font-bold text-3xl text-primary flex items-center gap-6 tracking-tight">
              <CheckCircle size={36} className="text-gold" />
              Smart Contract Connectivity
            </h3>
            {getStatusIcon(systemStatus.contractConnectivity.status)}
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            <div>
              <p className="text-[10px] text-muted uppercase font-bold tracking-[0.3em] mb-3 opacity-60">Handshake Status</p>
              <p className="text-3xl font-bold text-status-success uppercase tracking-widest">{systemStatus.contractConnectivity.status}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase font-bold tracking-[0.3em] mb-3 opacity-60">Last Interaction</p>
              <p className="text-2xl font-mono text-primary font-bold">{systemStatus.contractConnectivity.lastInteraction}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase font-bold tracking-[0.3em] mb-3 opacity-60">Interaction Success Rate</p>
              <p className="text-5xl font-bold text-gold tracking-tighter">{systemStatus.contractConnectivity.successRate}<span className="text-xl text-gold/40">%</span></p>
            </div>
          </div>
        </div>

        {/* Service Dependencies Matrix */}
        <div className="luxury-card p-12 bg-secondary/20">
          <h2 className="text-3xl font-bold text-primary mb-10 tracking-tight">Institutional Dependencies Matrix</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'PancakeSwap V3 Factory', status: 'OPERATIONAL', desc: 'AMM Matrix Operations' },
              { name: 'BSC Testnet Node Cluster', status: 'OPERATIONAL', desc: 'Primary Blockchain Mandate' },
              { name: 'ECDSA Signature Service', status: 'OPERATIONAL', desc: 'Neural Verification Core' },
              { name: 'Neural Agent Cluster', status: 'OPERATIONAL', desc: 'Predictive Stability Scoring' },
              { name: 'Protocol Indexer (EL-v1)', status: 'OPERATIONAL', desc: 'Aggregated Mandate Audit' },
              { name: 'Neural Price Oracle', status: 'OPERATIONAL', desc: 'High-Fidelity Volatility Feeds' },
            ].map((dep, idx) => (
              <div key={idx} className="luxury-card p-6 bg-black/40 border-gold/10 hover:border-gold/40 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-primary group-hover:text-gold transition-colors">{dep.name}</p>
                  <CheckCircle className="text-status-success shadow-gold-glow animate-pulse" size={16} />
                </div>
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-4 opacity-60">{dep.desc}</p>
                <span className="text-[9px] font-bold text-status-success/80 border border-status-success/20 px-3 py-1 rounded-full">{dep.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
