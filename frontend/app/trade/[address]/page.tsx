'use client';

import React, { useState, useEffect } from 'react';
import { ArrowDown, Zap, AlertCircle, TrendingUp, Settings, ChevronLeft, Droplets, Info } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useWeb3 } from '../../../lib/hooks/useWeb3';
import { getStatus } from '../../../lib/api';
import { CONTRACT_ADDRESSES, PANCAKE_ROUTER_ABI, ADAPTIVE_TOKEN_ABI, getSignedContract, getReadProvider, fetchTokenData } from '../../../lib/contracts';
import { Contract, parseEther, parseUnits, formatUnits, formatEther } from 'ethers';

export default function TradePage() {
    const params = useParams();
    const tokenAddress = params?.address as string;

    const { wallet, isConnected } = useWeb3();
    const [isBuy, setIsBuy] = useState(true);
    const [amountIn, setAmountIn] = useState('');
    const [amountOut, setAmountOut] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [tokenSymbol, setTokenSymbol] = useState('TOKEN');
    const [tokenName, setTokenName] = useState('');
    const [bnbBalance, setBnbBalance] = useState('0');
    const [tokenBalance, setTokenBalance] = useState('0');
    const [pageLoading, setPageLoading] = useState(true);

    // Slippage settings
    const [slippage, setSlippage] = useState(10); // 10%

    useEffect(() => {
        if (tokenAddress) {
            loadTokenInfo();
        }
    }, [tokenAddress]);

    useEffect(() => {
        if (wallet?.address && tokenAddress) {
            fetchBalances();
        }
    }, [wallet?.address, tokenAddress]);

    useEffect(() => {
        if (amountIn && Number(amountIn) > 0) {
            const timer = setTimeout(estimateOut, 500); // debounce
            return () => clearTimeout(timer);
        } else {
            setAmountOut('');
        }
    }, [amountIn, isBuy, slippage]);

    const loadTokenInfo = async () => {
        try {
            const status = await getStatus(tokenAddress);
            if (status && status.launch) {
                setTokenSymbol(status.launch.symbol);
                setTokenName(status.launch.name);
            } else {
                // Fallback to on-chain read
                const provider = getReadProvider();
                const token = new Contract(tokenAddress, ADAPTIVE_TOKEN_ABI, provider);
                const [sym, name] = await Promise.all([token.symbol(), token.name()]);
                setTokenSymbol(sym);
                setTokenName(name);
            }
        } catch (err) {
            console.error('Failed to load token info', err);
        } finally {
            setPageLoading(false);
        }
    };

    const fetchBalances = async () => {
        if (!wallet?.address || !tokenAddress) return;
        try {
            const provider = getReadProvider();
            const bnb = await provider.getBalance(wallet.address);
            setBnbBalance(formatEther(bnb));

            const token = new Contract(tokenAddress, ADAPTIVE_TOKEN_ABI, provider);
            const bal = await token.balanceOf(wallet.address);
            setTokenBalance(formatUnits(bal, 18));
        } catch (err) {
            console.error('Failed to fetch balances:', err);
        }
    };

    const estimateOut = async () => {
        try {
            const provider = getReadProvider();
            const router = new Contract(CONTRACT_ADDRESSES.PANCAKE_ROUTER, PANCAKE_ROUTER_ABI, provider);
            const WETH = await router.WETH();

            let path;
            let parsedAmountIn;

            if (isBuy) {
                path = [WETH, tokenAddress];
                parsedAmountIn = parseEther(amountIn);
            } else {
                path = [tokenAddress, WETH];
                parsedAmountIn = parseUnits(amountIn, 18);
            }

            const amounts = await router.getAmountsOut(parsedAmountIn, path);

            if (isBuy) {
                setAmountOut(formatUnits(amounts[1], 18));
            } else {
                setAmountOut(formatEther(amounts[1]));
            }
            setError(null);
        } catch (err: any) {
            console.error('Estimation error:', err);
            setError('Insufficient Liquidity in Pool. The creator must add liquidity first.');
            setAmountOut('');
        }
    };

    const handleSwap = async () => {
        if (!wallet?.signer) {
            setError('Please connect your institutional wallet');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const router = getSignedContract(CONTRACT_ADDRESSES.PANCAKE_ROUTER, PANCAKE_ROUTER_ABI, wallet.signer);
            const WETH = await router.WETH();
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 mins

            const slippageDec = slippage / 100;

            if (isBuy) {
                const amountInParsed = parseEther(amountIn);
                const amountOutMin = parseUnits((Number(amountOut) * (1 - slippageDec)).toFixed(18), 18);

                const tx = await router.swapExactETHForTokens(
                    amountOutMin,
                    [WETH, tokenAddress],
                    wallet.address,
                    deadline,
                    { value: amountInParsed }
                );
                await tx.wait();
            } else {
                const token = getSignedContract(tokenAddress, ADAPTIVE_TOKEN_ABI, wallet.signer);
                const amountInParsed = parseUnits(amountIn, 18);

                const erc20Abi = ['function approve(address spender, uint256 amount) external returns (bool)'];
                const erc20Token = new Contract(tokenAddress, erc20Abi, wallet.signer);

                const approveTx = await erc20Token.approve(CONTRACT_ADDRESSES.PANCAKE_ROUTER, amountInParsed);
                await approveTx.wait();

                const amountOutMin = parseEther((Number(amountOut) * (1 - slippageDec)).toFixed(18));
                const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
                    amountInParsed,
                    amountOutMin,
                    [tokenAddress, WETH],
                    wallet.address,
                    deadline
                );
                await tx.wait();
            }

            setAmountIn('');
            setAmountOut('');
            fetchBalances();
        } catch (err: any) {
            console.error('Swap failed:', err);
            const reason = err?.reason || err?.message || 'Transaction failed or rejected.';

            if (reason.includes('INSUFFICIENT_LIQUIDITY') || reason.includes('PancakeLibrary: INSUFFICIENT_LIQUIDITY')) {
                setError('Insufficient liquidity in the PancakeSwap pool. The creator must add liquidity.');
            } else {
                setError(reason);
            }
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20">
                <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin mb-4" />
                <p className="text-gold font-bold tracking-widest uppercase">Initializing Vault...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-[100px] pb-20 px-4 flex flex-col items-center animate-in fade-in duration-1000">

            <div className="w-full max-w-4xl flex items-center mb-8">
                <Link href="/explore" className="text-muted hover:text-gold flex items-center gap-2 font-bold tracking-widest uppercase text-sm transition-colors">
                    <ChevronLeft size={16} /> Back to Explorer
                </Link>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Side: Token Info & Chart Placeholder */}
                <div className="lg:col-span-7 luxury-card p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-secondary border border-gold/20 rounded-xl flex items-center justify-center">
                                <Droplets className="text-gold" size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-primary tracking-tight">{tokenName}</h1>
                                <p className="text-gold font-bold tracking-widest text-sm">{tokenSymbol} / BNB</p>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-secondary/50 border border-primary/5 rounded-2xl">
                            <div className="flex items-start gap-3">
                                <Info className="text-sky-400 shrink-0 mt-0.5" size={18} />
                                <div className="text-sm">
                                    <p className="text-primary font-bold mb-1">New Token Liquidity Notice</p>
                                    <p className="text-muted">
                                        If you just deployed this token, you currently hold 100% of the supply. To allow others to trade, you must add initial liquidity (BNB + {tokenSymbol}) on PancakeSwap Testnet.
                                    </p>
                                    <a
                                        href={`https://pancakeswap.finance/add/BNB/${tokenAddress}?chain=bscTestnet`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sky-400 hover:text-sky-300 font-bold mt-2 inline-block border-b border-sky-400/30"
                                    >
                                        Add Liquidity on PancakeSwap ↗
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 h-64 flex flex-col items-center justify-center border border-dashed border-primary/10 rounded-2xl bg-primary/[0.02]">
                        <TrendingUp className="text-muted mb-4" size={48} opacity={0.2} />
                        <p className="text-muted font-bold tracking-widest text-sm uppercase">Chart Data Unavailable</p>
                        <p className="text-muted/50 text-xs mt-2">Awaiting sufficient market volume</p>
                    </div>
                </div>

                {/* Right Side: Swap Interface */}
                <div className="lg:col-span-5 luxury-card p-1">
                    <div className="bg-secondary/40 backdrop-blur-xl rounded-[1.4rem] p-6 h-full border border-primary/5">

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-primary tracking-tight">Swap Terminal</h2>
                            <button
                                className="text-muted hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5"
                                title="Slippage Settings"
                            >
                                <Settings size={20} />
                            </button>
                        </div>

                        <div className="flex bg-primary/5 p-1 rounded-xl mb-6">
                            <button
                                className={`flex-1 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-all ${isBuy ? 'bg-gold text-secondary shadow-[0_0_20px_rgba(255,215,0,0.1)]' : 'text-muted hover:text-primary'}`}
                                onClick={() => setIsBuy(true)}
                            >
                                Buy
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-all ${!isBuy ? 'bg-gold text-secondary shadow-[0_0_20px_rgba(255,215,0,0.1)]' : 'text-muted hover:text-primary'}`}
                                onClick={() => setIsBuy(false)}
                            >
                                Sell
                            </button>
                        </div>

                        <div className="space-y-2 mb-2">
                            <div className="flex justify-between text-sm px-1">
                                <span className="text-muted font-bold tracking-widest text-xs">YOU PAY</span>
                                <span className="text-primary font-bold text-xs">Balance: {isBuy ? Number(bnbBalance).toFixed(4) : Number(tokenBalance).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center bg-primary/5 border border-primary/10 rounded-2xl p-4 focus-within:border-gold/30 transition-colors">
                                <input
                                    type="number"
                                    className="bg-transparent border-none outline-none text-3xl font-bold text-primary w-full"
                                    placeholder="0"
                                    value={amountIn}
                                    onChange={(e) => setAmountIn(e.target.value)}
                                />
                                <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-xl border border-primary/5 shrink-0">
                                    <span className="font-bold text-primary">{isBuy ? 'BNB' : tokenSymbol}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center -my-3 relative z-10">
                            <button
                                className="bg-secondary border border-primary/10 p-2 rounded-xl text-gold hover:border-gold/50 hover:bg-gold/5 transition-all cursor-pointer shadow-lg"
                                onClick={() => { setIsBuy(!isBuy); setAmountIn(amountOut); }}
                            >
                                <ArrowDown size={18} />
                            </button>
                        </div>

                        <div className="space-y-2 mb-6 mt-2">
                            <div className="flex justify-between text-sm px-1">
                                <span className="text-muted font-bold tracking-widest text-xs">YOU RECEIVE (EST.)</span>
                                <span className="text-primary font-bold text-xs">Balance: {!isBuy ? Number(bnbBalance).toFixed(4) : Number(tokenBalance).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center bg-primary/5 border border-primary/10 rounded-2xl p-4">
                                <input
                                    type="text"
                                    readOnly
                                    className="bg-transparent border-none outline-none text-3xl font-bold text-muted w-full cursor-not-allowed"
                                    placeholder="0"
                                    value={amountOut}
                                />
                                <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-xl border border-primary/5 shrink-0 opacity-70">
                                    <span className="font-bold text-primary">{!isBuy ? 'BNB' : tokenSymbol}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6 text-xs px-2">
                            <span className="text-muted font-bold tracking-widest">SLIPPAGE TOLERANCE</span>
                            <span className="text-gold font-bold">{slippage}%</span>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm">
                                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                <p className="leading-relaxed">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleSwap}
                            disabled={loading || !amountIn || Number(amountIn) <= 0 || !!error}
                            className="w-full bg-gradient-to-r from-gold to-yellow-500 text-secondary font-black tracking-widest text-lg py-5 rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:hover:shadow-none uppercase group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isBuy ? 'Execute Buy Order' : 'Execute Sell Order'}
                                    <Zap size={18} className="group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}
