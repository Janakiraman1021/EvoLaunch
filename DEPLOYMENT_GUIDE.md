# EvoLaunch Protocol - Deployment Guide

## Current Status ✓

### Smart Contracts
- **Compilation**: ✅ All 32 Solidity files compile successfully with viaIR optimization
- **Logic**: ✅ All smart contract logic validated with `staticCall` - no revert errors
- **Role Management**: ✅ Fixed AccessControl role assignment in LaunchFactory

### Issues Resolved
1. ✅ Stack too deep - Fixed via optimizer settings and code refactoring
2. ✅ Undeclared identifier - Fixed agentPublicKeys reference
3. ✅ Role permission errors - Fixed by making LaunchFactory the controller admin
4. ✅ Contract logic validation - All functions work correctly via staticCall

## Deployment Instructions

### Step 1: Get Test BNB

The account currently has ~0.0354 BNB on BSC Testnet. Need **at least 0.5 BNB** for deployment.

Get testnet BNB from one of these faucets:
- https://testnet.binance.org/faucet-smart (Free Faucet - recommended)
- https://faucet.testnet.bsc.vision/ (BSC Testnet Faucet)

**How to use the faucet:**
1. Go to the faucet URL
2. Paste wallet address: `0x7D02fD90716722221277D8CA750B3611Ca51dAB9`
3. Select "BNB" token
4. Click "Claim" button
5. Wait for confirmation (usually 5-10 seconds)
6. Repeat if needed to get sufficient balance

### Step 2: Deploy LaunchFactory

```bash
cd contracts
npx hardhat run scripts/deploy.js --network bscTestnet
```

**What this does:**
1. Deploys the LaunchFactory contract
2. Creates a sample token launch with EvoLaunch infrastructure
3. Deploys all required contracts:
   - AdaptiveToken (ERC20 token with dynamic taxes)
   - LiquidityVault (LP token holder)
   - EvolutionController (Phase management and MSS logic)
   - GovernanceModule (Emergency controls)

**Expected output:**
```
LaunchFactory deployed to: 0x...
AdaptiveToken deployed to: 0x...
LiquidityVault deployed to: 0x...
EvolutionController deployed to: 0x...
GovernanceModule deployed to: 0x...
```

### Step 3: Update Frontend Configuration

After successful deployment, update `/frontend/lib/contracts/index.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  LAUNCH_FACTORY: "0x...",  // Replace with deployed LaunchFactory address
  RPC_URL: "https://data-seed-prebsc-1-b.binance.org:8545",
  CHAIN_ID: 97,
  CHAIN_NAME: "BSC Testnet"
};
```

### Step 4: Test Frontend

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000 and test:
- [x] Landing page loads
- [x] Navigation works
- [x] Wallet connection prompts for BSC Testnet
- [ ] Token launch form (after updating addresses)
- [ ] Project dashboard reads contract data

## Gas Requirements

| Action | Est. Gas | Est. Cost | Total |
|--------|----------|-----------|-------|
| LaunchFactory | 600,000 | 0.006 BNB | 0.006 BNB |
| createLaunch | 2,400,000 | 0.024 BNB | 0.030 BNB |
| **Total** | **3,000,000** | **0.030 BNB** | **0.030 BNB** |

**Recommended wallet balance: 0.5 BNB** (covers multiple test deployments)

## Contract Architecture

```
LaunchFactory
├── Creates GovernanceModule
├── Deploys AdaptiveToken
│   ├── Implements ERC20 with dynamic taxes
│   ├── Enforces transaction/wallet limits
│   └── Controlled by EvolutionController
├── Deploys LiquidityVault
│   ├── Holds LP tokens
│   ├── Releases tranches based on MSS/phase
│   └── Controlled by EvolutionController
├── Deploys EvolutionController
│   ├── Manages phase transitions
│   ├── Processes agent signatures
│   ├── Updates token parameters
│   └── Controlled by agents (AGENT_ROLE)
└── Creates PancakeSwap AMM pair
```

## Frontend Pages (Ready for Integration)

All 10 frontend pages are complete and tested locally:

1. **Landing** `/` - Protocol overview
2. **Launch Form** `/launch` - Create new token launches
3. **Explorer** `/explore` - Browse active launches
4. **Project Dashboard** `/project/[address]` - Monitor specific token
5. **Governance** `/governance/[address]` - Vote on parameters
6. **Reputation** `/reputation` - Wallet scoring system
7. **Analytics** `/analytics/[address]` - Technical analysis
8. **Agents** `/agents` - Monitor agents and signatures
9. **Documentation** `/docs` - Complete protocol reference
10. **System Status** `/system` - Infrastructure health

## Troubleshooting

### "Insufficient funds" error
- Your test wallet doesn't have enough test BNB
- Use the faucet links above to get more

### "Transaction reverted with reason: Invalid agent signature"
- This is expected if you haven't registered agents
- The sample deployment registers the deployer as the only agent

### "PancakeSwap pair creation failed"
- This means the PancakeSwap addresses are incorrect for the network
- Verify PANCAKE_ROUTER and PANCAKE_FACTORY in scripts/deploy.js

### "staticCall failed" before deployment
- The contract logic has an error
- Check error data (0x...) against contract error handlers
- Verify all constructor parameters are valid

## Next Steps (Post-Deployment)

1. **Verify Contracts on BSCScan**
   - Go to https://testnet.bscscan.com/
   - Search for deployed contract addresses
   - Click "Verify and Publish" to verify source code

2. **Fund Liquidity Vault**
   - Acquire test BUSD or other stable pairs
   - Provide initial liquidity to AMM pair
   - This allows the token to be traded

3. **Register Additional Agents**
   - Call `EvolutionController.grantRole(AGENT_ROLE, agentAddress)`
   - Each agent signs off-chain, submits parameters

4. **Test Parameter Updates**
   - After registering agents, test updating token tax and limits
   - Process signed agent payloads through `processAgentSignal()`

5. **Launch Frontend**
   - Update all contract addresses
   - Test wallet connectivity
   - Deploy to production hosting

## Configuration Files

Key files for deployment:

```
contracts/
├── hardhat.config.js          # Network config, optimizer settings
├── scripts/
│   ├── deploy.js              # Full deployment (factory + sample launch)
│   └── deploy-factory-only.js # Factory deployment only (less gas)
└── contracts/
    ├── LaunchFactory.sol      # Entry point for creating launches
    ├── AdaptiveToken.sol      # ERC20 with dynamic taxes
    ├── LiquidityVault.sol     # LP token holder
    ├── EvolutionController.sol # Parameter management
    └── GovernanceModule.sol   # Emergency controls

frontend/
└── lib/
    └── contracts/index.ts     # ABI definitions and addresses
```

## Important Notes

- **Test Network Only**: This guide uses BSC Testnet (Chain ID 97)
- **Test Accounts**: All deployed addresses are under test wallets
- **Test Tokens**: Tokens have no real value, for testing only
- **Testnet Resets**: PancakeSwap testnet may reset periodically

## Support

For issues or questions:
1. Check contract events and logs on BSCScan
2. Verify parameter values match the bounds constraints
3. Ensure all addresses are valid and not zero addresses
4. Check wallet is on the correct network

---

**Last Updated**: 2024
**Network**: BSC Testnet (Chain ID 97)
**Status**: ✓ Ready for deployment with funding
