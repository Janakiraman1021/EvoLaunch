'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle, Zap, Lock } from 'lucide-react';
import { useWeb3 } from '../../lib/hooks/useWeb3';
import { CONTRACT_ADDRESSES, LAUNCH_FACTORY_ABI, getSignedContract } from '../../lib/contracts';

interface FormData {
  name: string;
  symbol: string;
  totalSupply: string;
  initialLiquidity: string;
  initialSellTax: number;
  initialBuyTax: number;
  minTax: number;
  maxTax: number;
  initialMaxTx: string;
  initialMaxWallet: string;
  minMaxTx: string;
  minMaxWallet: string;
  feeCollector: string;
  phaseThresholds: {
    growth: number;
    expansion: number;
    governance: number;
  };
}

export default function LaunchPage() {
  const router = useRouter();
  const { wallet, connectWallet, isConnected } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    name: 'Sample Token',
    symbol: 'SMPL',
    totalSupply: '1000000',
    initialLiquidity: '10000',
    initialSellTax: 5,
    initialBuyTax: 2,
    minTax: 0,
    maxTax: 25,
    initialMaxTx: '10000',
    initialMaxWallet: '20000',
    minMaxTx: '1000',
    minMaxWallet: '2000',
    feeCollector: '',
    phaseThresholds: {
      growth: 25,
      expansion: 50,
      governance: 75,
    },
  });

  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Validate form
  useEffect(() => {
    const warnings: string[] = [];

    if (form.minTax > form.initialSellTax) {
      warnings.push('Minimum tax is higher than initial sell tax');
    }
    if (form.initialSellTax > form.maxTax) {
      warnings.push('Initial sell tax exceeds maximum tax bound');
    }
    if (BigInt(form.minMaxTx) > BigInt(form.initialMaxTx)) {
      warnings.push('Minimum max-tx is higher than initial max-tx');
    }
    if (BigInt(form.minMaxWallet) > BigInt(form.initialMaxWallet)) {
      warnings.push('Minimum max-wallet is higher than initial max-wallet');
    }
    if (!form.feeCollector || form.feeCollector === '') {
      warnings.push('Fee collector address is required');
    }

    setValidationWarnings(warnings);
  }, [form]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm((prev) => {
      if (field === 'phaseThresholds') {
        return {
          ...prev,
          phaseThresholds: { ...prev.phaseThresholds, ...value },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleDeploy = async () => {
    if (!isConnected || !wallet?.signer) {
      setError('Please connect your wallet first');
      return;
    }

    if (validationWarnings.length > 0) {
      setError('Please resolve all validation warnings before deploying');
      return;
    }

    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const factory = getSignedContract(
        CONTRACT_ADDRESSES.LAUNCH_FACTORY,
        LAUNCH_FACTORY_ABI,
        wallet.signer
      );

      // Parse form values to wei
      const parseValue = (val: string, decimals: number = 18) => {
        return BigInt(Math.floor(parseFloat(val) * Math.pow(10, decimals)));
      };

      const tx = await factory.createLaunch({
        name: form.name,
        symbol: form.symbol,
        totalSupply: parseValue(form.totalSupply),
        initialSellTax: form.initialSellTax * 100, // Convert to basis points
        initialBuyTax: form.initialBuyTax * 100,
        initialMaxTx: parseValue(form.initialMaxTx),
        initialMaxWallet: parseValue(form.initialMaxWallet),
        minTax: form.minTax * 100,
        maxTax: form.maxTax * 100,
        minMaxTx: parseValue(form.minMaxTx),
        minMaxWallet: parseValue(form.minMaxWallet),
        feeCollector: form.feeCollector || wallet.address,
        agentPublicKeys: [wallet.address]
      });

      setTxHash(tx.hash);

      const receipt = await tx.wait();
      if (receipt) {
        router.push(`/project/${form.symbol}`);
      }
    } catch (err: any) {
      setError(err.message || 'Deployment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-20 pt-8">
      <div className="max-w-5xl mx-auto">
        {/* Connection Mandate */}
        {!isConnected && (
          <div className="luxury-card border-gold/20 p-12 mb-16 flex items-center gap-8 bg-secondary/80 backdrop-blur-xl">
            <div className="w-20 h-20 rounded-[2rem] bg-gold/10 flex items-center justify-center text-gold">
              <AlertCircle size={40} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-primary mb-3">Institutional Mandate Required</h3>
              <p className="text-muted text-base mb-6 max-w-xl">
                Cryptographic authentication is required to access the deployment terminal. Please authorize your institutional wallet.
              </p>
              <button
                onClick={connectWallet}
                className="btn-primary"
              >
                Authorize Wallet
              </button>
            </div>
          </div>
        )}

        {/* Deployment Matrix */}
        <div className="space-y-12 opacity-0 animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-forwards" style={{ animationDelay: '200ms' }}>
          
          {/* Section: Core Parameters */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-primary mb-4 tracking-tight">Core Identifiers</h2>
              <p className="text-muted/60 text-sm leading-relaxed">
                Define the primary cryptographic identifiers and issuance parameters for your strategic asset.
              </p>
            </div>
            <div className="lg:col-span-2 space-y-8">
              <div className="luxury-card p-10 bg-secondary/30">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-2">Token Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                      placeholder="e.g. EvoLaunch Prime"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-2">Ticker Symbol</label>
                    <input
                      type="text"
                      value={form.symbol}
                      onChange={(e) => handleInputChange('symbol', e.target.value)}
                      maxLength={10}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium uppercase font-mono"
                      placeholder="EVO"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-2">Total Issuance</label>
                    <input
                      type="number"
                      value={form.totalSupply}
                      onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-2">Initial Liquidity</label>
                    <input
                      type="number"
                      value={form.initialLiquidity}
                      onChange={(e) => handleInputChange('initialLiquidity', e.target.value)}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Adaptive Tax Engine */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-primary mb-4 tracking-tight flex items-center gap-3">
                <Zap size={22} className="text-gold" /> Tax Engine
              </h2>
              <p className="text-muted/60 text-sm leading-relaxed">
                Configure the dynamic tax bounds. The Neural Core will optimize within these institutional limits.
              </p>
            </div>
            <div className="lg:col-span-2">
              <div className="luxury-card p-10 bg-secondary/30">
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-2">Initial Sell Tax (%)</label>
                    <input
                      type="number"
                      value={form.initialSellTax}
                      onChange={(e) => handleInputChange('initialSellTax', parseFloat(e.target.value))}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-2">Initial Buy Tax (%)</label>
                    <input
                      type="number"
                      value={form.initialBuyTax}
                      onChange={(e) => handleInputChange('initialBuyTax', parseFloat(e.target.value))}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-2">Minimum Tax Floor</label>
                    <input
                      type="number"
                      value={form.minTax}
                      onChange={(e) => handleInputChange('minTax', parseFloat(e.target.value))}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-2">Maximum Tax Ceiling</label>
                    <input
                      type="number"
                      value={form.maxTax}
                      onChange={(e) => handleInputChange('maxTax', parseFloat(e.target.value))}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Guardrails */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-primary mb-4 tracking-tight flex items-center gap-3">
                <Lock size={22} className="text-gold" /> Guardrails
              </h2>
              <p className="text-muted/60 text-sm leading-relaxed">
                Mitigate whale concentration Risk through per-mandate transaction and wallet capacity limits.
              </p>
            </div>
            <div className="lg:col-span-2">
              <div className="luxury-card p-10 bg-secondary/30">
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-2">Max Transaction Amt</label>
                    <input
                      type="number"
                      value={form.initialMaxTx}
                      onChange={(e) => handleInputChange('initialMaxTx', e.target.value)}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] ml-2">Max Wallet Capacity</label>
                    <input
                      type="number"
                      value={form.initialMaxWallet}
                      onChange={(e) => handleInputChange('initialMaxWallet', e.target.value)}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Warnings */}
          {validationWarnings.length > 0 && (
            <div className="luxury-card border-status-warning/20 p-8 bg-status-warning/5">
              <h3 className="font-bold text-status-warning mb-4 flex items-center gap-3 tracking-tight">
                <AlertCircle size={20} />
                Strategic Validation Warnings
              </h3>
              <ul className="grid md:grid-cols-2 gap-4">
                {validationWarnings.map((warning, idx) => (
                  <li key={idx} className="text-status-warning/80 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-warning" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Terminal */}
          <div className="pt-10 border-t border-gold/10">
            {error && (
              <div className="luxury-card border-status-danger/20 p-6 bg-status-danger/5 mb-8 flex items-center gap-4 text-status-danger">
                <AlertCircle size={20} />
                <span className="text-sm font-bold uppercase tracking-widest leading-relaxed">{error}</span>
              </div>
            )}

            {txHash && (
              <div className="luxury-card border-gold/20 p-6 bg-gold/5 mb-8 flex flex-col gap-3">
                <div className="flex items-center gap-4 text-gold">
                  <CheckCircle size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest tracking-widest">Transaction Propagating</span>
                </div>
                <code className="text-[10px] text-gold/60 font-mono block truncate py-2 px-4 bg-background/50 rounded-lg">{txHash}</code>
              </div>
            )}

            <button
              onClick={handleDeploy}
              disabled={loading || !isConnected || validationWarnings.length > 0}
              className="btn-primary w-full py-6 text-base tracking-[0.2em]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-[#0C0C0F]/20 border-t-[#0C0C0F] rounded-full animate-spin" />
                  Processing Mandate...
                </span>
              ) : 'Execute Deployment'}
            </button>
            <p className="text-[9px] text-muted/30 text-center font-bold uppercase tracking-[0.3em] mt-6">
              Authenticated & Secured by EvoLaunch Institutional Core
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
