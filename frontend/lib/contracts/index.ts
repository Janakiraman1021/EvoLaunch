import { Contract, BrowserProvider, JsonRpcProvider, formatUnits } from 'ethers';

// ─── Contract ABIs ────────────────────────────────────────────────

export const LAUNCH_FACTORY_ABI = [
  `function createLaunch((string name, string symbol, uint256 totalSupply, uint256 initialSellTax, uint256 initialBuyTax, uint256 initialMaxTx, uint256 initialMaxWallet, uint256 minTax, uint256 maxTax, uint256 minMaxTx, uint256 minMaxWallet, address feeCollector, address[] agentPublicKeys) params) external payable returns (address)`,
  'event LaunchCreated(address indexed token, address vault, address controller, address governance, address ammPair)',
];

export const ADAPTIVE_TOKEN_ABI = [
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function sellTax() external view returns (uint256)',
  'function buyTax() external view returns (uint256)',
  'function maxTxAmount() external view returns (uint256)',
  'function maxWalletSize() external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function owner() external view returns (address)',
];

export const EVOLUTION_CONTROLLER_ABI = [
  'function currentPhase() external view returns (uint8)',
  'function currentMSS() external view returns (uint256)',
  'function lastUpdateTimestamp() external view returns (uint256)',
  'function phaseThresholds(uint256) external view returns (uint256)',
  'event PhaseTransitioned(uint8 from, uint8 to, uint256 mss)',
  'event MSSUpdated(uint256 newMSS, uint256 timestamp)',
];

export const LIQUIDITY_VAULT_ABI = [
  'function totalReleased() external view returns (uint256)',
  'function isFrozen() external view returns (bool)',
  'function tranches(uint256) external view returns (uint256 amount, uint256 mssThreshold, uint8 phaseRequired)',
  'event TrancheReleased(uint256 index, uint256 amount)',
];

export const GOVERNANCE_MODULE_ABI = [
  'function paused() external view returns (bool)',
  'function hasRole(bytes32 role, address account) external view returns (bool)',
  'function GOVERNOR_ROLE() external view returns (bytes32)',
  'event AgentKeyUpdated(address oldKey, address newKey)',
  'event LogicFrozen(bool frozen)',
];

export const PANCAKE_ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
  'function WETH() external pure returns (address)'
];

// ─── Deployed Contract Addresses (BSC Testnet) ────────────────────

export const CONTRACT_ADDRESSES = {
  LAUNCH_FACTORY: '0xe5d0cc05BFDb99e4E4EF8665fB59eaC0B2B5D81f',
  ADAPTIVE_TOKEN: '0xb142FCD1fc79BE3EA60C1B83558f171033A0c12E',
  LIQUIDITY_VAULT: '0x383D77A86D51313e5C3F6f9feb372191FAEdA4fF',
  EVOLUTION_CONTROLLER: '0xC4D65495eB47AC8726Dad401d28A83C25B77f110',
  GOVERNANCE_MODULE: '0xfE63A74EcAC6BCaDF4078B7C53d01e2f511ff629',
  AMM_PAIR: '0x6FdFe8B580864A97Ae21f5Ba46046016FC3173DA',
  PANCAKE_ROUTER: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
  RPC_URL: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  CHAIN_ID: 97,
  CHAIN_NAME: 'BSC Testnet',
  BLOCK_EXPLORER: 'https://testnet.bscscan.com',
};

// ─── Phase Names ──────────────────────────────────────────────────

export const PHASE_NAMES: Record<number, string> = {
  0: 'Genesis',
  1: 'Growth',
  2: 'Expansion',
  3: 'Governance',
  4: 'Protective',
};

// ─── Provider (read-only, no wallet needed) ───────────────────────

let _readProvider: JsonRpcProvider | null = null;

export const getReadProvider = (): JsonRpcProvider => {
  if (!_readProvider) {
    _readProvider = new JsonRpcProvider(CONTRACT_ADDRESSES.RPC_URL);
  }
  return _readProvider;
};

// ─── Contract Getters ─────────────────────────────────────────────

export const getContract = (
  address: string,
  abi: string[],
  provider: BrowserProvider | JsonRpcProvider
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

/** Get read-only contract instances (no wallet required) */
export const getReadContracts = () => {
  const provider = getReadProvider();
  return {
    token: new Contract(CONTRACT_ADDRESSES.ADAPTIVE_TOKEN, ADAPTIVE_TOKEN_ABI, provider),
    controller: new Contract(CONTRACT_ADDRESSES.EVOLUTION_CONTROLLER, EVOLUTION_CONTROLLER_ABI, provider),
    vault: new Contract(CONTRACT_ADDRESSES.LIQUIDITY_VAULT, LIQUIDITY_VAULT_ABI, provider),
    governance: new Contract(CONTRACT_ADDRESSES.GOVERNANCE_MODULE, GOVERNANCE_MODULE_ABI, provider),
    factory: new Contract(CONTRACT_ADDRESSES.LAUNCH_FACTORY, LAUNCH_FACTORY_ABI, provider),
  };
};

// ─── On-Chain Data Fetchers ───────────────────────────────────────

export interface OnChainTokenData {
  name: string;
  symbol: string;
  totalSupply: string;
  sellTax: number;
  buyTax: number;
  maxTxAmount: string;
  maxWalletSize: string;
}

export interface OnChainPhaseData {
  phase: number;
  phaseName: string;
  mss: number;
  lastUpdate: number;
}

export interface OnChainVaultData {
  totalReleased: string;
  isFrozen: boolean;
}

export interface OnChainGovernanceData {
  paused: boolean;
}

/** Fetch token data from AdaptiveToken contract */
export async function fetchTokenData(): Promise<OnChainTokenData | null> {
  try {
    const { token } = getReadContracts();
    const [name, symbol, totalSupply, sellTax, buyTax, maxTx, maxWallet] = await Promise.all([
      token.name(),
      token.symbol(),
      token.totalSupply(),
      token.sellTax(),
      token.buyTax(),
      token.maxTxAmount(),
      token.maxWalletSize(),
    ]);
    return {
      name,
      symbol,
      totalSupply: formatUnits(totalSupply, 18),
      sellTax: Number(sellTax) / 100,
      buyTax: Number(buyTax) / 100,
      maxTxAmount: formatUnits(maxTx, 18),
      maxWalletSize: formatUnits(maxWallet, 18),
    };
  } catch (err) {
    console.warn('[Contracts] fetchTokenData failed:', (err as Error).message);
    return null;
  }
}

/** Fetch phase data from EvolutionController */
export async function fetchPhaseData(): Promise<OnChainPhaseData | null> {
  try {
    const { controller } = getReadContracts();
    const [phase, mss, lastUpdate] = await Promise.all([
      controller.currentPhase(),
      controller.currentMSS(),
      controller.lastUpdateTimestamp(),
    ]);
    return {
      phase: Number(phase),
      phaseName: PHASE_NAMES[Number(phase)] || 'Unknown',
      mss: Number(mss),
      lastUpdate: Number(lastUpdate),
    };
  } catch (err) {
    console.warn('[Contracts] fetchPhaseData failed:', (err as Error).message);
    return null;
  }
}

/** Fetch vault data from LiquidityVault */
export async function fetchVaultData(): Promise<OnChainVaultData | null> {
  try {
    const { vault } = getReadContracts();
    const [totalReleased, isFrozen] = await Promise.all([
      vault.totalReleased(),
      vault.isFrozen(),
    ]);
    return {
      totalReleased: formatUnits(totalReleased, 18),
      isFrozen,
    };
  } catch (err) {
    console.warn('[Contracts] fetchVaultData failed:', (err as Error).message);
    return null;
  }
}

/** Fetch governance data */
export async function fetchGovernanceData(): Promise<OnChainGovernanceData | null> {
  try {
    const { governance } = getReadContracts();
    const paused = await governance.paused();
    return { paused };
  } catch (err) {
    console.warn('[Contracts] fetchGovernanceData failed:', (err as Error).message);
    return null;
  }
}

/** Fetch user's token balance */
export async function fetchUserBalance(userAddress: string): Promise<string> {
  try {
    const { token } = getReadContracts();
    const balance = await token.balanceOf(userAddress);
    return formatUnits(balance, 18);
  } catch (err) {
    console.warn('[Contracts] fetchUserBalance failed:', (err as Error).message);
    return '0';
  }
}

// ─── Launched Token Registry (from events) ────────────────────────

export interface LaunchedToken {
  tokenAddress: string;
  vaultAddress: string;
  controllerAddress: string;
  governanceAddress: string;
  ammPairAddress: string;
  name: string;
  symbol: string;
  totalSupply: string;
  sellTax: number;
  buyTax: number;
  phase: number;
  phaseName: string;
  mss: number;
  blockNumber: number;
}

/** Fetch all tokens launched via the LaunchFactory by querying LaunchCreated events */
export async function fetchAllLaunches(): Promise<LaunchedToken[]> {
  try {
    const provider = getReadProvider();
    const factory = new Contract(CONTRACT_ADDRESSES.LAUNCH_FACTORY, LAUNCH_FACTORY_ABI, provider);

    // BSC Testnet RPCs limit getLogs to ~5000 block ranges.
    // Scan backwards from current block in chunks.
    const currentBlock = await provider.getBlockNumber();
    const CHUNK_SIZE = 5000;
    const MAX_SCAN_DEPTH = 50000; // scan up to 50k blocks back
    const startBlock = Math.max(0, currentBlock - MAX_SCAN_DEPTH);

    console.log(`[Launches] Scanning blocks ${startBlock} → ${currentBlock} for LaunchCreated events...`);

    const allEvents: any[] = [];
    const filter = factory.filters.LaunchCreated();

    for (let from = startBlock; from <= currentBlock; from += CHUNK_SIZE) {
      const to = Math.min(from + CHUNK_SIZE - 1, currentBlock);
      try {
        const events = await factory.queryFilter(filter, from, to);
        if (events.length > 0) {
          console.log(`[Launches] Found ${events.length} events in blocks ${from}-${to}`);
          allEvents.push(...events);
        }
      } catch (chunkErr) {
        console.warn(`[Launches] Chunk ${from}-${to} failed:`, (chunkErr as Error).message);
      }
    }

    console.log(`[Launches] Total events found: ${allEvents.length}`);

    if (allEvents.length === 0) return [];

    const launches: LaunchedToken[] = [];

    for (const event of allEvents) {
      const log = event as any;
      const tokenAddr = log.args?.[0] || log.args?.token;
      const vaultAddr = log.args?.[1] || log.args?.vault;
      const controllerAddr = log.args?.[2] || log.args?.controller;
      const govAddr = log.args?.[3] || log.args?.governance;
      const pairAddr = log.args?.[4] || log.args?.ammPair;

      if (!tokenAddr) continue;

      console.log(`[Launches] Reading on-chain data for token at ${tokenAddr}...`);

      // Read token data on-chain
      let name = 'Unknown', symbol = '???', totalSupply = '0', sellTax = 0, buyTax = 0;
      let phase = 0, mss = 0;

      try {
        const tokenContract = new Contract(tokenAddr, ADAPTIVE_TOKEN_ABI, provider);
        const [n, s, ts, st, bt] = await Promise.all([
          tokenContract.name(),
          tokenContract.symbol(),
          tokenContract.totalSupply(),
          tokenContract.sellTax(),
          tokenContract.buyTax(),
        ]);
        name = n; symbol = s;
        totalSupply = formatUnits(ts, 18);
        sellTax = Number(st) / 100;
        buyTax = Number(bt) / 100;
        console.log(`[Launches] Token: ${name} (${symbol}), supply: ${totalSupply}`);
      } catch (e) {
        console.warn(`[Launches] Failed to read token at ${tokenAddr}:`, (e as Error).message);
      }

      // Read phase data if controller exists
      try {
        if (controllerAddr) {
          const ctrl = new Contract(controllerAddr, EVOLUTION_CONTROLLER_ABI, provider);
          const [p, m] = await Promise.all([ctrl.currentPhase(), ctrl.currentMSS()]);
          phase = Number(p);
          mss = Number(m);
        }
      } catch { /* controller read failed */ }

      launches.push({
        tokenAddress: tokenAddr,
        vaultAddress: vaultAddr || '',
        controllerAddress: controllerAddr || '',
        governanceAddress: govAddr || '',
        ammPairAddress: pairAddr || '',
        name,
        symbol,
        totalSupply,
        sellTax,
        buyTax,
        phase,
        phaseName: PHASE_NAMES[phase] || 'Genesis',
        mss,
        blockNumber: log.blockNumber || 0,
      });
    }

    console.log(`[Launches] Successfully loaded ${launches.length} launched tokens`);
    return launches;
  } catch (err) {
    console.error('[Launches] fetchAllLaunches failed:', (err as Error).message);
    return [];
  }
}

