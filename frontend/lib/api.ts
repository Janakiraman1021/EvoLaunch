/**
 * @module lib/api
 * @desc Centralized API client for the EvoLaunch frontend.
 *       All backend calls go through here with typed responses and error handling.
 *       Falls back gracefully when backend is unavailable.
 */

const API_BASE = typeof window !== 'undefined'
    // ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
    // : 'http://localhost:5000';const API_BASE = typeof window !== 'undefined'
    
    ? (process.env.NEXT_PUBLIC_API_URL || 'https://evolaunch.onrender.com')
    : 'https://evolaunch.onrender.com';

// ─── Types ────────────────────────────────────────────────────────

export interface LaunchStatus {
    launch: {
        tokenAddress: string;
        name: string;
        symbol: string;
        phase: string;
        totalSupply: string;
        [key: string]: any;
    } | null;
    mss: number;
    logs: AgentLogEntry[];
}

export interface MSSHistoryPoint {
    timestamp: number;
    mss: number;
    tokenAddress: string;
    [key: string]: any;
}

export interface AgentLogEntry {
    agent: string;
    action: string;
    timestamp: number;
    tokenAddress: string;
    result: string;
    [key: string]: any;
}

export interface PhaseTransitionEntry {
    from: number;
    to: number;
    mss: number;
    timestamp: number;
    tokenAddress: string;
}

export interface ReputationData {
    walletAddress: string;
    score: number;
    allocationWeight: number;
    holdingHours: number;
    dumpCount: number;
    [key: string]: any;
}

export interface HealthStatus {
    status: string;
    uptime: number;
    rpcConnected: boolean;
    lastBlock: number;
    agentsRunning: number;
    [key: string]: any;
}

export interface RollingMetrics {
    price: number;
    volume24h: number;
    liquidity: number;
    holders: number;
    marketCap: number;
    [key: string]: any;
}

export interface GovernanceEvent {
    eventType: string;
    timestamp: number;
    data: any;
    tokenAddress: string;
}

export interface LiquidityUnlock {
    trancheIndex: number;
    amount: string;
    timestamp: number;
    tokenAddress: string;
}

// ─── Fetcher ──────────────────────────────────────────────────────

async function fetchAPI<T>(endpoint: string, fallback: T): Promise<T> {
    try {
        const res = await fetch(`${API_BASE}/api${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn(`[API] ${endpoint} unavailable, using fallback:`, (err as Error).message);
        return fallback;
    }
}

// ─── Endpoints ────────────────────────────────────────────────────

/** Get system health */
export const getHealth = (): Promise<HealthStatus> =>
    fetchAPI('/health', {
        status: 'unknown',
        uptime: 0,
        rpcConnected: false,
        lastBlock: 0,
        agentsRunning: 0,
    });

/** Get launch status for a token address */
export const getStatus = (tokenAddress: string): Promise<LaunchStatus> =>
    fetchAPI(`/status/${tokenAddress}`, { launch: null, mss: 0, logs: [] });

/** Get MSS history for charts */
export const getHistory = (tokenAddress: string, limit = 100): Promise<MSSHistoryPoint[]> =>
    fetchAPI(`/history/${tokenAddress}?limit=${limit}`, []);

/** Get agent logs */
export const getAgentLogs = (tokenAddress: string): Promise<AgentLogEntry[]> =>
    fetchAPI(`/agent-logs/${tokenAddress}`, []);

/** Get phase transition history */
export const getPhaseHistory = (tokenAddress: string): Promise<PhaseTransitionEntry[]> =>
    fetchAPI(`/phase-history/${tokenAddress}`, []);

/** Get rolling market metrics */
export const getMetrics = (tokenAddress: string): Promise<RollingMetrics> =>
    fetchAPI(`/metrics/${tokenAddress}`, {
        price: 0,
        volume24h: 0,
        liquidity: 0,
        holders: 0,
        marketCap: 0,
    });

/** Get wallet reputation */
export const getReputation = (walletAddress: string): Promise<ReputationData> =>
    fetchAPI(`/reputation/${walletAddress}`, {
        walletAddress,
        score: 50,
        allocationWeight: 0.5,
        holdingHours: 0,
        dumpCount: 0,
    });

/** Get governance events */
export const getGovernanceEvents = (tokenAddress: string): Promise<GovernanceEvent[]> =>
    fetchAPI(`/governance-events/${tokenAddress}`, []);

/** Get liquidity unlocks */
export const getLiquidityUnlocks = (tokenAddress: string): Promise<LiquidityUnlock[]> =>
    fetchAPI(`/liquidity-unlocks/${tokenAddress}`, []);

/** Convenience: get token address from env */
export const getTokenAddress = (): string =>
    (typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_TOKEN_ADDRESS : '') || '';

/** Get all launched tokens */
export const getLaunches = (): Promise<any[]> =>
    fetchAPI('/launches', []);

/** Register a newly launched token */
export const postLaunch = async (data: any): Promise<any> => {
    try {
        const res = await fetch(`${API_BASE}/api/launches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn('[API] POST /launches failed:', (err as Error).message);
        return null;
    }
};

export default {
    getHealth,
    getStatus,
    getHistory,
    getAgentLogs,
    getPhaseHistory,
    getMetrics,
    getReputation,
    getGovernanceEvents,
    getLiquidityUnlocks,
    getTokenAddress,
    getLaunches,
    postLaunch,
};
