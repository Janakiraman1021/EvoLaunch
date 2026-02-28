'use client';

import React from 'react';
import { useWeb3 } from '../lib/hooks/useWeb3';
import { Wallet, Shield, Zap, Network, Layers } from 'lucide-react';

/**
 * Blocks all app content until wallet is connected.
 * Shows a premium luxury connect screen.
 */
export default function WalletGate({ children }: { children: React.ReactNode }) {
    const { isConnected, isConnecting, connectWallet, error, checked } = useWeb3();

    // Don't flash the gate while checking localStorage
    if (!checked) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
                {/* Subtle grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(230,192,123,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(230,192,123,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
                
                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} 
                             className="absolute w-1 h-1 bg-gold/30 rounded-full animate-pulse"
                             style={{
                                 top: `${Math.random() * 100}%`,
                                 left: `${Math.random() * 100}%`,
                                 animationDelay: `${Math.random() * 3}s`,
                                 animationDuration: `${2 + Math.random() * 2}s`
                             }} />
                    ))}
                </div>

                <div className="relative z-10">
                    <div className="w-24 h-24 relative mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border border-gold/40 animate-spin-reverse"></div>
                        <div className="absolute inset-6 rounded-full bg-gold/10 flex items-center justify-center">
                            <Shield className="text-gold animate-pulse" size={24} />
                        </div>
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-gold text-sm uppercase tracking-[0.3em] font-bold">
                            Initializing
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-gold rounded-full animate-pulse" 
                                     style={{ animationDelay: `${i * 0.2}s` }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background text-primary relative overflow-hidden">
                {/* Luxury background pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(230,192,123,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(230,192,123,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                {/* Subtle glow effects */}
                <div className="absolute top-20 left-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold/3 rounded-full blur-3xl"></div>

                <div className="flex items-center justify-center min-h-screen p-8 relative z-10">
                    <div className="max-w-lg w-full">
                        {/* Header Section */}
                        <div className="text-center mb-16">
                            {/* Logo */}
                            <div className="relative w-20 h-20 mx-auto mb-8">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 shadow-gold-glow"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Shield className="text-gold" size={40} />
                                </div>
                                {/* Orbiting dots */}
                                <div className="absolute inset-0 animate-spin-slow">
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gold rounded-full"></div>
                                </div>
                                <div className="absolute inset-0 animate-spin-slow" style={{animationDirection: 'reverse', animationDuration: '12s'}}>
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gold/60 rounded-full"></div>
                                </div>
                            </div>

                            <h1 className="text-5xl font-bold text-primary tracking-tight mb-4 bg-gradient-to-b from-primary to-primary/80 bg-clip-text">
                                EvoLaunch Protocol
                            </h1>
                            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4"></div>
                            <p className="text-muted text-sm uppercase tracking-[0.25em] font-bold">
                                Institutional-Grade Adaptive Infrastructure
                            </p>
                        </div>

                        {/* Main Connect Card */}
                        <div className="luxury-card bg-secondary/60 backdrop-blur-xl border border-white/5 p-12 text-center relative overflow-hidden">
                            {/* Background glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent"></div>
                            
                            <div className="relative z-10">
                                {/* Wallet Icon */}
                                <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8 shadow-gold-glow">
                                    <Wallet className="text-gold" size={32} />
                                </div>

                                <h2 className="text-2xl font-bold text-primary mb-3 tracking-tight">
                                    Wallet Authentication Required
                                </h2>
                                
                                <p className="text-muted text-sm mb-10 max-w-sm mx-auto leading-relaxed">
                                    Connect your wallet to access the EvoLaunch deployment terminal.
                                    Your session will persist until you manually disconnect.
                                </p>

                                {/* Connect Button */}
                                <button
                                    onClick={connectWallet}
                                    disabled={isConnecting}
                                    className="group btn-primary w-full py-5 text-base tracking-[0.15em] flex items-center justify-center gap-3 relative overflow-hidden"
                                >
                                    {/* Button hover effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    
                                    <div className="relative flex items-center gap-3">
                                        {isConnecting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-[#0C0C0F]/20 border-t-[#0C0C0F] rounded-full animate-spin" />
                                                <span>Authenticating...</span>
                                                <div className="flex gap-1">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="w-1 h-1 bg-[#0C0C0F] rounded-full animate-pulse"
                                                             style={{ animationDelay: `${i * 0.2}s` }}></div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="group-hover:animate-pulse" size={20} />
                                                <span>Connect MetaMask</span>
                                                <div className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <Wallet size={16} />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </button>

                                {error && (
                                    <div className="mt-6 p-3 bg-status-danger/10 border border-status-danger/20 rounded-lg">
                                        <p className="text-status-danger text-xs font-bold uppercase tracking-widest">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {/* Network Info */}
                                <div className="mt-10 pt-6 border-t border-white/5 space-y-3">
                                    <div className="flex items-center justify-center gap-4 text-muted/60 text-xs">
                                        <div className="flex items-center gap-2">
                                            <Network size={12} />
                                            <span className="uppercase tracking-wider font-bold">BSC Testnet</span>
                                        </div>
                                        <div className="w-px h-3 bg-muted/20"></div>
                                        <div className="flex items-center gap-2">
                                            <Layers size={12} />
                                            <span className="uppercase tracking-wider font-bold">Chain ID 97</span>
                                        </div>
                                    </div>
                                    <div className="text-gold/60 text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-gold/60 rounded-full animate-pulse"></div>
                                        Secure Connection
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
