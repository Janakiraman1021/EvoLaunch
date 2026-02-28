/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Extend the global Window interface to include the `ethereum` property
 * injected by MetaMask and other Web3 wallet providers.
 */
interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
  };
}
