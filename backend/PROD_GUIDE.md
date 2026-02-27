# EvoLaunch Production Guide

This document explains how to run the production-grade EvoLaunch Multi-Agent Intelligence System.

## Architecture

The system uses a **Hybrid Bridge Architecture**:
- **Execution Engine (Node.js)**: Handles blockchain events, database persistence, and transaction broadcasting.
- **Intelligence Layer (Python)**: Performs high-fidelity market analysis, risk assessment, and reputation scoring using direct RPC access and Groq AI.

## Prerequisites

1. **Python 3.10+** and **Node.js 18+**
2. **Groq API Key**: (Get from [console.groq.com](https://console.groq.com))
3. **BNB Smart Chain RPC**: (Multiple URLs for failover are configured in `config/networks.json`)
4. **Agent Wallet**: Must have a small balance of BNB for gas fees on BSC Testnet.

## Installation

### 1. Backend Dependencies
```bash
cd backend
npm install
```

### 2. Python Agent Dependencies
```bash
cd backend/src/agents/python
pip install -r requirements.txt
```

## Configuration

Update `backend/.env` with your real production values:

```env
BNB_RPC_URL=https://data-seed-prebsc-1-s1.bnbchain.org:8545
AGENT_PRIVATE_KEY=0x...
GROK_API_KEY=gsk_...
ADAPTIVE_TOKEN_ADDRESS=0x...
AMM_PAIR_ADDRESS=0x...
EVOLUTION_CONTROLLER_ADDRESS=0x...
LIQUIDITY_VAULT_ADDRESS=0x...
MONGODB_URI=mongodb+srv://...

# Safety Toggles
AUTO_SUBMIT=false   # Set to true only when ready to spend gas
UPDATE_INTERVAL_MS=300000 
```

## Execution

### Run in Monitor-Only Mode (Safe)
```bash
cd backend
npm run dev
```
In this mode, the agent will analyze the market and log what it *would* have done without sending any transactions.

### Run in Autonomous Mode (Live)
1. Set `AUTO_SUBMIT=true` in `.env`.
2. Restart the backend: `npm run dev`.

## Monitoring
- **Logs**: Check console for `[Orchestrator]`, `[GrokService]`, and `[TxBroadcaster]`.
- **API**: Visit `http://localhost:5000/api/health` for real-time status.
- **Database**: Check `AgentLogs` collection for historical decisions.

## Multi-RPC Failover
If the primary RPC URL fails, the system will automatically rotate through the backup URLs listed in `backend/config/networks.json`.
