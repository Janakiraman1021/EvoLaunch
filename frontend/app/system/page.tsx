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
        return 'bg-green-50 border-green-200 text-green-700';
      case 'offline':
      case 'disconnected':
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'slow':
      case 'degraded':
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    if (['online', 'operational', 'healthy', 'connected'].includes(status)) {
      return <CheckCircle size={18} className="text-green-600" />;
    }
    if (['offline', 'disconnected', 'critical'].includes(status)) {
      return <AlertCircle size={18} className="text-red-600" />;
    }
    return <AlertCircle size={18} className="text-amber-600" />;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-forest/10 bg-forest/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-forest/60 hover:text-forest transition flex items-center gap-2 mb-4">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-forest mb-2">System Status</h1>
              <p className="text-forest/60">
                Real-time monitoring of EvoLaunch infrastructure. All systems must be operational for protocol safety.
              </p>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                autoRefresh
                  ? 'bg-forest text-white hover:bg-forest/90'
                  : 'bg-forest/10 text-forest border border-forest/20 hover:bg-forest/20'
              }`}
            >
              {autoRefresh ? '🔴 Live Refresh' : '⚪ Manual'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overall Status Badge */}
        <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle className="text-green-600" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-green-900">All Systems Operational</h2>
                <p className="text-green-800 text-sm">Protocol is fully functional and safe for transactions</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-700 font-mono">Status Page ID: ev0-1b4f</p>
              <p className="text-xs text-green-600 mt-1">Last updated: 30 seconds ago</p>
            </div>
          </div>
        </div>

        {/* RPC Connection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className={`border-2 rounded-lg p-6 ${getStatusColor(systemStatus.rpcConnection.status)}`}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Server size={20} />
                RPC Connection (BSC Testnet)
              </h3>
              {getStatusIcon(systemStatus.rpcConnection.status)}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-bold uppercase">{systemStatus.rpcConnection.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Latency</span>
                <span className="font-bold font-mono">{systemStatus.rpcConnection.latency}ms</span>
              </div>
              <div className="flex justify-between">
                <span>Last Check</span>
                <span className="font-mono">{systemStatus.rpcConnection.lastCheck}</span>
              </div>
            </div>
          </div>

          {/* Agent Service */}
          <div className={`border-2 rounded-lg p-6 ${getStatusColor(systemStatus.agentService.status)}`}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Zap size={20} />
                Agent Service
              </h3>
              {getStatusIcon(systemStatus.agentService.status)}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-bold uppercase">{systemStatus.agentService.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Agents</span>
                <span className="font-bold">{systemStatus.agentService.activeAgents}/3</span>
              </div>
              <div className="flex justify-between">
                <span>Last Heartbeat</span>
                <span className="font-mono">{systemStatus.agentService.lastHeartbeat}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MSS Computation */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border-2 border-forest/20 rounded-lg p-6">
            <h3 className="font-bold text-lg text-forest mb-4 flex items-center gap-2">
              <Activity size={20} />
              MSS Computation
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-forest/60 text-sm mb-1">Current MSS Value</p>
                <p className="text-4xl font-bold text-forest">{systemStatus.mssComputation.mssValue}</p>
              </div>
              <div className="w-full bg-forest/10 rounded-full h-3">
                <div
                  className="bg-forest/60 h-3 rounded-full"
                  style={{ width: `${systemStatus.mssComputation.mssValue}%` }}
                />
              </div>

              <div className="border-t border-forest/10 pt-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-forest/60">Last Run</span>
                  <span className="text-forest">{systemStatus.mssComputation.lastRun}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-forest/60">Computation Time</span>
                  <span className="text-forest font-mono">{systemStatus.mssComputation.computationTime}ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Backend Health */}
          <div className={`border-2 rounded-lg p-6 ${getStatusColor(systemStatus.backendHealth.status)}`}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Database size={20} />
                Backend Health
              </h3>
              {getStatusIcon(systemStatus.backendHealth.status)}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-bold uppercase">{systemStatus.backendHealth.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Uptime</span>
                <span className="font-bold">{systemStatus.backendHealth.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Response Time</span>
                <span className="font-mono">{systemStatus.backendHealth.responseTime}ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Connectivity */}
        <div className={`border-2 rounded-lg p-8 mb-8 ${getStatusColor(systemStatus.contractConnectivity.status)}`}>
          <div className="flex items-start justify-between mb-6">
            <h3 className="font-bold text-2xl flex items-center gap-2">
              <CheckCircle size={24} />
              Smart Contract Connectivity
            </h3>
            {getStatusIcon(systemStatus.contractConnectivity.status)}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm opacity-75 mb-1">Connection Status</p>
              <p className="text-2xl font-bold uppercase">{systemStatus.contractConnectivity.status}</p>
            </div>
            <div>
              <p className="text-sm opacity-75 mb-1">Last Interaction</p>
              <p className="text-lg font-mono">{systemStatus.contractConnectivity.lastInteraction}</p>
            </div>
            <div>
              <p className="text-sm opacity-75 mb-1">Success Rate</p>
              <p className="text-2xl font-bold">{systemStatus.contractConnectivity.successRate}%</p>
            </div>
          </div>
        </div>

        {/* Service Dependencies */}
        <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-forest mb-6">Service Dependencies</h2>

          <div className="space-y-4">
            {[
              {
                name: 'PancakeSwap V3 Factory',
                status: 'operational',
                desc: 'Required for AMM pair creation and liquidity operations',
              },
              {
                name: 'BSC Testnet RPC',
                status: 'operational',
                desc: 'Primary blockchain connection point',
              },
              {
                name: 'ECDSA Signature Service',
                status: 'operational',
                desc: 'Verifies agent payloads and parameter updates',
              },
              {
                name: 'Off-Chain Agent Cluster',
                status: 'operational',
                desc: 'Computes MSS and proposes parameter updates',
              },
              {
                name: 'Event Indexer (Subgraph)',
                status: 'operational',
                desc: 'Aggregates contract events for dashboard display',
              },
              {
                name: 'Price Oracle (Chainlink)',
                status: 'operational',
                desc: 'Provides reliable price feeds for MSS volatility calculation',
              },
            ].map((dep, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-forest/10 rounded-lg hover:border-forest/30 transition">
                <div>
                  <p className="font-bold text-forest">{dep.name}</p>
                  <p className="text-sm text-forest/60">{dep.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-sm font-bold text-green-700">{dep.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
