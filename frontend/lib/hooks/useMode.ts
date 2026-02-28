import { useState, useEffect } from 'react';

export type AppMode = 'human' | 'ai' | null;

export function useMode() {
  const [mode, setModeState] = useState<AppMode>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const savedMode = localStorage.getItem('evolaunch-mode') as AppMode;
    if (savedMode === 'human' || savedMode === 'ai') {
      setModeState(savedMode);
    }
    setIsInitialized(true);
  }, []);

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
    if (newMode) {
      localStorage.setItem('evolaunch-mode', newMode);
    } else {
      localStorage.removeItem('evolaunch-mode');
    }
  };

  return { mode, setMode, isInitialized };
}
