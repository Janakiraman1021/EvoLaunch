
# 🚀 EvoLaunch Protocol

### **AI-Powered Adaptive Token Launch Platform on BNB Smart Chain**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)](https://python.org/)
[![BNB Chain](https://img.shields.io/badge/BNB_Chain-Testnet-F0B90B?logo=binance)](https://www.bnbchain.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Groq AI](https://img.shields.io/badge/Groq_AI-LLaMA_3.3-00B4D8)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

**EvoLaunch Protocol** is a next-generation decentralized token launch platform that uses
**real-time AI agents** to dynamically adapt token parameters based on live market conditions.
Instead of static tokenomics, EvoLaunch continuously monitors on-chain activity and
autonomously adjusts sell taxes, buy taxes, transaction limits, and liquidity unlocks
to protect investors and promote organic growth.

[Architecture](#-architecture) •
[Smart Contracts](#-smart-contracts) •
[AI Agents](#-ai-agent-intelligence-layer) •
[Backend](#-backend-services) •
[API Reference](#-api-reference) •
[Deployment](#-deployment) •
[Security](#-security-model)

</div>

---

## 📑 Table of Contents

1.  [Project Overview](#-project-overview)
2.  [Key Features](#-key-features)
3.  [Architecture](#-architecture)
    - [System Diagram](#system-diagram)
    - [Data Flow](#data-flow)
    - [Technology Stack](#technology-stack)
4.  [Smart Contracts](#-smart-contracts)
    - [AdaptiveToken.sol](#adaptivetokensol)
    - [EvolutionController.sol](#evolutioncontrollersol)
    - [LiquidityVault.sol](#liquidityvaultsol)
    - [GovernanceModule.sol](#governancemodulesol)
    - [LaunchFactory.sol](#launchfactorysol)
    - [Contract Addresses](#contract-addresses-bsc-testnet)
5.  [AI Agent Intelligence Layer](#-ai-agent-intelligence-layer)
    - [Market Intelligence Agent](#1-market-intelligence-agent)
    - [Phase Evolution Agent](#2-phase-evolution-agent)
    - [Liquidity Orchestrator Agent](#3-liquidity-orchestrator-agent)
    - [Reputation Agent](#4-reputation-agent)
    - [Groq AI Integration](#groq-ai-integration)
    - [MSS Formula](#market-stability-score-mss-formula)
6.  [Backend Services](#-backend-services)
    - [Orchestrator Engine](#orchestrator-engine)
    - [Event Listener](#blockchain-event-listener)
    - [Market Data Aggregator](#market-data-aggregator)
    - [Transaction Broadcaster](#transaction-broadcaster)
    - [Signing Service](#signing-service)
    - [Health Monitor](#health-monitor)
    - [Governance Monitor](#governance-monitor)
    - [Reputation Service](#reputation-service)
    - [Liquidity Service](#liquidity-service)
    - [Python Bridge](#python-bridge)
7.  [Database Models](#-database-models)
8.  [API Reference](#-api-reference)
9.  [Frontend](#-frontend)
10. [Installation](#-installation)
11. [Configuration](#-configuration)
12. [Running the System](#-running-the-system)
13. [Deployment](#-deployment)
    - [Render (Docker)](#render-docker)
    - [Manual VPS](#manual-vps)
14. [Security Model](#-security-model)
15. [Phase System](#-phase-system)
16. [Monitoring & Observability](#-monitoring--observability)
17. [Troubleshooting](#-troubleshooting)
18. [Contributing](#-contributing)
19. [License](#-license)

---

## 🌟 Project Overview

### The Problem

Traditional token launches on decentralized exchanges suffer from:

- **Rug pulls**: Developers drain liquidity immediately after launch
- **Pump and dump schemes**: Whales manipulate price and exit
- **Static tokenomics**: Fixed tax rates that don't respond to market conditions
- **No investor protection**: Once launched, parameters cannot adapt to market stress
- **Opaque decision-making**: No transparency in how token parameters are set

### The Solution

EvoLaunch Protocol introduces an **AI-governed adaptive tokenomics system** that:

1. **Monitors** real-time on-chain activity (transfers, liquidity, whale behavior)
2. **Analyzes** market conditions using mathematical models + AI reasoning
3. **Adapts** token parameters (taxes, limits) based on market stability
4. **Protects** investors through phased liquidity unlocks gated by stability scores
5. **Evolves** through distinct phases as the market proves its health

### How It Works (Simple Explanation)

```
Token Launch → AI Monitors Market → Calculates Stability Score →
→ Adjusts Taxes/Limits → Protects Investors → Market Stabilizes →
→ Phase Upgrade → Lower Taxes → More Freedom → Repeat
```

When the market is **unstable** (lots of selling, whales dumping):
- Sell tax increases (discourages panic selling)
- Transaction limits tighten (prevents whale dumps)
- Liquidity stays locked (prevents rug pulls)

When the market is **stable** (organic buying, diverse holders):
- Sell tax decreases (rewards holders)
- Transaction limits relax (allows natural growth)
- Liquidity tranches unlock (controlled release)

---

## ✨ Key Features

### 🤖 AI-Powered Market Intelligence
- Real-time analysis of every token transfer on BNB Chain
- Mathematical MSS (Market Stability Score) computation
- Groq AI overlay for nuanced market reasoning
- Zero hardcoded values — all metrics derived from live data

### 🔄 Adaptive Tokenomics
- Dynamic sell/buy tax rates that respond to market conditions
- Configurable transaction limits per phase
- Emergency downgrade capability for market crises
- Governance-gated parameter changes

### 🔒 Investor Protection
- **Phased liquidity unlocks** gated by MSS thresholds
- **Anti-whale mechanisms** with holder concentration monitoring
- **Bot detection** through behavioral analysis
- **Emergency freeze** capability via governance

### 📊 Multi-Agent Decision System
- 4 specialized AI agents working in coordination
- Each agent has a specific domain of expertise
- Agents cannot override each other without consensus
- All decisions are logged and auditable

### 🌐 Production-Grade Infrastructure
- Multi-RPC failover for blockchain reliability
- MongoDB persistence for all agent decisions
- Rate-limited REST API for frontend/third-party integration
- Docker-based deployment for cloud platforms
- Auto-submit safety toggle to prevent accidental gas spending

---

## 🏗 Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        EvoLaunch Protocol                       │
├───────────────┬──────────────────────┬──────────────────────────┤
│               │                      │                          │
│   CONTRACTS   │      BACKEND         │       FRONTEND           │
│  (Solidity)   │   (Node.js+Python)   │      (Next.js)           │
│               │                      │                          │
│ AdaptiveToken │  ┌──────────────┐    │  Dashboard               │
│ EvolutionCtrl │  │ Orchestrator │    │  MSS Charts              │
│ LiquidityVault│  │   Engine     │    │  Phase Display           │
│ GovernanceModule│ └──────┬───────┘    │  Reputation View         │
│ LaunchFactory │         │            │  Launch Interface        │
│               │    ┌────┴────┐       │                          │
│               │    │ Python  │       │                          │
│               │    │ Agents  │       │                          │
│               │    └────┬────┘       │                          │
│               │         │            │                          │
│               │    ┌────┴────┐       │                          │
│               │    │ Groq AI │       │                          │
│               │    │ (LLaMA) │       │                          │
│               │    └─────────┘       │                          │
└───────────────┴──────────────────────┴──────────────────────────┘
                         │
                    ┌────┴────┐
                    │ MongoDB │
                    │  Atlas  │
                    └─────────┘
```

### Data Flow

```
┌─────────────┐    Events     ┌──────────────┐    Metrics    ┌─────────────┐
│  BNB Chain  │──────────────▶│Event Listener│─────────────▶│ Market Data  │
│  (Testnet)  │               │              │               │ Aggregator   │
└─────────────┘               └──────────────┘               └──────┬──────┘
       ▲                                                            │
       │                                                            ▼
       │    ┌──────────────┐    Decision    ┌──────────────┐  Rolling
       │    │     Tx       │◀──────────────│ Orchestrator  │  Metrics
       │    │ Broadcaster  │               │    Engine     │◀────────
       │    └──────┬───────┘               └──────┬───────┘
       │           │                              │
       │     Signed TX                     ┌──────┴──────────────────┐
       │           │                       │                         │
       └───────────┘                ┌──────┴──────┐          ┌──────┴──────┐
                                    │   Python    │          │   Python    │
                                    │Market Agent │          │Phase Agent  │
                                    │ + Groq AI   │          │             │
                                    └─────────────┘          └─────────────┘
```

### Technology Stack

| Layer           | Technology                     | Purpose                                    |
|-----------------|--------------------------------|--------------------------------------------|
| **Blockchain**  | Solidity 0.8.20                | Smart contracts on BNB Chain               |
| **Compilation** | Hardhat + viaIR                | Contract compilation and deployment        |
| **Backend**     | Node.js 18 + Express           | API server, event listening, orchestration |
| **AI Engine**   | Python 3.10 + Web3.py          | Market analysis, phase evaluation          |
| **AI Model**    | Groq API (LLaMA 3.3 70B)      | Nuanced market reasoning overlay           |
| **Database**    | MongoDB Atlas                  | Agent logs, MSS history, reputation scores |
| **Frontend**    | Next.js + React + TypeScript   | Dashboard and launch interface             |
| **Blockchain**  | Ethers.js v6                   | Contract interaction from Node.js          |
| **Security**    | Helmet + express-rate-limit    | HTTP security headers and rate limiting    |
| **Deployment**  | Docker                         | Hybrid Node.js/Python containerization     |

---

## 📜 Smart Contracts

All contracts are deployed on BNB Smart Chain Testnet and verified.

### AdaptiveToken.sol

The core ERC-20 token with dynamically adjustable parameters.

**Key Features:**
- Standard ERC-20 compliance with adaptive extensions
- Dynamic sell tax (0–30%) controlled by EvolutionController
- Dynamic buy tax (0–15%) controlled by EvolutionController
- Configurable max transaction amount
- Configurable max wallet size
- Excluded addresses list (for DEX pairs, contracts)
- Tax collection to designated receiver

**Critical Functions:**

```solidity
// Called by EvolutionController to update token parameters
function updateParameters(
    uint256 _sellTax,
    uint256 _buyTax,
    uint256 _maxTxAmount,
    uint256 _maxWalletSize
) external onlyController;

// Standard ERC-20 transfer with adaptive tax logic
function _transfer(
    address from,
    address to,
    uint256 amount
) internal override {
    // Apply sell tax if selling to AMM pair
    // Apply buy tax if buying from AMM pair
    // Enforce max transaction amount
    // Enforce max wallet size
    // Exempt excluded addresses
}
```

**Tax Application Logic:**

```
IF sender == AMM_PAIR → BUY → apply buyTax
IF receiver == AMM_PAIR → SELL → apply sellTax
IF neither → TRANSFER → no tax applied
```

---

### EvolutionController.sol

The brain of the protocol — accepts signed agent signals and updates token parameters.

**Key Features:**
- ECDSA signature verification for all updates
- Nonce-based replay protection
- Timestamp freshness validation (signals expire after 5 minutes)
- Phase tracking (Protective → Growth → Expansion → Governance)
- MSS (Market Stability Score) storage
- Authorized agent address management
- Emergency pause capability

**Critical Functions:**

```solidity
// Process a signed signal from the AI agent
function processAgentSignal(
    uint256 mss,
    uint256 sellTax,
    uint256 buyTax,
    uint256 maxTxAmount,
    uint256 maxWalletSize,
    uint256 timestamp,
    bytes memory signature
) external {
    // 1. Verify signature was signed by authorized agent
    // 2. Validate timestamp freshness (< 5 minutes old)
    // 3. Increment and validate nonce
    // 4. Update MSS storage
    // 5. Determine new phase based on MSS
    // 6. Call AdaptiveToken.updateParameters()
    // 7. Emit MSSUpdated and ParametersUpdated events
}
```

**Signature Verification:**

```solidity
bytes32 messageHash = keccak256(abi.encodePacked(
    mss, sellTax, buyTax, maxTxAmount, maxWalletSize,
    timestamp, nonce, address(this)
));
bytes32 ethSignedHash = ECDSA.toEthSignedMessageHash(messageHash);
address signer = ECDSA.recover(ethSignedHash, signature);
require(signer == authorizedAgent, "Invalid signature");
```

---

### LiquidityVault.sol

Manages phased liquidity release with MSS-gated unlocks.

**Key Features:**
- Tranche-based liquidity storage
- Each tranche has an MSS threshold and phase requirement
- Only releases when both MSS and phase conditions are met
- Emergency freeze capability via governance
- Prevents premature liquidity withdrawal (anti-rug)

**Tranche Structure:**

```solidity
struct Tranche {
    uint256 amount;         // Amount of tokens locked
    uint256 mssThreshold;   // Minimum MSS required to unlock
    uint8   phaseRequirement; // Minimum phase required
    bool    isReleased;     // Whether this tranche has been released
}
```

**Critical Functions:**

```solidity
// Release a tranche if conditions are met
function releaseTranche(uint256 trancheIndex) external {
    require(!tranches[trancheIndex].isReleased, "Already released");
    require(currentMSS >= tranches[trancheIndex].mssThreshold, "MSS too low");
    require(currentPhase >= tranches[trancheIndex].phaseRequirement, "Phase too low");
    require(!isFrozen, "Vault is frozen");

    tranches[trancheIndex].isReleased = true;
    // Transfer tokens to designated recipient
}
```

---

### GovernanceModule.sol

Community-driven emergency controls and parameter governance.

**Key Features:**
- Emergency freeze/unfreeze of all protocol operations
- Proposal system for parameter changes
- Multi-sig or DAO voting integration ready
- Event emission for all governance actions

**Critical Functions:**

```solidity
function emergencyFreeze() external onlyGovernance;
function emergencyUnfreeze() external onlyGovernance;
function isPaused() external view returns (bool);
```

---

### LaunchFactory.sol

Factory contract for creating new adaptive token launches.

**Key Features:**
- One-click deployment of complete token ecosystem
- Creates AdaptiveToken + EvolutionController + LiquidityVault
- Struct-based parameters to avoid stack depth issues
- Tracks all launches for frontend enumeration

**Launch Parameters:**

```solidity
struct LaunchParams {
    string  name;
    string  symbol;
    uint256 totalSupply;
    uint256 initialSellTax;
    uint256 initialBuyTax;
    uint256 maxTxAmount;
    uint256 maxWalletSize;
    address ammPair;
    address taxReceiver;
}
```

---

### Contract Addresses (BSC Testnet)

| Contract             | Address                                      | Status  |
|---------------------|----------------------------------------------|---------|
| LaunchFactory        | `0x2C95eEeF7d0F5Be75dce165aC7689B09Fd06FEF6` | ✅ Live |
| AdaptiveToken        | `0xb142FCD1fc79BE3EA60C1B83558f171033A0c12E` | ✅ Live |
| EvolutionController  | `0xC4D65495eB47AC8726Dad401d28A83C25B77f110` | ✅ Live |
| LiquidityVault       | `0x...`                                       | ✅ Live |
| GovernanceModule     | `0xfE63A74EcAC6BCaDF4078B7C53d01e2f511ff629` | ✅ Live |

---

## 🤖 AI Agent Intelligence Layer

The intelligence layer is the core differentiator of EvoLaunch. It consists of 4 specialized Python agents that work together to analyze market conditions and produce structured decision payloads.

### Architecture Principles

1. **Zero Placeholder Policy**: No agent ever returns a hardcoded or mock value
2. **Data Autonomy**: Each agent fetches its own data from the BNB Chain RPC
3. **Deterministic Core**: Mathematical formulas produce the base score
4. **AI Overlay**: Groq AI adjusts within bounded limits (±5 points)
5. **Fail-Safe Mode**: If AI fails, the mathematical score is used directly
6. **Structured Output**: All agents return JSON payloads with validated fields

---

### 1. Market Intelligence Agent

**File:** `backend/src/agents/python/mss_agent.py`

**Purpose:** Computes the Market Stability Score (MSS) from live on-chain data.

**Data Sources:**
- Live AMM pair reserves (via Web3.py `getReserves()`)
- Token total supply (via Web3.py `totalSupply()`)
- Rolling transfer event buffer (from Node.js event listener)
- Buy/sell volume and pressure ratios

**Process:**

```
1. Connect to BNB RPC via Web3.py
2. Fetch live AMM reserves → Compute liquidity depth
3. Fetch token total supply → Compute distribution metrics
4. Receive rolling event data from Node.js → Compute volatility
5. Calculate weighted MSS using 4-component formula
6. Send metrics to Groq AI for reasoning overlay
7. Clamp AI adjustment to ±5 points
8. Return final MSS (0-100) + risk metrics
```

**Output Schema:**

```json
{
    "mss": 72,
    "rawMSS": 70,
    "volatilityRisk": 0.15,
    "liquidityStress": 0.08,
    "analysis": "Stable buy pressure with low whale activity.",
    "phaseRecommendation": 1
}
```

---

### Market Stability Score (MSS) Formula

The MSS is a composite score (0–100) computed from 4 weighted components:

```
MSS = (L × 0.40) + (V × 0.30) + (D × 0.20) + (P × 0.10)
```

Where:

#### L — Liquidity Score (40% weight)

```python
L = min(100, (wbnb_reserve / TARGET_LIQUIDITY) × 100)
```

- `TARGET_LIQUIDITY` = 50 BNB (configurable benchmark)
- Measures how much WBNB is backing the token
- Higher liquidity = higher stability score

#### V — Volatility Score (30% weight)

```python
deviation = abs(buy_pressure - 50)  # Distance from perfect balance
V = max(0, 100 - deviation × 2)
```

- `buy_pressure` = percentage of volume that is buying (0-100)
- 50% buy pressure = perfectly balanced = score 100
- 0% or 100% = highly imbalanced = score 0
- Penalizes extreme buying OR selling pressure

#### D — Distribution Score (20% weight)

```python
whale_ratio = whale_transactions / total_transactions
D = max(0, 100 - whale_ratio × 200)
```

- Whale threshold: transactions > 10,000 tokens
- 0 whales = perfect distribution = score 100
- 50%+ whale transactions = score 0
- Encourages diverse holder base

#### P — Participation Score (10% weight)

```python
P = min(100, unique_buyers × 5)
```

- Counts unique buyer addresses in the rolling window
- 20+ unique buyers = maximum score
- Rewards organic community participation

---

### 2. Phase Evolution Agent

**File:** `backend/src/agents/python/phase_agent.py`

**Purpose:** Determines whether the token should upgrade or downgrade its phase.

**Logic:**

```
IF volatility_risk > 0.8 OR liquidity_stress > 0.8:
    → Emergency Downgrade to Phase 0 (Protective)

ELIF MSS >= 80 AND current_phase < 2:
    → Upgrade by 1 phase (no skipping)

ELIF MSS < 40 AND current_phase > 0:
    → Downgrade by 1 phase

ELSE:
    → Maintain current phase
```

**Rules:**
- **No Phase Skipping**: Upgrades only advance by 1 level at a time
- **Emergency Downgrades**: Can jump directly to Phase 0
- **Governance Respect**: All transitions blocked when governance freeze is active

**Output Schema:**

```json
{
    "currentPhase": 1,
    "nextPhase": 2,
    "reason": "MSS 85 allows upgrade to phase 2."
}
```

---

### 3. Liquidity Orchestrator Agent

**File:** `backend/src/agents/python/liquidity_agent.py`

**Purpose:** Evaluates which liquidity vault tranches are eligible for release.

**Logic:**

```
FOR each tranche in LiquidityVault:
    IF tranche is NOT released:
        IF current_MSS >= tranche.mssThreshold:
            IF current_phase >= tranche.phaseRequirement:
                → Mark as eligible for unlock
```

**Data Sources:**
- LiquidityVault contract state (via Web3.py)
- Current MSS from Market Intelligence Agent
- Current phase from Phase Evolution Agent

**Output Schema:**

```json
{
    "eligibleUnlocks": [
        {
            "index": 0,
            "amount": "100000000000000000000",
            "reason": "Met MSS 60 and Phase 1"
        }
    ],
    "count": 1
}
```

---

### 4. Reputation Agent

**File:** `backend/src/agents/python/reputation_agent.py`

**Purpose:** Scores wallets (0–100) based on their on-chain behavior.

**Scoring Criteria:**

| Behavior             | Score Impact  |
|-----------------------|:------------:|
| Holding > 1000 tokens | +20          |
| Holding > 100 tokens  | +10          |
| Bot-like patterns     | -40          |
| Quick dump after buy   | -10 per dump |
| Long holding duration  | +30 max      |

**Output Schema:**

```json
{
    "wallet": "0x...",
    "score": 78,
    "balance": 1500.5,
    "isBotSuspect": false,
    "analysis": "Holding 1500.50 tokens."
}
```

---

### Groq AI Integration

The Market Intelligence Agent integrates with **Groq's LLaMA 3.3 70B** model for nuanced reasoning.

**How it works:**

1. Python agent computes mathematical MSS (deterministic)
2. Raw metrics are formatted into a structured prompt
3. Groq AI analyzes and returns bounded adjustments
4. Agent applies AI adjustment (±5 points max)
5. If Groq fails → mathematical score is used (zero fallback to random)

**Model Configuration:**
- **Model:** `llama-3.3-70b-versatile`
- **Temperature:** 0.1 (near-deterministic)
- **Response format:** `json_object` (structured output)
- **Max tokens:** 200

**Prompt Structure:**

```
System: You are a senior AI Risk Analyst for EvoLaunch Protocol...
User: Live Metrics:
- MSS (Math): 72
- Liquidity (BNB): 35.5
- Buy Pressure: 68%
- Unique Buyers: 15
→ Return JSON: { mssAdjustment, riskLevel, phaseRecommendation, analysis }
```

---

## ⚙ Backend Services

The backend is a Node.js + Python hybrid system that coordinates all agent activity.

### Project Structure

```
backend/
├── config/
│   └── networks.json            # Multi-RPC failover configuration
├── src/
│   ├── agents/
│   │   ├── python/
│   │   │   ├── mss_agent.py             # Market Intelligence Agent
│   │   │   ├── phase_agent.py           # Phase Evolution Agent
│   │   │   ├── liquidity_agent.py       # Liquidity Orchestrator Agent
│   │   │   ├── reputation_agent.py      # Reputation Agent
│   │   │   └── requirements.txt         # Python dependencies
│   │   ├── marketAgent.js               # JS market analysis (legacy)
│   │   ├── phaseAgent.js                # JS phase logic (legacy)
│   │   ├── liquidityAgent.js            # JS liquidity logic (legacy)
│   │   └── reputationAgent.js           # JS reputation logic (legacy)
│   ├── models/
│   │   ├── AgentLog.js                  # AI decision audit trail
│   │   ├── GovernanceEvent.js           # Governance action records
│   │   ├── Launch.js                    # Token launch metadata
│   │   ├── LiquidityUnlock.js           # Tranche release records
│   │   ├── MSSHistory.js                # MSS time-series data
│   │   ├── PhaseTransition.js           # Phase change records
│   │   └── Reputation.js               # Wallet reputation scores
│   ├── routes/
│   │   └── api.js                       # REST API endpoints
│   ├── services/
│   │   ├── blockchain.js                # RPC provider + failover
│   │   ├── database.js                  # MongoDB connection
│   │   ├── eventListener.js             # On-chain event subscriptions
│   │   ├── governanceMonitor.js         # Governance freeze watcher
│   │   ├── grokService.js               # Python agent bridge
│   │   ├── healthMonitor.js             # System health tracker
│   │   ├── liquidityService.js          # Tranche unlock executor
│   │   ├── marketData.js                # Rolling metrics aggregator
│   │   ├── mssEngine.js                 # MSS computation helpers
│   │   ├── orchestrator.js              # Main coordination engine
│   │   ├── pythonBridge.js              # Node↔Python IPC bridge
│   │   ├── reputationService.js         # Reputation batch processing
│   │   ├── signingService.js            # ECDSA payload signing
│   │   └── txBroadcaster.js             # Gas, nonce, retry manager
│   └── server.js                        # Application entry point
├── .env                                 # Environment configuration
├── .env.example                         # Template for .env
├── api_docs.json                        # API documentation
├── Dockerfile                           # Hybrid Docker build
├── render.yaml                          # Render deployment blueprint
├── package.json                         # Node.js dependencies
└── PROD_GUIDE.md                        # Production deployment guide
```

---

### Orchestrator Engine

**File:** `services/orchestrator.js`

The central coordination service that drives evaluation cycles.

**Cycle Flow:**

```
┌─────────────────────────────────────────┐
│           Orchestrator Cycle            │
├─────────────────────────────────────────┤
│                                         │
│  1. Check System Health                 │
│     └─ If unhealthy → SKIP cycle        │
│                                         │
│  2. Check Governance Freeze             │
│     └─ If frozen → SKIP cycle           │
│                                         │
│  3. Run Market Intelligence Agent       │
│     └─ Returns: MSS, risk, stress       │
│                                         │
│  4. Run Phase Evolution Agent           │
│     └─ Returns: nextPhase, reason       │
│                                         │
│  5. Run Liquidity Agent                 │
│     └─ Returns: eligible unlocks        │
│                                         │
│  6. Change Detection                    │
│     └─ If MSS diff < 5 AND same phase   │
│        → SKIP on-chain update           │
│                                         │
│  7. AUTO_SUBMIT Check                   │
│     └─ If false → LOG ONLY, no TX       │
│                                         │
│  8. Broadcast Signal (if approved)      │
│     └─ Sign → Estimate Gas → Send TX    │
│                                         │
│  9. Persist to MongoDB                  │
│     └─ AgentLog + MSSHistory            │
│                                         │
└─────────────────────────────────────────┘
```

**Configuration:**

| Variable            | Default   | Description                           |
|---------------------|-----------|---------------------------------------|
| `UPDATE_INTERVAL_MS`| 300000    | Cycle interval (5 minutes)            |
| `AUTO_SUBMIT`       | false     | Enable/disable on-chain transactions  |

---

### Blockchain Event Listener

**File:** `services/eventListener.js`

Subscribes to real-time on-chain events using Ethers.js.

**Monitored Events:**

| Contract              | Event                | Action                           |
|-----------------------|----------------------|----------------------------------|
| AdaptiveToken         | `Transfer`           | Feed to market data aggregator   |
| EvolutionController   | `MSSUpdated`         | Log new MSS value                |
| EvolutionController   | `ParametersUpdated`  | Log new tax/limit parameters     |
| EvolutionController   | `PhaseTransitioned`  | Record phase change              |
| LiquidityVault        | `TrancheReleased`    | Record unlock event              |
| LiquidityVault        | `VaultFrozen`        | Update freeze state              |
| GovernanceModule      | `EmergencyFreeze`    | Halt all operations              |
| GovernanceModule      | `EmergencyUnfreeze`  | Resume operations                |

---

### Market Data Aggregator

**File:** `services/marketData.js`

Maintains a rolling window buffer of the last 50 transfer events.

**Functions:**
- `recordTransfer(tokenAddress, event)` — adds event to buffer
- `classifyTransfer(event, pairAddress)` — determines buy/sell/transfer
- `getRollingMetrics(tokenAddress, pairAddress)` — returns aggregated metrics

**Classification Logic:**

```
FROM AMM pair → recipient is BUYING
TO AMM pair   → sender is SELLING
Neither       → internal TRANSFER
```

---

### Transaction Broadcaster

**File:** `services/txBroadcaster.js`

Handles the complexities of submitting transactions to the blockchain.

**Features:**
- Gas estimation with 20% safety buffer
- Fresh nonce management (`pending` state)
- Exponential backoff retry (3 attempts max)
- Transaction confirmation waiting
- Detailed console logging for debugging

**Retry Strategy:**

```
Attempt 1: Send TX with estimated gas × 1.2
  → If fail: Wait 2 seconds
Attempt 2: Re-estimate gas, get fresh nonce
  → If fail: Wait 4 seconds
Attempt 3: Final attempt with fresh everything
  → If fail: Return null (preserve last state)
```

---

### Signing Service

**File:** `services/signingService.js`

Generates ECDSA signatures that match the Solidity contract's verification logic.

**Process:**

```javascript
// 1. Encode parameters identically to Solidity
const messageHash = ethers.solidityPackedKeccak256(
    ['uint256', 'uint256', 'uint256', 'uint256', 'uint256',
     'uint256', 'uint256', 'address'],
    [mss, sellTax, buyTax, maxTxAmt, maxWallet,
     timestamp, nonce, controllerAddress]
);

// 2. Sign with agent's private key (EIP-191)
const signature = await agentWallet.signMessage(
    ethers.getBytes(messageHash)
);
```

---

### Health Monitor

**File:** `services/healthMonitor.js`

Tracks system health and halts operations when issues are detected.

**Checks:**
- RPC provider responsiveness (ping every 15 seconds)
- Block staleness (if unchanged for 90+ seconds → unhealthy)
- Governance freeze state
- Automatic RPC rotation on failure

---

### Python Bridge

**File:** `services/pythonBridge.js`

Generic Node.js → Python IPC bridge for calling any Python agent.

**Features:**
- Spawns Python process with arguments
- Captures stdout (JSON output) and stderr (error logs)
- Handles process errors and non-zero exit codes
- Configurable Python path via `PYTHON_PATH` env variable
- Returns structured JSON result or error object

---

## 📦 Database Models

### AgentLog

Stores every AI decision for audit and analysis.

| Field            | Type     | Description                         |
|-----------------|----------|-------------------------------------|
| tokenAddress     | String   | Token being analyzed                |
| mss              | Number   | Final MSS after AI adjustment       |
| rawMSS           | Number   | Mathematical MSS before AI          |
| phase            | String   | Phase name at time of decision      |
| analysis         | String   | AI reasoning summary                |
| volatilityRisk   | Number   | Risk level (0.0 – 1.0)             |
| liquidityStress  | Number   | Stress level (0.0 – 1.0)           |
| txHash           | String   | Transaction hash (if submitted)     |
| timestamp        | Date     | When the decision was made          |

### MSSHistory

Time-series MSS data for charting.

| Field        | Type     | Description                    |
|-------------|----------|--------------------------------|
| tokenAddress | String   | Token address                  |
| mss          | Number   | MSS value                     |
| timestamp    | Number   | Unix timestamp                 |

### PhaseTransition

Records of every phase change.

| Field        | Type     | Description                    |
|-------------|----------|--------------------------------|
| tokenAddress | String   | Token address                  |
| fromPhase    | Number   | Previous phase index           |
| toPhase      | Number   | New phase index                |
| mssAtTime    | Number   | MSS when transition occurred   |
| txHash       | String   | Transaction hash               |
| timestamp    | Date     | When transition occurred       |

### Reputation

Wallet behavior scores.

| Field           | Type     | Description                    |
|----------------|----------|--------------------------------|
| walletAddress   | String   | Wallet (lowercase)             |
| score           | Number   | Reputation (0–100)             |
| allocationWeight| Number   | Normalized weight (0.0–1.0)    |
| holdingHours    | Number   | Hours tokens held              |
| dumpCount       | Number   | Number of quick dumps          |
| isBotSuspect    | Boolean  | Bot detection flag             |

### LiquidityUnlock

Records of tranche releases.

| Field        | Type     | Description                    |
|-------------|----------|--------------------------------|
| tokenAddress | String   | Token address                  |
| trancheIndex | Number   | Which tranche was released     |
| amount       | String   | Amount unlocked (wei)          |
| mss          | Number   | MSS at time of unlock          |
| txHash       | String   | Transaction hash               |
| timestamp    | Date     | When unlock occurred           |

### GovernanceEvent

Governance action history.

| Field        | Type     | Description                    |
|-------------|----------|--------------------------------|
| type         | String   | Event type (freeze/unfreeze)   |
| tokenAddress | String   | Affected token                 |
| proposer     | String   | Who triggered the action       |
| timestamp    | Date     | When action occurred           |

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api`

### GET /health

System health status.

```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
    "healthy": true,
    "governanceFrozen": false,
    "currentRPC": "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
    "lastGoodBlock": 92792450
}
```

---

### GET /metrics/:address

Live rolling market metrics.

```bash
curl http://localhost:5000/api/metrics/0xb142FCD1fc79BE3EA60C1B83558f171033A0c12E
```

**Response:**
```json
{
    "buyVolume": "1500500000000000000000",
    "sellVolume": "450200000000000000000",
    "buyCount": 15,
    "sellCount": 5,
    "whaleCount": 2,
    "uniqueBuyers": 12,
    "buyPressure": 77,
    "eventCount": 20
}
```

---

### GET /status/:address

Aggregated dashboard data.

```bash
curl http://localhost:5000/api/status/0xb142FCD1fc79BE3EA60C1B83558f171033A0c12E
```

**Response:**
```json
{
    "launch": { "tokenAddress": "0x...", "name": "EvoToken" },
    "mss": 72,
    "logs": [
        {
            "mss": 72,
            "phase": "Growth",
            "analysis": "Stable liquidity detected.",
            "txHash": "0x7cbb8ef..."
        }
    ]
}
```

---

### GET /history/:address?limit=100

MSS history for charts.

```bash
curl "http://localhost:5000/api/history/0xb142...?limit=50"
```

---

### GET /agent-logs/:address

Detailed AI agent decision trail.

```bash
curl http://localhost:5000/api/agent-logs/0xb142...
```

---

### GET /phase-history/:address

Phase transition records.

```bash
curl http://localhost:5000/api/phase-history/0xb142...
```

---

### GET /liquidity-unlocks/:address

Liquidity tranche release records.

```bash
curl http://localhost:5000/api/liquidity-unlocks/0xb142...
```

---

### GET /reputation/:wallet

Wallet reputation score.

```bash
curl http://localhost:5000/api/reputation/0x1234...
```

**Response:**
```json
{
    "walletAddress": "0x1234...",
    "score": 85,
    "allocationWeight": 0.85,
    "holdingHours": 144,
    "dumpCount": 0,
    "isBotSuspect": false
}
```

---

### GET /governance-events/:address

Governance action history.

```bash
curl http://localhost:5000/api/governance-events/0xb142...
```

---

## 🎨 Frontend

The frontend is built with **Next.js**, **React**, and **TypeScript**.

### Pages

| Route                    | Description                              |
|--------------------------|------------------------------------------|
| `/`                      | Home / Dashboard with MSS overview       |
| `/launch`                | Create new adaptive token launch         |
| `/project/[address]`     | Project detail page with MSS chart       |
| `/reputation`            | Wallet reputation checker                |

### Key Components

- **MSSChart**: Real-time MSS time-series visualization
- **Navigation**: Global navigation bar
- **PhaseIndicator**: Visual phase status display
- **ReputationCard**: Wallet score display

---

## 📦 Installation

### Prerequisites

| Software  | Version   | Purpose                         |
|-----------|-----------|----------------------------------|
| Node.js   | 18+       | Backend runtime                  |
| Python    | 3.10+     | AI agent execution               |
| MongoDB   | Atlas     | Data persistence                 |
| Git       | Latest    | Version control                  |

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/EvoLaunch-Protocol.git
cd EvoLaunch-Protocol
```

### Step 2: Install Node.js Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Python Dependencies

```bash
cd src/agents/python
pip install -r requirements.txt
cd ../../..
```

### Step 4: Deploy Contracts (if needed)

```bash
cd ../contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network bscTestnet
```

### Step 5: Configure Environment

```bash
cd ../backend
cp .env.example .env
# Edit .env with your values
```

---

## ⚙ Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# ─── Server ────────────────────────────────────────
PORT=5000

# ─── Database ──────────────────────────────────────
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/evolaunch

# ─── Blockchain ────────────────────────────────────
BNB_RPC_URL=https://data-seed-prebsc-1-s1.bnbchain.org:8545

# ─── Keys ──────────────────────────────────────────
DEPLOYER_PRIVATE_KEY=0x...
AGENT_PRIVATE_KEY=0x...

# ─── AI ────────────────────────────────────────────
GROK_API_KEY=gsk_...

# ─── Contracts ─────────────────────────────────────
LAUNCH_FACTORY_ADDRESS=0x...
ADAPTIVE_TOKEN_ADDRESS=0x...
LIQUIDITY_VAULT_ADDRESS=0x...
EVOLUTION_CONTROLLER_ADDRESS=0x...
GOVERNANCE_MODULE_ADDRESS=0x...
AMM_PAIR_ADDRESS=0x...

# ─── Safety ────────────────────────────────────────
UPDATE_INTERVAL_MS=300000
AUTO_SUBMIT=false
```

### Multi-RPC Failover

Edit `backend/config/networks.json` to add backup RPC URLs:

```json
{
    "bsc_testnet": {
        "rpc_urls": [
            "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
            "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
            "https://data-seed-prebsc-1-s2.bnbchain.org:8545"
        ],
        "chain_id": 97
    }
}
```

---

## 🚀 Running the System

### Development Mode (with auto-restart)

```bash
cd backend
npm run dev
```

### Production Mode

```bash
cd backend
npm start
```

### Monitor-Only Mode (Recommended for Testing)

Set `AUTO_SUBMIT=false` in `.env` before starting. The system will:
- ✅ Connect to BNB Chain
- ✅ Listen to events
- ✅ Run AI analysis cycles
- ✅ Log decisions to MongoDB
- ❌ NOT send any transactions (saves gas)

### Live Autonomous Mode

Set `AUTO_SUBMIT=true` in `.env`. The system will:
- ✅ Everything above PLUS
- ✅ Submit signed signals to EvolutionController
- ✅ Execute tranche unlocks when eligible
- ⚠️ Will spend BNB gas for each transaction

### Expected Console Output

```
MongoDB Connected: cluster.mongodb.net
[HealthMonitor] Starting health monitor (15s interval)
[GovernanceMonitor] ✅ Governance event subscriptions active
[EventListener] ✅ All event subscriptions active
[Orchestrator] Starting with 300s interval (High Frequency Prevention)

🚀 EvoLaunch Backend running on port 5000
   Health: http://localhost:5000/api/health
   API:    http://localhost:5000/api/status/<tokenAddress>

[Orchestrator] Running Market Intelligence...
[Bridge] Calling mss_agent.py with args: [--metrics, {...}, --mss, 50]
[GrokService] Python Analysis complete: risk=0.15 adj=2
[Orchestrator] Running Phase Evolution...
[Orchestrator] Running Liquidity Orchestration...
[Orchestrator] Cycle complete. MSS: 72
```

---

## 🌐 Deployment

### Render (Docker)

EvoLaunch uses a **Docker-based deployment** to support both Node.js and Python in a single container.

#### Files Required

1. `Dockerfile` — Multi-runtime container definition
2. `render.yaml` — Render Blueprint for automated deployment

#### Deployment Steps

1. Push code to GitHub
2. Go to Render Dashboard → **New +** → **Blueprint**
3. Select your repository
4. Render detects `render.yaml` and configures the service
5. Add secret environment variables in Render Dashboard
6. Deploy!

#### Dockerfile Overview

```dockerfile
FROM node:18-slim

# Install Python alongside Node.js
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv build-essential

WORKDIR /app

# Install both Node and Python dependencies
COPY package*.json ./
RUN npm install --production

COPY src/agents/python/requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHON_PATH=python3
EXPOSE 5000
CMD ["npm", "start"]
```

### Manual VPS

```bash
# 1. Install Node.js 18 and Python 3.10
# 2. Clone the repository
git clone https://github.com/your-username/EvoLaunch-Protocol.git
cd EvoLaunch-Protocol/backend

# 3. Install dependencies
npm install
cd src/agents/python && pip install -r requirements.txt && cd ../../..

# 4. Configure environment
cp .env.example .env
nano .env  # Add your values

# 5. Run with PM2 for process management
npm install -g pm2
pm2 start src/server.js --name evolaunch-backend
pm2 save
pm2 startup
```

---

## 🔒 Security Model

### Private Key Protection

- Agent private key stored only in `.env` (never committed)
- `.gitignore` excludes all `.env` files
- Render secrets are encrypted at rest

### Signature Verification

- All on-chain updates require valid ECDSA signature
- Signatures include nonce (replay protection)
- Signatures include timestamp (freshness validation)
- Contract verifies signer matches authorized agent

### API Security

- **Helmet.js**: Sets secure HTTP headers
- **Rate Limiting**: 100 req/min general, 20 req/min for reputation
- **Input Validation**: All parameters validated before processing
- **CORS**: Configurable origin restrictions

### On-Chain Safety

- `AUTO_SUBMIT=false` default prevents accidental gas spending
- Change detection prevents redundant transactions
- Emergency governance freeze halts all operations
- Phase transitions cannot skip levels upward

---

## 🔄 Phase System

EvoLaunch tokens progress through 4 distinct phases:

### Phase 0: Protective 🛡️

| Parameter       | Value    | Purpose                           |
|----------------|----------|-----------------------------------|
| Sell Tax        | 15%      | Discourage panic selling          |
| Buy Tax         | 5%       | Moderate buy-side protection      |
| Max TX          | 10K tkns | Prevent whale manipulation        |
| Max Wallet      | 20K tkns | Limit concentration               |
| Liquidity       | Locked   | Prevent rug pulls                 |

**Entry:** Token launch default
**Exit:** MSS ≥ 80 sustained

### Phase 1: Growth 📈

| Parameter       | Value    | Purpose                           |
|----------------|----------|-----------------------------------|
| Sell Tax        | 5%       | Lower barriers                    |
| Buy Tax         | 2%       | Encourage buying                  |
| Max TX          | 10K tkns | Maintained                        |
| Max Wallet      | 20K tkns | Maintained                        |
| Liquidity       | Partial  | First tranches eligible           |

**Entry:** MSS ≥ 80
**Exit:** MSS ≥ 80 sustained further

### Phase 2: Expansion 🚀

| Parameter       | Value    | Purpose                           |
|----------------|----------|-----------------------------------|
| Sell Tax        | 2%       | Near-free market                  |
| Buy Tax         | 1%       | Minimal friction                  |
| Max TX          | 10K tkns | Safety maintained                 |
| Max Wallet      | 20K tkns | Safety maintained                 |
| Liquidity       | Most     | More tranches eligible            |

**Entry:** MSS ≥ 80 from Phase 1
**Exit:** MSS ≥ 80 sustained for governance

### Phase 3: Governance 🏛️

| Parameter       | Value    | Purpose                           |
|----------------|----------|-----------------------------------|
| Sell Tax        | 1%       | Free market                       |
| Buy Tax         | 1%       | Protocol fee only                 |
| Max TX          | 10K tkns | Community decides                 |
| Max Wallet      | 20K tkns | Community decides                 |
| Liquidity       | Full     | All tranches eligible             |

**Entry:** Full community governance vote
**Exit:** Emergency downgrade only

### Downgrade Conditions

```
IF volatility_risk > 0.80 → Emergency Downgrade to Phase 0
IF MSS < 40 → Downgrade by 1 phase
```

---

## 📊 Monitoring & Observability

### Console Logs

All services emit structured console logs with prefixes:

```
[Orchestrator]      — Main coordination engine
[MarketAgent]       — Market analysis
[PhaseAgent]        — Phase decisions
[TxBroadcaster]     — Transaction submission
[EventListener]     — On-chain events
[HealthMonitor]     — System health
[GovernanceMonitor] — Governance state
[GrokService]       — AI analysis
[Bridge]            — Python IPC
[Blockchain]        — RPC status
```

### MongoDB Collections

Monitor these collections for real-time system state:

| Collection        | Purpose                          | Query Example                    |
|-------------------|----------------------------------|----------------------------------|
| `agentlogs`       | AI decision audit trail          | Sort by timestamp DESC           |
| `msshistories`    | MSS time-series                  | Filter by tokenAddress           |
| `phasetransitions`| Phase change records             | Track fromPhase → toPhase        |
| `reputations`     | Wallet scores                    | Filter by score < 30 (bots)      |
| `liquidityunlocks`| Tranche releases                 | Verify MSS at unlock time        |
| `governanceevents`| Freeze/unfreeze history          | Monitor for emergencies          |

### API Health Check

```bash
# Quick health check
curl http://localhost:5000/api/health

# Watch MSS changes in real-time
watch -n 5 "curl -s http://localhost:5000/api/status/0xb142..."
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. `ReferenceError: ethers is not defined`

**Cause:** Missing import in `blockchain.js`
**Fix:** Ensure the file starts with:
```javascript
const { ethers } = require('ethers');
const dotenv = require('dotenv');
dotenv.config();
```

#### 2. `GrokService Failed: Request failed with status code 400`

**Cause:** Incorrect Groq model name
**Fix:** Ensure `mss_agent.py` uses `llama-3.3-70b-versatile`

#### 3. `SyntaxError: await is only valid in async functions`

**Cause:** Code outside async function scope
**Fix:** Ensure all `await` calls are inside `async` functions

#### 4. `[EventListener] Error subscribing: null target`

**Cause:** Missing `AMM_PAIR_ADDRESS` in `.env`
**Fix:** Set the pair address in your `.env` file

#### 5. Excessive gas spending

**Fix:** Set `AUTO_SUBMIT=false` in `.env` to enable Monitor-Only mode

#### 6. Python agent not found

**Cause:** Python not installed or wrong path
**Fix:** Set `PYTHON_PATH=python3` in `.env` (Linux/Docker) or `PYTHON_PATH=python` (Windows)

#### 7. MongoDB connection timeout

**Fix:** Ensure your MongoDB Atlas cluster allows connections from your IP (or use `0.0.0.0/0` for testing)

#### 8. RPC rate limiting

**Fix:** The system auto-rotates through backup RPCs in `config/networks.json`. Add more URLs if needed.

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run the backend locally to verify
5. Commit: `git commit -m "feat: add my feature"`
6. Push: `git push origin feature/my-feature`
7. Open a Pull Request

### Code Style

- **JavaScript:** Standard ES6+ with consistent naming
- **Python:** PEP 8 compliant
- **Solidity:** Follow OpenZeppelin conventions
- **Comments:** All public functions must have JSDoc/docstring

### Areas for Contribution

- [ ] Add more AI models (GPT-4, Claude, Gemini)
- [ ] Implement WebSocket real-time API
- [ ] Add more sophisticated reputation scoring
- [ ] Create governance frontend
- [ ] Add unit tests for all agents
- [ ] Implement mainnet deployment scripts
- [ ] Add Discord/Telegram bot integration

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 EvoLaunch Protocol

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---



### Built with ❤️ for BNB Chain Hackathon Bengaluru 2026

**EvoLaunch Protocol** — *Where AI meets DeFi to protect investors and promote organic growth.*

[🌐 Website](#) • [📱 Twitter](#) • [💬 Discord](#) • [📄 Docs](#)



