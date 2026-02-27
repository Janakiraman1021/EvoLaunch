import { Contract, BrowserProvider } from 'ethers';

// LaunchFactory ABI - Updated to use struct parameter
export const LAUNCH_FACTORY_ABI = [
  `function createLaunch((string name, string symbol, uint256 totalSupply, uint256 initialSellTax, uint256 initialBuyTax, uint256 initialMaxTx, uint256 initialMaxWallet, uint256 minTax, uint256 maxTax, uint256 minMaxTx, uint256 minMaxWallet, address feeCollector, address[] agentPublicKeys) params) external payable returns (address)`,
  'event LaunchCreated(address indexed token, address vault, address controller, address governance, address ammPair)',
];

// AdaptiveToken ABI
export const ADAPTIVE_TOKEN_ABI = [
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function sellTax() external view returns (uint256)',
  'function buyTax() external view returns (uint256)',
  'function maxTxAmount() external view returns (uint256)',
  'function maxWalletSize() external view returns (uint256)',
];

// EvolutionController ABI
export const EVOLUTION_CONTROLLER_ABI = [
  'function currentPhase() external view returns (uint8)',
  'function currentMSS() external view returns (uint256)',
  'function lastUpdateTimestamp() external view returns (uint256)',
  'event PhaseTransitioned(uint8 from, uint8 to, uint256 mss)',
];

// LiquidityVault ABI
export const LIQUIDITY_VAULT_ABI = [
  'function totalReleased() external view returns (uint256)',
  'function isFrozen() external view returns (bool)',
  'function tranches(uint256) external view returns (uint256 amount, uint256 mssThreshold, uint8 phaseRequired)',
  'event TrancheReleased(uint256 index, uint256 amount)',
];

// Key contract addresses (update with your deployed addresses)
export const CONTRACT_ADDRESSES = {
  LAUNCH_FACTORY: '0x2C95eEeF7d0F5Be75dce165aC7689B09Fd06FEF6', // Deployed to BSC Testnet
  RPC_URL: 'https://data-seed-prebsc-1-b.binance.org:8545',
  CHAIN_ID: 97,
  CHAIN_NAME: 'BSC Testnet',
};

export const getContract = (
  address: string,
  abi: string[],
  provider: BrowserProvider
) => {
  return new Contract(address, abi, provider);
};

export const getSignedContract = (
  address: string,
  abi: string[],
  signer: any
) => {
  return new Contract(address, abi, signer);
};
