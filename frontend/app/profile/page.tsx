'use client';

import { useState } from 'react';
import { Copy, LogOut, Settings, Bell, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);

  const mockProfile = {
    address: '0x7D02fD90716722221277D8CA750B3611Ca51dAB9',
    username: 'EvoTrader42',
    reputation: 85,
    category: 'Premium Holder',
    joinDate: 'Jan 15, 2024',
    totalTrades: 342,
    totalVolume: '125.5 BNB',
    wins: 287,
    losses: 55,
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(mockProfile.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-emerald-500/20 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-white">
            My <span className="text-emerald-400">Profile</span>
          </h1>
          <p className="text-slate-400 mt-1">Monitor your trading history and account settings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Info */}
            <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Account Information</h2>
                <User className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Username</label>
                  <input
                    type="text"
                    value={mockProfile.username}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Wallet Address</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={mockProfile.address}
                      className="flex-1 bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none text-sm"
                      readOnly
                    />
                    <button
                      onClick={handleCopyAddress}
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 rounded px-3 py-2 transition"
                    >
                      <Copy className="w-5 h-5 text-emerald-400" />
                    </button>
                  </div>
                  {copied && <p className="text-emerald-400 text-sm mt-1">✓ Copied!</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Member Since</label>
                    <input
                      type="text"
                      value={mockProfile.joinDate}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Category</label>
                    <div className="bg-emerald-500/10 border border-emerald-400/50 rounded px-3 py-2 text-emerald-300 font-semibold">
                      {mockProfile.category}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trading Stats */}
            <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Trading Statistics</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                  <p className="text-slate-400 text-sm mb-2">Total Trades</p>
                  <p className="text-2xl font-bold text-emerald-400">{mockProfile.totalTrades}</p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                  <p className="text-slate-400 text-sm mb-2">Win Rate</p>
                  <p className="text-2xl font-bold text-emerald-400">{Math.round((mockProfile.wins / mockProfile.totalTrades) * 100)}%</p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                  <p className="text-slate-400 text-sm mb-2">Volume Traded</p>
                  <p className="text-2xl font-bold text-emerald-400">{mockProfile.totalVolume}</p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                  <p className="text-slate-400 text-sm mb-2">Reputation</p>
                  <p className="text-2xl font-bold text-emerald-400">{mockProfile.reputation}/100</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-600/50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-sm">Wins</p>
                    <p className="text-xl font-bold text-emerald-400">{mockProfile.wins}</p>
                  </div>
                  <div className="w-32 bg-slate-700/30 rounded-full h-2">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${(mockProfile.wins / mockProfile.totalTrades) * 100}%` }}
                    />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Losses</p>
                    <p className="text-xl font-bold text-red-400">{mockProfile.losses}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings Menu */}
            <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Settings</h2>

              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 rounded bg-slate-700/30 hover:bg-slate-700/50 transition text-slate-300">
                  <Settings className="w-5 h-5 text-emerald-400" />
                  <span>Account Settings</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 rounded bg-slate-700/30 hover:bg-slate-700/50 transition text-slate-300">
                  <Bell className="w-5 h-5 text-emerald-400" />
                  <span>Notifications</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 rounded bg-slate-700/30 hover:bg-slate-700/50 transition text-slate-300">
                  <Lock className="w-5 h-5 text-emerald-400" />
                  <span>Security</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 rounded bg-red-500/10 hover:bg-red-500/20 transition text-red-400">
                  <LogOut className="w-5 h-5" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>

            {/* Reputation Tier */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-400/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-emerald-300 mb-2">Premium Status</h3>
              <p className="text-sm text-slate-300 mb-4">You have premium member benefits</p>

              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Early access to new tokens
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Lower trading fees
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Priority support
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Quick Links</h2>

              <div className="space-y-2">
                <Link
                  href="/explore"
                  className="block p-3 rounded bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 transition"
                >
                  Browse Launches
                </Link>
                <Link
                  href="/reputation"
                  className="block p-3 rounded bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 transition"
                >
                  View Reputation
                </Link>
                <Link
                  href="/docs"
                  className="block p-3 rounded bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 transition"
                >
                  Documentation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
