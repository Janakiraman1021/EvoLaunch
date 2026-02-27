'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useWeb3 } from '../lib/hooks/useWeb3';
import { CONTRACT_ADDRESSES } from '../lib/contracts';
import { Wallet, Globe, Copy, Check } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { wallet, connectWallet, isConnecting, error, isConnected } = useWeb3();
  const [copied, setCopied] = React.useState(false);

  const getPageTitle = () => {
    if (pathname === '/') return 'Protocol Orchestra';
    if (pathname.includes('/launch')) return 'Deployment Terminal';
    if (pathname.includes('/explore')) return 'Neural Explorer';
    if (pathname.includes('/agents')) return 'Command Center';
    if (pathname.includes('/system')) return 'System Health';
    if (pathname.includes('/reputation')) return 'Reputation Matrix';
    if (pathname.includes('/docs')) return 'Protocol Reference';
    if (pathname.includes('/project')) return 'Asset Mandate';
    if (pathname.includes('/analytics')) return 'Data Synthesis';
    if (pathname.includes('/governance')) return 'Consensus Engine';
    return 'EvoLaunch';
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESSES.LAUNCH_FACTORY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="flex items-center justify-between mb-12 sticky top-0 z-30 py-6 px-1 border-b border-gold/10 bg-[var(--background)]/80 backdrop-blur-2xl overflow-hidden transition-colors duration-500">
      <div className="noise-overlay" />
      <div className="flex flex-col relative z-10">
        <h2 className="text-3xl font-bold text-primary tracking-tighter fade-in group cursor-default">
          {getPageTitle()}
          <span className="block h-0.5 w-0 group-hover:w-full bg-gold transition-all duration-700" />
        </h2>
        <p className="text-[10px] text-muted font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse shadow-gold-glow" />
          Ecosystem State: <span className="text-gold/80">Synchronized</span>
        </p>
      </div>

      <div className="flex items-center gap-8">
        {/* Persistent Factory Address Bar */}
        <div className="contract-bar" title="Launch Factory Address">
          <span className="opacity-40 uppercase tracking-widest shrink-0">Factory</span>
          <span className="address shrink-0">{CONTRACT_ADDRESSES.LAUNCH_FACTORY.slice(0, 6)}...{CONTRACT_ADDRESSES.LAUNCH_FACTORY.slice(-4)}</span>
          <button 
            onClick={copyAddress}
            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gold/40 hover:text-gold"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>

        {/* Network Indicator */}
        <div className="flex items-center gap-3 px-4 py-2 bg-secondary/40 border border-white/[0.05] rounded-xl">
          <div className="w-2 h-2 rounded-full bg-status-warning shadow-gold-glow animate-pulse" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
            <Globe size={12} className="text-muted" />
            {CONTRACT_ADDRESSES.CHAIN_NAME}
          </span>
        </div>

        {/* Wallet Connection */}
        <div className="relative group">
          {isConnected ? (
            <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.05] px-5 py-2 rounded-xl hover:border-gold/30 transition-all cursor-default">
              <div className="text-right">
                <p className="text-[9px] text-muted font-bold uppercase tracking-widest">Connected Wallet</p>
                <p className="text-xs font-mono text-gold font-bold">
                  {wallet?.address.slice(0, 6)}...{wallet?.address.slice(-4)}
                </p>
              </div>
              <div className="icon-box bg-gold/10 text-gold border-gold/20">
                <Wallet size={18} />
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="connect-btn group/btn"
            >
              <Wallet size={16} className="group-hover/btn:rotate-[10deg] transition-transform" />
              {isConnecting ? 'Authorizing...' : 'Connect Wallet'}
            </button>
          )}

          {error && !isConnected && (
            <div className="absolute top-full right-0 mt-4 px-4 py-2 bg-status-danger/10 border border-status-danger/20 rounded-lg text-status-danger text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2 whitespace-nowrap z-50">
              {error.includes('switch') ? 'Please Switch to BSC Testnet' : 'Verification Failed'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
