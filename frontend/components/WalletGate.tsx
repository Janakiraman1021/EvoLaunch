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
            <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
                {/* Subtle grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(230,192,123,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(230,192,123,0.02)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px]" />
                
                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} 
                             className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gold/30 rounded-full animate-pulse"
                             style={{
                                 top: `${Math.random() * 100}%`,
                                 left: `${Math.random() * 100}%`,
                                 animationDelay: `${Math.random() * 3}s`,
                                 animationDuration: `${2 + Math.random() * 2}s`
                             }} />
                    ))}
                </div>

                <div className="relative z-10">
                    <div className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 relative mx-auto">
                        <div className="absolute inset-0 rounded-full border border-gold/20 sm:border-2 animate-spin"></div>
                        <div className="absolute inset-1 sm:inset-2 rounded-full border border-gold/40 animate-spin-reverse"></div>
                        <div className="absolute inset-4 sm:inset-6 rounded-full bg-gold/10 flex items-center justify-center">
                            <Shield className="text-gold animate-pulse w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                    </div>
                    <div className="text-center mt-4 sm:mt-6">
                        <p className="text-gold text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold">
                            Initializing
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold rounded-full animate-pulse" 
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
                <div className="absolute inset-0 bg-[linear-gradient(rgba(230,192,123,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(230,192,123,0.015)_1px,transparent_1px)] bg-[size:25px_25px] sm:bg-[size:40px_40px]" />
                
                {/* Subtle glow effects */}
                <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-48 h-48 sm:w-96 sm:h-96 bg-gold/5 rounded-full blur-2xl sm:blur-3xl"></div>
                <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-48 h-48 sm:w-96 sm:h-96 bg-gold/3 rounded-full blur-2xl sm:blur-3xl"></div>

                <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 relative z-10">
                    <div className="max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl w-full">
                        {/* Header Section */}
                        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                            {/* Logo */}
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8">
                                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 shadow-gold-glow"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Shield className="text-gold w-8 h-8 sm:w-10 sm:h-10" />
                                </div>
                                {/* Orbiting dots */}
                                <div className="absolute inset-0 animate-spin-slow">
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold rounded-full"></div>
                                </div>
                                <div className="absolute inset-0 animate-spin-slow" style={{animationDirection: 'reverse', animationDuration: '12s'}}>
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gold/60 rounded-full"></div>
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-3 sm:mb-4 bg-gradient-to-b from-primary to-primary/80 bg-clip-text px-2">
                                EvoLaunch Protocol
                            </h1>
                            <div className="w-16 sm:w-20 lg:w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-3 sm:mb-4"></div>
                            <p className="text-muted text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.25em] font-bold px-4">
                                Institutional-Grade Adaptive Infrastructure
                            </p>
                        </div>

                        {/* Main Connect Card */}
                        <div className="luxury-card bg-secondary/60 backdrop-blur-xl border border-white/5 p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden">
                            {/* Background glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent"></div>
                            
                            <div className="relative z-10">
                                {/* Wallet Icon */}
                                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-gold-glow">
                                    <Wallet className="text-gold w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                                </div>

                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-2 sm:mb-3 tracking-tight px-2">
                                    Wallet Authentication Required
                                </h2>
                                
                                <p className="text-muted text-xs sm:text-sm mb-6 sm:mb-8 lg:mb-10 max-w-xs sm:max-w-sm mx-auto leading-relaxed px-2">
                                    Connect your wallet to access the EvoLaunch deployment terminal.
                                    Your session will persist until you manually disconnect.
                                </p>

                                {/* Connect Button */}
                                <button
                                    onClick={connectWallet}
                                    disabled={isConnecting}
                                    className="group btn-primary w-full py-3 sm:py-4 lg:py-5 text-sm sm:text-base tracking-[0.1em] sm:tracking-[0.15em] flex items-center justify-center gap-2 sm:gap-3 relative overflow-hidden"
                                >
                                    {/* Button hover effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    
                                    <div className="relative flex items-center gap-2 sm:gap-3">
                                        {isConnecting ? (
                                            <>
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#0C0C0F]/20 border-t-[#0C0C0F] rounded-full animate-spin" />
                                                <span className="text-xs sm:text-sm lg:text-base">Authenticating...</span>
                                                <div className="flex gap-1">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="w-1 h-1 bg-[#0C0C0F] rounded-full animate-pulse"
                                                             style={{ animationDelay: `${i * 0.2}s` }}></div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="group-hover:animate-pulse w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="text-xs sm:text-sm lg:text-base">Connect MetaMask</span>
                                                <div className="ml-1 sm:ml-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </button>

                                {error && (
                                    <div className="mt-4 sm:mt-6 p-3 bg-status-danger/10 border border-status-danger/20 rounded-lg">
                                        <p className="text-status-danger text-xs font-bold uppercase tracking-wider sm:tracking-widest">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {/* Network Info */}
                                <div className="mt-6 sm:mt-8 lg:mt-10 pt-4 sm:pt-6 border-t border-white/5 space-y-2 sm:space-y-3">
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-muted/60 text-xs">
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <Network className="w-3 h-3" />
                                            <span className="uppercase tracking-wider font-bold">BSC Testnet</span>
                                        </div>
                                        <div className="hidden sm:block w-px h-3 bg-muted/20"></div>
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <Layers className="w-3 h-3" />
                                            <span className="uppercase tracking-wider font-bold">Chain ID 97</span>
                                        </div>
                                    </div>
                                    <div className="text-gold/60 text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold flex items-center justify-center gap-2">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold/60 rounded-full animate-pulse"></div>
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
