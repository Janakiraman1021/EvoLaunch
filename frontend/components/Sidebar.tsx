'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Rocket, 
  Compass, 
  ShieldAlert, 
  Bot, 
  FileText, 
  Activity, 
  Settings, 
  LogOut,
  LayoutDashboard 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/launch', icon: Rocket, label: 'Launch' },
    { href: '/explore', icon: Compass, label: 'Explorer' },
    { href: '/reputation', icon: ShieldAlert, label: 'Reputation' },
    { href: '/agents', icon: Bot, label: 'Agents' },
    { href: '/docs', icon: FileText, label: 'Docs' },
    { href: '/system', icon: Activity, label: 'Network' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-6 glass-panel z-50 border-r border-gold/10">
      {/* Premium Logo Section */}
      <Link href="/" className="mb-6 relative group">
        <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 opacity-50" />
        <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-glow relative z-10 transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
          <Rocket className="text-[#0C0C0F]" size={20} />
        </div>
      </Link>

      {/* Navigation Nodes - Centered Vertically */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative flex flex-col items-center group transition-all duration-300"
            >
              <div 
                className={`relative p-3 rounded-xl transition-all duration-500 ${
                  isActive 
                  ? 'bg-gold/10 text-gold shadow-[inset_0_0_20px_rgba(230,192,123,0.1)] border border-gold/30' 
                  : 'text-muted/60 hover:text-gold hover:bg-gold/5 border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-gold rounded-full shadow-gold-glow animate-in slide-in-from-left duration-500" />
                )}
                <link.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="transition-transform duration-300 group-hover:scale-110" />
              </div>
              
              {/* Sidebar Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-secondary border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest opacity-0 scale-90 translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap shadow-luxury-soft">
                {link.label}
                {/* Tooltip Arrow */}
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-secondary border-l border-b border-gold/20 rotate-45" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Utility Actions */}
      <div className="flex flex-col items-center gap-6 w-full pt-6 border-t border-gold/[0.05]">
        <button className="text-muted/50 hover:text-gold hover:scale-110 transition-all duration-300 group relative" title="Settings">
          <Settings size={18} />
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-secondary border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest opacity-0 scale-90 translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap">
            Settings
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-secondary border-l border-b border-gold/20 rotate-45" />
          </div>
        </button>
        
        {/* Institutional Profile */}
        <div className="relative cursor-pointer group">
          <div className="absolute inset-0 bg-gold/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-10 h-10 rounded-full p-[1px] bg-gradient-to-b from-gold/40 to-transparent relative z-10 transition-transform duration-500 group-hover:scale-110">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden border border-black/50">
              <span className="text-[10px] font-bold text-gold tracking-tighter">EVO</span>
            </div>
          </div>
          {/* Active Status Dot */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-status-success rounded-full border-2 border-background z-20 shadow-status-success" />
          
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-secondary border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest opacity-0 scale-90 translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap">
            Institutional Profile
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-secondary border-l border-b border-gold/20 rotate-45" />
          </div>
        </div>
      </div>
    </nav>
  );
}
