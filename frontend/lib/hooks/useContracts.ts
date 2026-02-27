'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    fetchTokenData,
    fetchPhaseData,
    fetchVaultData,
    fetchGovernanceData,
    fetchUserBalance,
    OnChainTokenData,
    OnChainPhaseData,
    OnChainVaultData,
    OnChainGovernanceData,
    CONTRACT_ADDRESSES,
} from '../contracts';

export interface ContractState {
    token: OnChainTokenData | null;
    phase: OnChainPhaseData | null;
    vault: OnChainVaultData | null;
    governance: OnChainGovernanceData | null;
    userBalance: string;
    loading: boolean;
    error: string | null;
    lastFetched: number;
}

/**
 * Hook to read on-chain data from all deployed EvoLaunch contracts.
 * No wallet connection required — uses read-only JsonRpcProvider.
 * Pass walletAddress to also fetch user's token balance.
 */
export function useContracts(walletAddress?: string | null) {
    const [state, setState] = useState<ContractState>({
        token: null,
        phase: null,
        vault: null,
        governance: null,
        userBalance: '0',
        loading: true,
        error: null,
        lastFetched: 0,
    });

    const fetchAll = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const [token, phase, vault, governance] = await Promise.all([
                fetchTokenData(),
                fetchPhaseData(),
                fetchVaultData(),
                fetchGovernanceData(),
            ]);

            let userBalance = '0';
            if (walletAddress) {
                userBalance = await fetchUserBalance(walletAddress);
            }

            setState({
                token,
                phase,
                vault,
                governance,
                userBalance,
                loading: false,
                error: null,
                lastFetched: Date.now(),
            });
        } catch (err) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: (err as Error).message,
            }));
        }
    }, [walletAddress]);

    useEffect(() => {
        fetchAll();

        // Poll every 30 seconds for live updates
        const interval = setInterval(fetchAll, 30000);
        return () => clearInterval(interval);
    }, [fetchAll]);

    return { ...state, refresh: fetchAll, addresses: CONTRACT_ADDRESSES };
}
