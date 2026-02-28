'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowDown, Zap, AlertCircle } from 'lucide-react';
import { useWeb3 } from '../lib/hooks/useWeb3';
import { CONTRACT_ADDRESSES, PANCAKE_ROUTER_ABI, ADAPTIVE_TOKEN_ABI, getSignedContract, getReadProvider } from '../lib/contracts';
import { Contract, parseEther, parseUnits, formatUnits, formatEther } from 'ethers';

interface SwapModalProps {
    tokenAddress: string;
    tokenSymbol: string;
    ammPairAddress: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function SwapModal({ tokenAddress, tokenSymbol, ammPairAddress, isOpen, onClose }: SwapModalProps) {
    const { wallet, isConnected } = useWeb3();
    const [isBuy, setIsBuy] = useState(true);
    const [amountIn, setAmountIn] = useState('');
    const [amountOut, setAmountOut] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bnbBalance, setBnbBalance] = useState('0');
    const [tokenBalance, setTokenBalance] = useState('0');

    useEffect(() => {
        if (isOpen && wallet?.address) {
            fetchBalances();
        }
    }, [isOpen, wallet?.address]);

    useEffect(() => {
        if (amountIn && Number(amountIn) > 0) {
            estimateOut();
        } else {
            setAmountOut('');
        }
    }, [amountIn, isBuy]);

    const fetchBalances = async () => {
        if (!wallet?.address) return;
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
            if (!ammPairAddress || ammPairAddress === '0x0000000000000000000000000000000000000000') {
                setError('Liquidity pair not created yet');
                return;
            }

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
            setError('Insufficient liquidity or impact too high');
            setAmountOut('');
        }
    };

    const handleSwap = async () => {
        if (!wallet?.signer) {
            setError('Please connect wallet');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const router = getSignedContract(CONTRACT_ADDRESSES.PANCAKE_ROUTER, PANCAKE_ROUTER_ABI, wallet.signer);
            const WETH = await router.WETH();
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 mins

            if (isBuy) {
                const amountInParsed = parseEther(amountIn);
                const amountOutMin = parseUnits((Number(amountOut) * 0.9).toFixed(18), 18); // 10% slippage tolerance

                const tx = await router.swapExactETHForTokens(
                    amountOutMin,
                    [WETH, tokenAddress],
                    wallet.address,
                    deadline,
                    { value: amountInParsed }
                );
                await tx.wait();
            } else {
                // Need to approve first
                const token = getSignedContract(tokenAddress, ADAPTIVE_TOKEN_ABI, wallet.signer);
                const amountInParsed = parseUnits(amountIn, 18);

                // Ensure ERC20 approve ABI exists in ADAPTIVE_TOKEN_ABI in index.ts, otherwise add it.
                // Assuming it's standard ERC20, we'll cast to a generic abi.
                const erc20Abi = ['function approve(address spender, uint256 amount) external returns (bool)'];
                const erc20Token = new Contract(tokenAddress, erc20Abi, wallet.signer);

                const approveTx = await erc20Token.approve(CONTRACT_ADDRESSES.PANCAKE_ROUTER, amountInParsed);
                await approveTx.wait();

                const amountOutMin = parseEther((Number(amountOut) * 0.9).toFixed(18)); // 10% slippage
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
            onClose();
        } catch (err: any) {
            console.error('Swap failed:', err);
            const reason = err?.reason || err?.message || 'Swap failed. Increase slippage or try smaller amount.';
            setError(reason);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-secondary border border-gold/20 rounded-3xl p-6 w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/50 via-gold to-gold/50" />

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-primary tracking-tight">Trade {tokenSymbol}</h2>
                    <button onClick={onClose} className="text-muted hover:text-primary transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex bg-primary/5 p-1 rounded-xl mb-6">
                    <button
                        className={`flex-1 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-all ${isBuy ? 'bg-gold text-secondary' : 'text-muted hover:text-primary'}`}
                        onClick={() => setIsBuy(true)}
                    >
                        Buy
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-all ${!isBuy ? 'bg-gold text-secondary' : 'text-muted hover:text-primary'}`}
                        onClick={() => setIsBuy(false)}
                    >
                        Sell
                    </button>
                </div>

                <div className="space-y-2 mb-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted font-bold tracking-widest">YOU PAY</span>
                        <span className="text-primary font-bold">Balance: {isBuy ? Number(bnbBalance).toFixed(4) : Number(tokenBalance).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center bg-primary/5 border border-primary/10 rounded-2xl p-4">
                        <input
                            type="number"
                            className="bg-transparent border-none outline-none text-2xl font-bold text-primary w-full"
                            placeholder="0.0"
                            value={amountIn}
                            onChange={(e) => setAmountIn(e.target.value)}
                        />
                        <span className="font-bold text-gold ml-2">{isBuy ? 'BNB' : tokenSymbol}</span>
                    </div>
                </div>

                <div className="flex justify-center -my-3 relative z-10">
                    <button
                        className="bg-secondary border border-primary/10 p-2 rounded-xl text-gold hover:border-gold/30 transition-all cursor-pointer"
                        onClick={() => { setIsBuy(!isBuy); setAmountIn(amountOut); }}
                    >
                        <ArrowDown size={20} />
                    </button>
                </div>

                <div className="space-y-2 mb-8 mt-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted font-bold tracking-widest">YOU RECEIVE (EST.)</span>
                        <span className="text-primary font-bold">Balance: {!isBuy ? Number(bnbBalance).toFixed(4) : Number(tokenBalance).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center bg-primary/5 border border-primary/10 rounded-2xl p-4">
                        <input
                            type="text"
                            readOnly
                            className="bg-transparent border-none outline-none text-2xl font-bold text-muted w-full cursor-not-allowed"
                            placeholder="0.0"
                            value={amountOut}
                        />
                        <span className="font-bold text-gold ml-2">{!isBuy ? 'BNB' : tokenSymbol}</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 flex items-start gap-3 text-sm">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                <button
                    onClick={handleSwap}
                    disabled={loading || !amountIn || Number(amountIn) <= 0 || !!error}
                    className="w-full bg-gold text-secondary font-black tracking-widest text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
                    ) : (
                        <>
                            {isBuy ? 'Confirm Buy' : 'Confirm Sell'} <Zap size={18} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
