/**
 * Local token registry — stores launched tokens in localStorage
 * as a reliable alternative to on-chain event queries (BSC testnet RPCs
 * have strict getLogs limits that often return empty results).
 */

import { LaunchedToken } from './contracts';

const STORAGE_KEY = 'evolaunch_launched_tokens';

/** Get all locally stored launched tokens */
export function getStoredLaunches(): LaunchedToken[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

/** Save a newly launched token to localStorage */
export function saveNewLaunch(token: LaunchedToken): void {
    const existing = getStoredLaunches();
    // Avoid duplicates by address
    if (existing.some(t => t.tokenAddress.toLowerCase() === token.tokenAddress.toLowerCase())) {
        return;
    }
    existing.push(token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

/** Merge on-chain launches with locally stored ones (dedup by address) */
export function mergeLaunches(onChain: LaunchedToken[], local: LaunchedToken[]): LaunchedToken[] {
    const map = new Map<string, LaunchedToken>();
    // On-chain data takes priority
    for (const t of local) map.set(t.tokenAddress.toLowerCase(), t);
    for (const t of onChain) map.set(t.tokenAddress.toLowerCase(), t);
    return Array.from(map.values());
}
