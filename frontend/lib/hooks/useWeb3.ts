import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Contract } from 'ethers';

interface ConnectedWallet {
  address: string;
  chainId: number;
  provider: BrowserProvider | null;
  signer: any;
}

export const useWeb3 = () => {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask not installed');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      if (network.chainId !== 97) {
        // BSC Testnet chain ID
        setError('Please switch to BSC Testnet');
        setIsConnecting(false);
        return;
      }

      setWallet({
        address,
        chainId: network.chainId,
        provider,
        signer,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }], // BSC Testnet
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
                rpcUrls: ['https://data-seed-prebsc-1-b.binance.org:8545'],
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18,
                },
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

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('chainChanged', () => window.location.reload());
      window.ethereum.on('accountsChanged', () => window.location.reload());
    }
  }, []);

  return {
    wallet,
    isConnecting,
    error,
    connectWallet,
    switchNetwork,
    isConnected: !!wallet,
  };
};
