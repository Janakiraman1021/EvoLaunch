'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle, Zap, Lock } from 'lucide-react';
import { useWeb3 } from '@/lib/hooks/useWeb3';
import { CONTRACT_ADDRESSES, LAUNCH_FACTORY_ABI, getSignedContract } from '@/lib/contracts';

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

    if (parseInt(form.minTax) > form.initialSellTax) {
      warnings.push('Minimum tax is higher than initial sell tax');
    }
    if (form.initialSellTax > parseInt(form.maxTax)) {
      warnings.push('Initial sell tax exceeds maximum tax bound');
    }
    if (parseInt(form.minMaxTx) > parseInt(form.initialMaxTx)) {
      warnings.push('Minimum max-tx is higher than initial max-tx');
    }
    if (parseInt(form.minMaxWallet) > parseInt(form.initialMaxWallet)) {
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

      const tx = await factory.createLaunch(
        form.name,
        form.symbol,
        parseValue(form.totalSupply),
        form.initialSellTax * 100, // Convert to basis points
        form.initialBuyTax * 100,
        parseValue(form.initialMaxTx),
        parseValue(form.initialMaxWallet),
        form.minTax * 100,
        form.maxTax * 100,
        parseValue(form.minMaxTx),
        parseValue(form.minMaxWallet),
        form.feeCollector || wallet.address,
        [wallet.address]
      );

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-forest/10 bg-forest/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-forest/60 hover:text-forest transition flex items-center gap-2 mb-4">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-forest">Launch Your Token</h1>
          <p className="text-forest/60 mt-2">
            Deploy an adaptive token with dynamic taxes and market-responsive logic.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Wallet Connection */}
        {!isConnected ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 mb-2">Connect Wallet</h3>
              <p className="text-amber-800 text-sm mb-4">
                You must connect your wallet to deploy a token. Make sure you're on BSC Testnet.
              </p>
              <button
                onClick={connectWallet}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
              >
                Connect MetaMask
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-green-900 font-mono text-sm">Connected: {wallet.address}</span>
          </div>
        )}

        {/* Main Form */}
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-forest mb-6">Token Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-forest font-semibold mb-2">Token Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-forest/20 rounded-lg focus:outline-none focus:border-forest"
                  placeholder="e.g., Sample Token"
                />
              </div>
              <div>
                <label className="block text-forest font-semibold mb-2">Symbol</label>
                <input
                  type="text"
                  value={form.symbol}
                  onChange={(e) => handleInputChange('symbol', e.target.value)}
                  maxLength={10}
                  className="w-full px-4 py-2 border border-forest/20 rounded-lg focus:outline-none focus:border-forest"
                  placeholder="e.g., SMPL"
                />
              </div>
              <div>
                <label className="block text-forest font-semibold mb-2">Total Supply</label>
                <input
                  type="number"
                  value={form.totalSupply}
                  onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                  className="w-full px-4 py-2 border border-forest/20 rounded-lg focus:outline-none focus:border-forest"
                  placeholder="e.g., 1000000"
                />
              </div>
              <div>
                <label className="block text-forest font-semibold mb-2">Initial Liquidity (tokens)</label>
                <input
                  type="number"
                  value={form.initialLiquidity}
                  onChange={(e) => handleInputChange('initialLiquidity', e.target.value)}
                  className="w-full px-4 py-2 border border-forest/20 rounded-lg focus:outline-none focus:border-forest"
                  placeholder="e.g., 10000"
                />
              </div>
            </div>
          </div>

          {/* Tax Configuration */}
          <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-forest mb-2 flex items-center gap-2">
              <Zap size={24} className="text-growth" />
              Tax Configuration
            </h2>
            <p className="text-forest/60 text-sm mb-6">
              Set initial taxes and bounds. All future updates will be constrained within min/max limits.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-forest font-semibold mb-2">Initial Sell Tax (%)</label>
                <input
                  type="number"
                  value={form.initialSellTax}
                  onChange={(e) => handleInputChange('initialSellTax', parseFloat(e.target.value))}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-forest/20 rounded-lg focus:outline-none focus:border-forest"
                />
              </div>
              <div>
                <label className="block text-forest font-semibold mb-2">Initial Buy Tax (%)</label>
                <input
                  type="number"
                  value={form.initialBuyTax}
                  onChange={(e) => handleInputChange('initialBuyTax', parseFloat(e.target.value))}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-forest/20 rounded-lg focus:outline-none focus:border-forest"
                />
              </div>
              <div>
                <label className="block text-forest font-semibold mb-2">Minimum Tax Bound (%)</label>
                <input
                  type="number"
                  value={form.minTax}
                  onChange={(e) => handleInputChange('minTax', parseFloat(e.target.value))}
                  min="0"
                  className="w-full px-4 py-2 border border-forest/20 rounded-lg focus:outline-none focus:border-forest"
                />
                <p className="text-xs text-forest/50 mt-1">Agents cannot lower tax below this</p>
              </div>
              <div>
                <label className="block text-forest font-semibold mb-2">Maximum Tax Bound (%)</label>
                <input
                  type="number"
                  value={form.maxTax}
                  onChange={(e) => handleInputChange('maxTax', parseFloat(e.target.value))}
                  max="100"
                  className="w-full px-4 py-2 border border-forest/20 rounded-lg focus:outline-none focus:border-forest"
                />
                <p className="text-xs text-forest/50 mt-1">Agents cannot raise tax above this</p>
              </div>
            </div>
          </div>

          {/* Transaction Limits */}
          <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-forest mb-2 flex items-center gap-2">
              <Lock size={24} className="text-expansion" />
              Transaction Limits
            </h2>
            <p className="text-forest/60 text-sm mb-6">
              Prevent whale accumulation with per-transaction and per-wallet limits.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-forest font-semibold mb-2">Initial Max Tx Amount</label>
                <input
                  type="number"
                  value={form.initialMaxTx}
                  onChange={(e) => handleInputChange('initialMaxTx', e.target.value)}
                  className="w-full px-4 py-2 border border-forest/20 rounded-lg focus:outline-none focus:border-forest"
                />
              </div>
              <div>
                <label className="block text-forest font-semibold mb-2">Initial Max Wallet</label>
                <input
                  type="number"
                  value={form.initialMaxWallet}
                  onChange={(e) => handleInputChange('initialMaxWallet', e.target.value)}
                  className="w-full px-4 py-2 border border-forest/20 rounded-lg focus:outline-none focus:border-forest"
                />
              </div>
              <div>
                <label className="block text-forest font-semibold mb-2">Minimum Max Tx Bound</label>
                <input
                  type="number"
                  value={form.minMaxTx}
                  onChange={(e) => handleInputChange('minMaxTx', e.target.value)}
                  className="w-full px-4 py-2 border border-forest/20 rounded-lg focus:outline-none focus:border-forest"
                />
                <p className="text-xs text-forest/50 mt-1">Prevents overconstrictive limits</p>
              </div>
              <div>
                <label className="block text-forest font-semibold mb-2">Minimum Max Wallet Bound</label>
                <input
                  type="number"
                  value={form.minMaxWallet}
                  onChange={(e) => handleInputChange('minMaxWallet', e.target.value)}
                  className="w-full px-4 py-2 border border-forest/20 rounded-lg focus:outline-none focus:border-forest"
                />
                <p className="text-xs text-forest/50 mt-1">Prevents overconstrictive limits</p>
              </div>
            </div>
          </div>

          {/* Fee Collector */}
          <div className="bg-white border-2 border-forest/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-forest mb-4">Fee Collector Address</h2>
            <input
              type="text"
              value={form.feeCollector}
              onChange={(e) => handleInputChange('feeCollector', e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 border border-forest/20 rounded-lg focus:outline-none focus:border-forest font-mono text-sm"
            />
            <p className="text-xs text-forest/50 mt-2">Address that receives taxes from trading</p>
          </div>

          {/* Validation Warnings */}
          {validationWarnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                <AlertCircle size={20} />
                Validation Warnings
              </h3>
              <ul className="space-y-2">
                {validationWarnings.map((warning, idx) => (
                  <li key={idx} className="text-amber-800 text-sm">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <AlertCircle size={20} />
                Deployment Error
              </h3>
              <p className="text-red-800 text-sm font-mono">{error}</p>
            </div>
          )}

          {/* Transaction Status */}
          {txHash && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle size={20} />
                Transaction Submitted
              </h3>
              <p className="text-green-800 text-sm font-mono break-all">{txHash}</p>
              <p className="text-green-800 text-sm mt-2">Waiting for confirmation...</p>
            </div>
          )}

          {/* Deploy Button */}
          <button
            onClick={handleDeploy}
            disabled={loading || !isConnected || validationWarnings.length > 0}
            className="w-full px-8 py-4 bg-forest text-white rounded-lg font-bold text-lg hover:bg-forest/90 transition disabled:bg-forest/50 disabled:cursor-not-allowed"
          >
            {loading ? 'Deploying...' : 'Deploy Token'}
          </button>
        </div>
      </div>
    </div>
  );
}
