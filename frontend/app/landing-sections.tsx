import React from 'react';
import Link from 'next/link';
import { ArrowRight, Users, Bot, BarChart2, Lock, ShieldCheck, Cpu, BookOpen, Github, FileText, Link2, Globe, TrendingUp, Zap, UserCheck, Network, Layers, CheckCircle, Target, Activity } from 'lucide-react';

// 1️⃣ Hero Section
export function HeroSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-background flex flex-col items-center text-center px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-primary mb-6">
          Launch Human Tokens.<br />
          Launch Autonomous AI Economies.
        </h1>
        <p className="text-muted text-lg md:text-xl mb-10 font-medium">
          Adaptive token launchpad + AI agent capital infrastructure on BNB Chain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/launch/human" className="btn-primary flex items-center gap-2 px-6 py-3 text-base font-bold">
            <UserCheck className="w-5 h-5" /> Launch Token (Human Mode)
          </Link>
          <Link href="/launch/ai" className="btn-primary flex items-center gap-2 px-6 py-3 text-base font-bold">
            <Bot className="w-5 h-5" /> Launch AI Agent (AI Mode)
          </Link>
          <Link href="/explore" className="btn-secondary flex items-center gap-2 px-6 py-3 text-base font-bold">
            <Globe className="w-5 h-5" /> Explore Live Ecosystem
          </Link>
        </div>
      </div>
    </section>
  );
}

// 2️⃣ Dual Mode Architecture Section
export function DualModeSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-secondary/40 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Human Launchpad */}
        <div className="bg-background rounded-2xl p-8 shadow-gold-glow border border-gold/10 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-gold w-6 h-6" />
            <span className="text-lg font-bold text-primary">Human Adaptive Launchpad</span>
          </div>
          <ul className="text-muted text-base space-y-2 pl-2">
            <li className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-gold" /> Progressive Liquidity Unlock</li>
            <li className="flex items-center gap-2"><Activity className="w-4 h-4 text-gold" /> Phase-based Evolution</li>
            <li className="flex items-center gap-2"><BarChart2 className="w-4 h-4 text-gold" /> Market Stability Score</li>
            <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-gold" /> Anti-dump Logic</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold" /> Governance Bounds</li>
          </ul>
        </div>
        {/* AI Launchpad */}
        <div className="bg-background rounded-2xl p-8 shadow-gold-glow border border-gold/10 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="text-gold w-6 h-6" />
            <span className="text-lg font-bold text-primary">AI Agent Launchpad</span>
          </div>
          <ul className="text-muted text-base space-y-2 pl-2">
            <li className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-gold" /> Trading Agents</li>
            <li className="flex items-center gap-2"><BarChart2 className="w-4 h-4 text-gold" /> Yield Agents</li>
            <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-gold" /> Arbitrage Agents</li>
            <li className="flex items-center gap-2"><Link2 className="w-4 h-4 text-gold" /> Data Monetization Agents</li>
            <li className="flex items-center gap-2"><Target className="w-4 h-4 text-gold" /> Programmable Strategy Agents</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// 3️⃣ How It Works Section
export function HowItWorksSection() {
  return (
    <section className="w-full py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Human Flow */}
        <div className="bg-secondary/60 rounded-2xl p-8 flex flex-col gap-4 border border-gold/10">
          <h3 className="text-lg font-bold text-gold mb-2 flex items-center gap-2"><UserCheck className="w-5 h-5" /> For Humans</h3>
          <ol className="list-decimal list-inside text-muted text-base space-y-2 pl-2">
            <li>Deploy adaptive token</li>
            <li>Liquidity locked</li>
            <li>AI monitors market</li>
            <li>Token evolves dynamically</li>
          </ol>
        </div>
        {/* AI Flow */}
        <div className="bg-secondary/60 rounded-2xl p-8 flex flex-col gap-4 border border-gold/10">
          <h3 className="text-lg font-bold text-gold mb-2 flex items-center gap-2"><Cpu className="w-5 h-5" /> For AI Agents</h3>
          <ol className="list-decimal list-inside text-muted text-base space-y-2 pl-2">
            <li>Launch agent</li>
            <li>Treasury funded</li>
            <li>Strategy executes</li>
            <li>Revenue distributed</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

// 4️⃣ Live System Stats Section
export function LiveStatsSection({ stats }: { stats: any }) {
  return (
    <section className="w-full py-16 md:py-24 bg-secondary/40 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
        <div className="bg-background rounded-2xl p-8 border border-gold/10 shadow-gold-glow flex flex-col items-center gap-2">
          <Users className="text-gold w-7 h-7 mb-2" />
          <div className="text-2xl font-bold text-primary">{stats.humanTokens}</div>
          <div className="text-xs text-muted uppercase tracking-widest font-bold">Human Tokens Launched</div>
        </div>
        <div className="bg-background rounded-2xl p-8 border border-gold/10 shadow-gold-glow flex flex-col items-center gap-2">
          <Cpu className="text-gold w-7 h-7 mb-2" />
          <div className="text-2xl font-bold text-primary">{stats.aiAgents}</div>
          <div className="text-xs text-muted uppercase tracking-widest font-bold">AI Agents Live</div>
        </div>
        <div className="bg-background rounded-2xl p-8 border border-gold/10 shadow-gold-glow flex flex-col items-center gap-2">
          <BarChart2 className="text-gold w-7 h-7 mb-2" />
          <div className="text-2xl font-bold text-primary">{stats.capitalManaged}</div>
          <div className="text-xs text-muted uppercase tracking-widest font-bold">Total Capital Managed</div>
        </div>
        <div className="bg-background rounded-2xl p-8 border border-gold/10 shadow-gold-glow flex flex-col items-center gap-2">
          <Zap className="text-gold w-7 h-7 mb-2" />
          <div className="text-2xl font-bold text-primary">{stats.revenueDistributed}</div>
          <div className="text-xs text-muted uppercase tracking-widest font-bold">Revenue Distributed</div>
        </div>
        <div className="bg-background rounded-2xl p-8 border border-gold/10 shadow-gold-glow flex flex-col items-center gap-2">
          <Activity className="text-gold w-7 h-7 mb-2" />
          <div className="text-2xl font-bold text-primary">{stats.mssAvg}</div>
          <div className="text-xs text-muted uppercase tracking-widest font-bold">Current MSS Average</div>
        </div>
        <div className="bg-background rounded-2xl p-8 border border-gold/10 shadow-gold-glow flex flex-col items-center gap-2">
          <Network className="text-gold w-7 h-7 mb-2" />
          <div className="text-2xl font-bold text-primary">{stats.bnbStatus}</div>
          <div className="text-xs text-muted uppercase tracking-widest font-bold">BNB Network Status</div>
        </div>
      </div>
    </section>
  );
}

// 5️⃣ Infrastructure Layer Section
export function InfrastructureSection() {
  return (
    <section className="w-full py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto bg-secondary/60 rounded-2xl p-10 border border-gold/10 shadow-gold-glow">
        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3"><Layers className="text-gold w-7 h-7" /> Infrastructure Layer</h2>
        <ul className="text-muted text-base space-y-2 pl-2">
          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold" /> BNB Smart Chain</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold" /> PancakeSwap Integration</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold" /> Risk-controlled Treasury</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold" /> On-chain Accounting</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold" /> Cryptographic Validation</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold" /> AI Decision Engine</li>
        </ul>
      </div>
    </section>
  );
}

// 6️⃣ Security & Risk Section
export function SecuritySection() {
  return (
    <section className="w-full py-16 md:py-24 bg-secondary/40 px-4">
      <div className="max-w-4xl mx-auto bg-background rounded-2xl p-10 border border-gold/10 shadow-gold-glow">
        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3"><Lock className="text-gold w-7 h-7" /> Security & Risk</h2>
        <ul className="text-muted text-base space-y-2 pl-2">
          <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold" /> Treasury cannot be drained</li>
          <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold" /> RiskController enforces bounds</li>
          <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold" /> Governance freeze exists</li>
          <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold" /> No hidden admin keys</li>
          <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold" /> All performance logged on-chain</li>
        </ul>
      </div>
    </section>
  );
}

// 7️⃣ Ecosystem Vision Section
export function VisionSection() {
  return (
    <section className="w-full py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto bg-secondary/60 rounded-2xl p-10 border border-gold/10 shadow-gold-glow">
        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3"><Zap className="text-gold w-7 h-7" /> Ecosystem Vision</h2>
        <p className="text-muted text-base mb-4">From token economies to autonomous AI economies.</p>
        <ul className="text-muted text-base space-y-2 pl-2">
          <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-gold" /> AI strategy marketplace</li>
          <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-gold" /> Cross-chain agents</li>
          <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-gold" /> DAO-controlled agents</li>
          <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-gold" /> Institutional agent pools</li>
        </ul>
      </div>
    </section>
  );
}

// 8️⃣ Footer Section
export function FooterSection() {
  return (
    <footer className="w-full py-10 bg-background border-t border-gold/10 mt-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className="flex flex-col gap-2 text-muted text-xs">
          <span>© {new Date().getFullYear()} EvoLaunch Protocol</span>
          <span>Built for BNB Chain Hackathon</span>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Link href="/docs" className="flex items-center gap-1 text-gold font-bold text-xs hover:underline"><BookOpen className="w-4 h-4" /> Docs</Link>
          <a href="https://github.com/Janakiraman1021/EvoLaunch" target="_blank" rel="noopener" className="flex items-center gap-1 text-gold font-bold text-xs hover:underline"><Github className="w-4 h-4" /> GitHub</a>
          <a href="/contracts/deployment-addresses.json" target="_blank" rel="noopener" className="flex items-center gap-1 text-gold font-bold text-xs hover:underline"><Link2 className="w-4 h-4" /> Smart Contracts</a>
          <a href="https://bscscan.com/address/0x..." target="_blank" rel="noopener" className="flex items-center gap-1 text-gold font-bold text-xs hover:underline"><Network className="w-4 h-4" /> BNB Explorer</a>
          <a href="/whitepaper.pdf" target="_blank" rel="noopener" className="flex items-center gap-1 text-gold font-bold text-xs hover:underline"><FileText className="w-4 h-4" /> Whitepaper</a>
        </div>
      </div>
    </footer>
  );
}

// Dashboard Redirect Icon (fixed, bottom right)
export function DashboardRedirect() {
  return (
    <Link href="/dashboard" className="fixed bottom-6 right-6 z-50 bg-gold text-[#0C0C0F] rounded-full shadow-gold-glow p-4 flex items-center justify-center hover:scale-110 transition-transform" title="Go to Dashboard">
      <BarChart2 className="w-7 h-7" />
    </Link>
  );
}
