'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Rocket,
  Compass,
  ShieldAlert,
  Bot,
  FileText,
  Activity,
  Sun,
  Moon,
  User,
  BarChart3,
  LayoutDashboard,
  Copy,
  Settings,
  LogOut
} from 'lucide-react';
import api from '../lib/api';

export default function Sidebar() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [copied, setCopied] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');

  const mockProfile = {
    name: 'Institutional Node',
    address: '0x7D02fD90716722221277D8CA750B3611Ca51dAB9',
    reputation: 85,
    totalValue: '125.3 BNB',
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setTokenAddress(api.getTokenAddress());
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mockProfile.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const links = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/launch', icon: Rocket, label: 'Launch' },
    { href: '/explore', icon: Compass, label: 'Explorer' },
    ...(tokenAddress ? [{ href: `/project/${tokenAddress}`, icon: Activity, label: 'Terminal' }] : []),
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/reputation', icon: ShieldAlert, label: 'Reputation' },
    { href: '/agents', icon: Bot, label: 'Agents' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/docs', icon: FileText, label: 'Docs' },
    { href: '/system', icon: Activity, label: 'Network' },
  ];

  const getScaleClass = (index: number) => {
    if (hoveredIndex === null) return 'scale-100';
    if (hoveredIndex === index) return 'scale-125 z-20';
    if (Math.abs(hoveredIndex - index) === 1) return 'scale-90';
    return 'scale-95';
  };

  return (
    <nav className="fixed flex flex-col items-center py-8 glass-panel z-50 floating-sidebar transition-colors duration-500 shadow-2xl">
      <div className="noise-overlay" />

      {/* Premium Logo Section */}
      <Link href="/" className="mb-6 relative group">
        <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 opacity-50" />
        <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-glow relative z-10 transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
          <Rocket className="text-[#0C0C0F]" size={20} />
        </div>
      </Link>

      {/* Structural Highlight */}
      <div className="absolute left-1/2 -translate-x-1/2 top-20 bottom-20 w-[1px] bg-gradient-to-b from-transparent via-gold/10 to-transparent pointer-events-none" />

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1.5 relative z-10 w-full px-2" onMouseLeave={() => setHoveredIndex(null)}>
        {links.map((link, index) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredIndex(index)}
              className={`relative flex flex-col items-center group transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${getScaleClass(index)}`}
            >
              <div
                className={`sidebar-icon ${isActive
                    ? 'text-gold bg-gold/5 border-gold/30 shadow-[0_0_20px_rgba(230,192,123,0.1)]'
                    : 'hover:text-gold hover:border-gold/20'
                  }`}
              >
                {isActive && (
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-gold rounded-full shadow-gold-glow animate-in slide-in-from-left duration-500" />
                )}
                <link.icon size={16} strokeWidth={isActive ? 2.5 : 2} className="transition-transform duration-300" />
              </div>

              {/* Sidebar Tooltip */}
              <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-secondary border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest opacity-0 scale-90 translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap shadow-luxury-soft">
                {link.label}
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-secondary border-l border-b border-gold/20 rotate-45" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Utility Actions */}
      <div className="flex flex-col items-center gap-4 w-full pt-6 border-t border-gold/[0.05]">
        <button
          onClick={toggleTheme}
          className="text-muted hover:text-gold hover:scale-110 transition-all duration-300 group relative"
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-secondary border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest opacity-0 scale-90 translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap shadow-luxury-soft">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-secondary border-l border-b border-gold/20 rotate-45" />
          </div>
        </button>

        {/* Institutional Profile */}
        <Link href="/profile" className="relative cursor-pointer group">
          <div className="absolute inset-0 bg-gold/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-9 h-9 rounded-full p-[1px] bg-gradient-to-b from-gold/40 to-transparent relative z-10 transition-transform duration-500 group-hover:scale-110">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden border border-black/50">
              <span className="text-[10px] font-bold text-gold tracking-tighter">EVO</span>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-status-success rounded-full border border-background z-20 shadow-status-success" />

          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-secondary border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest opacity-0 scale-90 translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap shadow-luxury-soft">
            Institutional Profile
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-secondary border-l border-b border-gold/20 rotate-45" />
          </div>
        </Link>
      </div>
    </nav>
  );
}
