'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  Cpu, 
  History, 
  Award,
  ExternalLink,
  ChevronRight,
  Fingerprint,
  Activity
} from 'lucide-react';

export default function ProfilePage() {
  const profileData = {
    address: '0x742d...44e',
    rank: 'Institutional Tier 1',
    reputation: 980,
    mandates: 12,
    successRate: '94%',
    verified: true
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pt-8 max-w-6xl mx-auto">
      {/* Premium Profile Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 luxury-card p-10 relative group">
          <div className="shine-sweep" />
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative">
              <div className="w-40 h-40 rounded-[2.5rem] bg-gold-gradient p-[1px] relative overflow-hidden">
                <div className="w-full h-full rounded-[2.5rem] bg-background flex items-center justify-center overflow-hidden border border-black/50 relative">
                   <div className="absolute inset-0 bg-gold/5 animate-pulse" />
                   <Fingerprint size={80} className="text-gold opacity-40" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-status-success p-2 rounded-xl shadow-gold-glow border-2 border-background">
                <ShieldCheck size={20} className="text-white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <h1 className="text-4xl font-bold text-primary tracking-tight">{profileData.rank}</h1>
                <div className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-xs font-bold text-gold uppercase tracking-widest">
                  Verified Entity
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 bg-[var(--primary-text)]/[0.03] w-fit px-4 py-2 rounded-xl border border-white/5">
                <Wallet size={14} className="text-gold" />
                <span className="text-sm font-mono text-muted">{profileData.address}</span>
                <ExternalLink size={14} className="text-muted/40 cursor-pointer hover:text-gold transition-colors" />
              </div>
              <p className="text-muted max-w-md leading-relaxed">
                Primary institutional mandate participant authorized for high-stability token launches and ecosystem governance.
              </p>
            </div>
          </div>
        </div>

        {/* Reputation Analytics Card */}
        <div className="luxury-card p-10 flex flex-col justify-between items-center text-center relative group overflow-hidden">
          <div className="shine-sweep" />
          <div className="absolute inset-0 bg-gold/5 blur-[80px] rounded-full scale-50 group-hover:scale-100 transition-transform duration-1000" />
          <div className="relative z-10 space-y-4">
            <Award size={40} className="text-gold mx-auto mb-2" />
            <div className="text-xs font-bold text-muted uppercase tracking-[0.2em]">Protocol Reputation</div>
            <div className="text-6xl font-black text-primary tracking-tighter shadow-gold-glow-text">
              {profileData.reputation}
            </div>
            <div className="text-xs font-bold text-status-success tracking-widest uppercase">Expert Tier</div>
          </div>
          <button className="w-full mt-6 py-3 rounded-xl bg-secondary border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-background transition-all duration-500">
            View Credentials
          </button>
        </div>
      </div>

      {/* Institutional Activity & Tranches */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Mandates Completed', value: profileData.mandates, icon: ShieldCheck, sub: 'All clusters' },
          { label: 'Success Velocity', value: profileData.successRate, icon: Activity, sub: 'Above average' },
          { label: 'Ecosystem Points', value: '42,900', icon: Cpu, sub: 'Convertible' },
        ].map((stat, i) => (
          <div key={i} className="luxury-card p-8 flex flex-col gap-6 group">
             <div className="flex items-center gap-4">
               <div className="icon-box-lg group-hover:scale-110 transition-transform">
                 <stat.icon size={24} className="text-gold" />
               </div>
               <div>
                 <div className="text-lg font-bold text-primary tracking-tight">{stat.value}</div>
                 <div className="text-xs text-muted font-bold uppercase tracking-widest">{stat.label}</div>
               </div>
             </div>
             <div className="h-[1px] w-full bg-white/5" />
             <div className="text-xs text-gold font-bold uppercase opacity-60 tracking-widest">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Transaction History / Detailed Trail */}
      <div className="luxury-card overflow-hidden">
        <div className="p-10 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3 tracking-tight">
              <History className="text-gold" size={24} /> Audit Trail History
            </h2>
            <p className="text-muted text-sm mt-1 uppercase tracking-widest text-xs font-bold">Transaction Ledger for 0x742d...44e</p>
          </div>
          <button className="text-gold text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
            Export Ledger <ChevronRight size={14} />
          </button>
        </div>
        <div className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary/[0.02] text-xs font-bold text-muted uppercase tracking-[0.15em]">
                <th className="px-10 py-5">Event Identifier</th>
                <th className="px-10 py-5">Mandate</th>
                <th className="px-10 py-5 text-right">Magnitude</th>
                <th className="px-10 py-5 text-right">Temporal State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { id: 'MND-3921-X', type: 'Liquidity Injection', amt: '+12.5 BNB', time: '2 hours ago' },
                { id: 'GOV-AF90-A', type: 'Governance Vote', amt: '1,200 POW', time: '5 hours ago' },
                { id: 'MND-3882-K', type: 'Tranche Unlock', amt: '+50,000 POW', time: '1 day ago' },
                { id: 'SYS-LOG-01', type: 'Reputation Gain', amt: '+25 REP', time: '3 days ago' },
                { id: 'SYS-LOG-02', type: 'Tier Upgrade', amt: 'TIER 1', time: '1 week ago' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gold/[0.02] transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-gold font-bold">{row.id}</span>
                      <span className="text-xs text-primary/40">{row.type}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-3 py-1 rounded-lg bg-secondary text-muted text-xs font-bold border border-primary/5 uppercase tracking-widest group-hover:border-gold/30 transition-all">Alpha Cluster</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className="text-sm font-bold text-primary tracking-tight">{row.amt}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className="text-xs text-muted/60">{row.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
