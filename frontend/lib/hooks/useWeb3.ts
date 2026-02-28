import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';

const STORAGE_KEY = 'evolaunch_wallet_connected';

interface ConnectedWallet {
  address: string;
  chainId: number;
  provider: BrowserProvider | null;
  signer: any;
  balance: string;
}

export const useWeb3 = () => {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false); // true once auto-reconnect attempt is done

  /** Core connect logic (shared by manual + auto-reconnect) */
  const doConnect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask not installed');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      let network = await provider.getNetwork();

      if (network.chainId !== BigInt(97)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x61' }],
          });
          const newProvider = new BrowserProvider(window.ethereum);
          network = await newProvider.getNetwork();
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x61',
                  chainName: 'BSC Testnet',
                  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                  blockExplorerUrls: ['https://testnet.bscscan.com'],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balanceWei = await provider.getBalance(address);
      const { formatEther } = await import('ethers');
      const balance = formatEther(balanceWei);

      setWallet({
        address,
        chainId: Number(network.chainId),
        provider,
        signer,
        balance: parseFloat(balance).toFixed(4),
      });

      // Persist connection
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (err: any) {
      console.error('Connection Error:', err);
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  /** Manual connect (prompts MetaMask) */
  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask not installed');
      return;
    }
    // Request accounts first (triggers MetaMask popup)
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    await doConnect();
  }, [doConnect]);

  /** Manual disconnect */
  const disconnectWallet = useCallback(() => {
    setWallet(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x61',
                chainName: 'BSC Testnet',
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                blockExplorerUrls: ['https://testnet.bscscan.com'],
              },
            ],
          });
        } catch (addError: any) {
          setError(addError.message);
        }
      }
    }
  }, []);

  // Auto-reconnect on page load if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem(STORAGE_KEY);
    if (wasConnected === 'true' && window.ethereum) {
      // Silently check if still authorized (no popup)
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            doConnect().finally(() => setChecked(true));
          } else {
            // Was connected but user revoked access in MetaMask
            localStorage.removeItem(STORAGE_KEY);
            setChecked(true);
          }
        })
        .catch(() => setChecked(true));
    } else {
      setChecked(true);
    }
  }, [doConnect]);

  // Listen for account/chain changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleChange = () => {
        if (localStorage.getItem(STORAGE_KEY) === 'true') {
          doConnect();
        } else {
          window.location.reload();
        }
      };
      window.ethereum.on('chainChanged', handleChange);
      window.ethereum.on('accountsChanged', handleChange);
      return () => {
        window.ethereum?.removeListener('chainChanged', handleChange);
        window.ethereum?.removeListener('accountsChanged', handleChange);
      };
    }
  }, [doConnect]);

  return {
    wallet,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    isConnected: !!wallet,
    checked, // true once auto-reconnect attempt is done
  };
};
