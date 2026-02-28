'use client';

import { useState, useEffect } from 'react';
import { getLaunches } from '../api';

/**
 * Hook to fetch all launched tokens from the backend API.
 * Backend stores tokens in MongoDB — works for all users, not just the deployer.
 */
export function useLaunches() {
    const [launches, setLaunches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadAll = async () => {
        setLoading(true);
        try {
            const data = await getLaunches();
            setLaunches(data);
        } catch (err) {
            console.warn('[useLaunches] Failed:', err);
            setError((err as Error).message);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadAll();
    }, []);

    return { launches, loading, error, refresh: loadAll };
}
