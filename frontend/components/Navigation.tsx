'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home', show: true },
    { href: '/landing', label: 'About', show: true },
    { href: '/launch', label: 'Launch Token', show: true },
    { href: '/explore', label: 'Explorer', show: true },
    { href: '/reputation', label: 'My Reputation', show: true },
    { href: '/agents', label: 'Agents', show: true },
    { href: '/docs', label: 'Docs', show: true },
    { href: '/system', label: 'System Status', show: true },
  ];

  return (
    <nav className="border-b border-forest/10 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-forest">
            EvoLaunch
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) =>
              link.show ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-forest/60 hover:text-forest transition font-medium text-sm"
                >
                  {link.label}
                </Link>
              ) : null
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-forest"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map((link) =>
              link.show ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-forest/60 hover:text-forest hover:bg-forest/5 rounded-lg transition"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ) : null
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
