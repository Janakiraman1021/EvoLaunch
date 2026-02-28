'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle, Zap, Lock } from 'lucide-react';
import { useWeb3 } from '../../lib/hooks/useWeb3';
import { CONTRACT_ADDRESSES, LAUNCH_FACTORY_ABI, ADAPTIVE_TOKEN_ABI, EVOLUTION_CONTROLLER_ABI, PHASE_NAMES, getSignedContract, getReadProvider } from '../../lib/contracts';
import { postLaunch } from '../../lib/api';
import { parseUnits, parseEther, formatEther, Contract, formatUnits } from 'ethers';

interface FormData {
  name: string;
  symbol: string;
  totalSupply: string;
  initialLiquidity: string;
  initialLiquidityBnb: string;
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
    initialLiquidity: '500000',
    initialLiquidityBnb: '0.01',
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

  // Auto-fill feeCollector when wallet connects
  useEffect(() => {
    if (wallet?.address && !form.feeCollector) {
      setForm(prev => ({ ...prev, feeCollector: wallet.address }));
    }
  }, [wallet?.address]);

  // Validate form
  useEffect(() => {
    const warnings: string[] = [];

    if (form.minTax > form.initialSellTax) {
      warnings.push('Minimum tax is higher than initial sell tax');
    }
    if (form.initialSellTax > form.maxTax) {
      warnings.push('Initial sell tax exceeds maximum tax bound');
    }
    try {
      const minTxBn = parseUnits(form.minMaxTx || '0', 18);
      const initTxBn = parseUnits(form.initialMaxTx || '0', 18);
      if (minTxBn > initTxBn) {
        warnings.push('Minimum max-tx is higher than initial max-tx');
      }

      const minWalletBn = parseUnits(form.minMaxWallet || '0', 18);
      const initWalletBn = parseUnits(form.initialMaxWallet || '0', 18);
      if (minWalletBn > initWalletBn) {
        warnings.push('Minimum max-wallet is higher than initial max-wallet');
      }
    } catch { /* ignore parsing errors during typing */ }
    if (!form.feeCollector || form.feeCollector.length < 42) {
      warnings.push('Fee collector address is required');
    }
    if (!form.name.trim()) {
      warnings.push('Token name is required');
    }
    if (!form.symbol.trim()) {
      warnings.push('Token symbol is required');
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

      // Build the LaunchParams struct as a tuple for ethers.js
      const params = [
        form.name,
        form.symbol,
        parseUnits(form.totalSupply || '1000000', 18),
        parseUnits(form.initialLiquidity || '0', 18), // NEW: initialLiquidityTokens
        BigInt(Math.round(form.initialSellTax * 100)),  // basis points
        BigInt(Math.round(form.initialBuyTax * 100)),
        parseUnits(form.initialMaxTx || '10000', 18),
        parseUnits(form.initialMaxWallet || '20000', 18),
        BigInt(Math.round(form.minTax * 100)),
        BigInt(Math.round(form.maxTax * 100)),
        parseUnits(form.minMaxTx || '1000', 18),
        parseUnits(form.minMaxWallet || '2000', 18),
        form.feeCollector || wallet.address,
        [wallet.address],  // agentPublicKeys
      ];

      // Send BNB along with transaction to auto-create liquidity pool
      const bnbValue = parseEther(form.initialLiquidityBnb || '0');

      console.log('[Launch] Deploying with params:', params, 'BNB:', formatEther(bnbValue));

      const tx = await factory.createLaunch(params, {
        value: bnbValue,
        gasLimit: 15_000_000,  // very high gas: deploys 5 contracts and adds liquidity
      });

      setTxHash(tx.hash);
      console.log('[Launch] TX sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('[Launch] TX confirmed:', receipt);

      if (receipt) {
        // Parse the LaunchCreated event to get all addresses
        let tokenAddress = '', vaultAddress = '', controllerAddress = '', governanceAddress = '', ammPairAddress = '';

        const event = receipt.logs?.find((log: any) => {
          try {
            const parsed = factory.interface.parseLog({ topics: log.topics, data: log.data });
            return parsed?.name === 'LaunchCreated';
          } catch { return false; }
        });

        if (event) {
          const parsed = factory.interface.parseLog({ topics: event.topics, data: event.data });
          tokenAddress = parsed?.args?.[0] || '';
          vaultAddress = parsed?.args?.[1] || '';
          controllerAddress = parsed?.args?.[2] || '';
          governanceAddress = parsed?.args?.[3] || '';
          ammPairAddress = parsed?.args?.[4] || '';
          console.log('[Launch] New token:', tokenAddress);
        }

        // Read on-chain token data and save to localStorage
        if (tokenAddress) {
          let totalSupply = '0', sellTax = 0, buyTax = 0, phase = 0, mss = 0;
          try {
            const provider = getReadProvider();
            const tokenContract = new Contract(tokenAddress, ADAPTIVE_TOKEN_ABI, provider);
            const [ts, st, bt] = await Promise.all([
              tokenContract.totalSupply(),
              tokenContract.sellTax(),
              tokenContract.buyTax(),
            ]);
            totalSupply = formatUnits(ts, 18);
            sellTax = Number(st) / 100;
            buyTax = Number(bt) / 100;
          } catch (e) { console.warn('[Launch] Token read failed:', e); }

          try {
            if (controllerAddress) {
              const provider = getReadProvider();
              const ctrl = new Contract(controllerAddress, EVOLUTION_CONTROLLER_ABI, provider);
              const [p, m] = await Promise.all([ctrl.currentPhase(), ctrl.currentMSS()]);
              phase = Number(p); mss = Number(m);
            }
          } catch { /* controller read failed */ }

          await postLaunch({
            tokenAddress,
            vaultAddress,
            controllerAddress,
            governanceAddress,
            ammPairAddress,
            name: form.name,
            symbol: form.symbol,
            totalSupply,
            sellTax,
            buyTax,
            phase,
            phaseName: PHASE_NAMES[phase] || 'Genesis',
            mss,
            deployer: wallet.address,
            blockNumber: receipt.blockNumber || 0,
          });
          console.log('[Launch] Token registered in backend!');
        }

        router.push(`/explore`);
      }
    } catch (err: any) {
      console.error('[Launch] Deploy error:', err);
      // Extract readable error from revert or user rejection
      const reason = err?.reason || err?.data?.message || err?.shortMessage || err?.message || 'Deployment failed';
      setError(reason);
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
                    <label className="text-xs font-bold text-gold uppercase tracking-[0.1em] ml-2">Token Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                      placeholder="e.g. EvoLaunch Prime"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gold uppercase tracking-[0.1em] ml-2">Ticker Symbol</label>
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
                    <label className="text-xs font-bold text-gold uppercase tracking-[0.1em] ml-2">Total Issuance</label>
                    <input
                      type="number"
                      value={form.totalSupply}
                      onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gold uppercase tracking-[0.1em] ml-2">Initial Liquidity (BNB)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.initialLiquidityBnb}
                      onChange={(e) => handleInputChange('initialLiquidityBnb', e.target.value)}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                      placeholder="e.g. 0.05"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gold uppercase tracking-[0.1em] ml-2">Initial Liquidity (Tokens)</label>
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
                    <label className="text-xs font-bold text-gold uppercase tracking-[0.1em] ml-2">Initial Sell Tax (%)</label>
                    <input
                      type="number"
                      value={form.initialSellTax}
                      onChange={(e) => handleInputChange('initialSellTax', parseFloat(e.target.value))}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gold uppercase tracking-[0.1em] ml-2">Initial Buy Tax (%)</label>
                    <input
                      type="number"
                      value={form.initialBuyTax}
                      onChange={(e) => handleInputChange('initialBuyTax', parseFloat(e.target.value))}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gold uppercase tracking-[0.1em] ml-2">Minimum Tax Floor</label>
                    <input
                      type="number"
                      value={form.minTax}
                      onChange={(e) => handleInputChange('minTax', parseFloat(e.target.value))}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gold uppercase tracking-[0.1em] ml-2">Maximum Tax Ceiling</label>
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
                    <label className="text-xs font-bold text-gold uppercase tracking-[0.1em] ml-2">Max Transaction Amt</label>
                    <input
                      type="number"
                      value={form.initialMaxTx}
                      onChange={(e) => handleInputChange('initialMaxTx', e.target.value)}
                      className="w-full bg-background border border-gold/[0.08] rounded-xl px-6 py-4 focus:border-gold/30 outline-none transition-all text-primary font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gold uppercase tracking-[0.1em] ml-2">Max Wallet Capacity</label>
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
                <code className="text-xs text-gold/60 font-mono block truncate py-2 px-4 bg-background/50 rounded-lg">{txHash}</code>
              </div>
            )}

            <button
              onClick={handleDeploy}
              disabled={loading || !isConnected || validationWarnings.length > 0}
              className="btn-primary w-full py-6 text-base tracking-[0.2em]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                  Processing Mandate...
                </span>
              ) : 'Execute Deployment'}
            </button>
            <p className="text-xs text-muted/30 text-center font-bold uppercase tracking-[0.3em] mt-6">
              Authenticated & Secured by EvoLaunch Institutional Core
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
