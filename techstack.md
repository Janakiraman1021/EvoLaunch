# techstack.md (Revised)

---

# 1. BLOCKCHAIN LAYER

Blockchain:
BNB Smart Chain

Smart Contracts:
Solidity

Framework:
Hardhat

Libraries:
OpenZeppelin (ERC20, AccessControl, ECDSA, ReentrancyGuard, Pausable)

AMM Integration:
PancakeSwap Router + Factory Interfaces

---

# 2. AI & AGENT LAYER

---

## Q8: Which AI system is used?

Grok AI

Role:

Grok functions as the reasoning engine behind adaptive market logic.

It powers autonomous agents that:

* Evaluate token launch conditions
* Analyze on-chain market behavior
* Recommend or trigger evolution phase shifts
* Detect abnormal volatility
* Detect whale manipulation patterns
* Suggest liquidity unlock adjustments

Grok is not embedded on-chain.

It operates off-chain and outputs:

* Market Stability Score
* Phase transition signals
* Risk alerts

Signed outputs are verified by smart contracts.

---

# 3. AGENT-BASED ARCHITECTURE (OpenClaude-Style)

Instead of a single AI module, the system uses specialized agents.

Each agent has a focused responsibility.

---

## Agent 1: Market Intelligence Agent

Monitors:

* Buy/sell ratio
* Liquidity depth
* Trade velocity
* Slippage patterns

Outputs:

* Market Stability Score
* Volatility Risk Index

---

## Agent 2: Liquidity Orchestrator Agent

Responsibilities:

* Recommend progressive liquidity unlock timing
* Freeze unlock during instability
* Trigger next tranche during growth stability

---

## Agent 3: Reputation Analysis Agent

Analyzes:

* Wallet holding duration
* Dump frequency
* Past launch behavior
* Participation consistency

Outputs:

* Reputation Score
* Allocation Weight

---

## Agent 4: Phase Evolution Agent

Decides:

* Transition between Protective Mode
* Growth Mode
* Expansion Mode
* Governance Mode

This agent consumes signals from other agents.

---

## Agent Communication Model

Agents operate independently.

Outputs are:

* Signed state payloads
* Verified on-chain
* Deterministically executed

This avoids centralized override risk.

---

# 4. BACKEND LAYER

Backend Runtime:
Node.js

Purpose:

* Orchestrates agent execution
* Listens to on-chain events
* Sends signed adaptive updates
* Maintains state logs

Web3 SDK:
Ethers.js

---

# 5. DATABASE LAYER

Primary Storage:
MongoDB

Stores:

* Launch metadata
* Agent outputs
* MSS history
* Phase transition logs
* Reputation scores

No Redis used.

All caching handled through in-memory process logic if required.

---

# 6. FRONTEND LAYER

Framework:
Next.js

Language:
TypeScript

Wallet Integration:
Wagmi
Viem

UI Framework:
TailwindCSS

Dashboard Features:

* Phase timeline view
* MSS evolution graph
* Liquidity unlock progress
* Agent decision logs

---

# 7. SECURITY MODEL

Signature Verification:

OpenZeppelin ECDSA

Agent outputs must:

* Be signed
* Be within bounded parameter limits
* Pass contract-level validation

No direct AI control over raw token parameters.

---

# 8. GOVERNANCE LAYER

Governance Module:

* DAO-based override
* Emergency freeze capability
* Adaptive logic disabling in final phase

---

# 9. WHY AGENT ARCHITECTURE IS STRONGER

Instead of:

Single AI scoring module

You now have:

Multi-agent modular reasoning system.

This:

* Increases clarity
* Reduces single-point failure
* Looks architecturally advanced
* Aligns with autonomous agent narrative
* Fits your broader “Auto Agent” expertise

---

# Final Architecture Summary

Blockchain:
BNB Smart Chain

Contracts:
Solidity + OpenZeppelin

AI Engine:
Grok AI

Agent Model:
Multi-agent autonomous orchestration

Backend:
Node.js + Ethers.js

Database:
MongoDB

Frontend:
Next.js + Shadcn UI + Tailwind + web3 wallet integration

Security:
ECDSA-based signed agent execution

---
