
# EvoLaunch Protocol

## Required Skills & Capabilities for Autonomous Build Agent

---

# 1. System-Level Understanding

The agent must understand:

* EVM-based blockchain architecture
* Smart contract state machines
* Token lifecycle dynamics
* Liquidity provisioning mechanics
* Automated market maker behavior
* Adversarial trading environments
* Bounded deterministic execution logic
* Off-chain to on-chain communication boundaries

The agent must reason about financial systems, not just write code.

---

# 2. Smart Contract Engineering Capability

The agent must be able to:

* Design and implement ERC20-compatible tokens
* Extend token behavior with dynamic transfer hooks
* Implement bounded parameter control logic
* Enforce immutable constraints
* Write reentrancy-safe contracts
* Use access control patterns correctly
* Implement ECDSA signature verification
* Design modular contract architecture
* Implement factory pattern deployments
* Design liquidity vault contracts
* Implement phased state machines
* Write deterministic upgrade-safe logic

The agent must avoid:

* Unbounded parameter mutation
* Unsafe external calls
* Centralized override vulnerabilities
* Gas-inefficient loops

---

# 3. Progressive Liquidity Management Expertise

The agent must understand:

* LP token mechanics
* PancakeSwap-style AMM architecture
* Liquidity provisioning workflow
* Slippage and price impact behavior
* Liquidity lock contracts
* Tranche-based unlock mechanisms

The agent must design:

* Controlled liquidity release logic
* Conditional unlock triggers
* Freeze conditions under instability
* Bound-checked release pacing

---

# 4. Tokenomics & Market Behavior Modeling

The agent must reason about:

* Early-stage volatility
* Whale behavior patterns
* Liquidity drain attacks
* Buy/sell imbalance
* Distribution fairness metrics
* Incentive alignment

The agent must design:

* Phase-based token behavior
* Adaptive tax logic
* Sell throttle mechanisms
* Incentive multiplier adjustments
* Stability-triggered parameter shifts

The agent must not rely on static tokenomics assumptions.

---

# 5. Multi-Agent System Design Capability

The agent must understand:

* Distributed decision-making systems
* Independent agent specialization
* Signal aggregation logic
* Deterministic enforcement boundaries
* Cryptographic message verification

The agent must design:

* Market Intelligence Agent
* Liquidity Orchestrator Agent
* Reputation Agent
* Phase Evolution Agent

The agent must ensure:

* No single agent controls state
* Signals are cryptographically verifiable
* Bounded authority enforcement
* Deterministic contract validation

---

# 6. Grok AI Integration Capability

The agent must:

* Integrate Grok as reasoning engine
* Structure prompt-based inference correctly
* Parse AI outputs deterministically
* Convert qualitative AI reasoning into quantitative bounded metrics
* Ensure Grok output does not bypass contract constraints
* Implement fallback logic if AI fails

AI outputs must be converted into structured payloads with:

* MSS value
* Risk indicators
* Transition recommendation
* Timestamp
* Signature

---

# 7. Backend Engineering Capability

The agent must be able to:

* Build event listeners for smart contract events
* Query BNB chain via RPC
* Process on-chain data
* Compute volatility metrics
* Execute scheduled evaluation cycles
* Generate signed transaction payloads
* Relay transactions securely
* Implement secure key management

The agent must understand asynchronous blockchain event handling.

---

# 8. Cryptographic Competency

The agent must:

* Implement ECDSA signing
* Verify signatures on-chain
* Manage private/public key pairs
* Rotate agent keys securely
* Prevent replay attacks using nonce or timestamp validation
* Validate message freshness

Cryptographic integrity is mandatory for adaptive updates.

---

# 9. Security Engineering Capability

The agent must anticipate:

* Reentrancy attacks
* Liquidity manipulation attacks
* Whale coordination strategies
* Artificial volatility injection
* Agent key compromise
* Governance capture
* Parameter bound bypass attempts

The agent must implement:

* Parameter min/max constraints
* Emergency pause logic
* Multi-agent approval threshold
* Bounded transition enforcement
* Immutable configuration after deployment

The agent must test:

* Edge-case transitions
* Phase downgrade loops
* Liquidity unlock race conditions
* Signature spoofing attempts

---

# 10. Governance & Decentralization Design

The agent must:

* Implement DAO override mechanisms
* Allow agent key rotation
* Enforce immutable launch constraints
* Prevent founder centralization
* Ensure adaptive logic can be frozen in final phase

The agent must design governance as a safety net, not a control override.

---

# 11. Frontend & Observability Awareness

The agent must design:

* Real-time phase visualization
* MSS trend tracking
* Liquidity unlock progression charts
* Agent decision logs
* Governance action tracking
* Parameter state dashboards

Transparency is critical to trust.

---

# 12. Database & Data Modeling

The agent must:

* Design normalized schema for:

  * Launch metadata
  * MSS history
  * Phase transitions
  * Reputation scores
  * Agent output logs
* Maintain chronological audit trail
* Avoid reliance on external caching layers

All system state must remain auditable.

---

# 13. Deterministic State Machine Design

The agent must:

* Model phase transitions as finite state machine
* Define explicit transition rules
* Prevent invalid phase skipping
* Support downgrade logic
* Enforce bounded transitions

Transitions must never rely on subjective evaluation.

---

# 14. Testing & Simulation Capability

The agent must simulate:

* High-volatility dump scenario
* Whale accumulation scenario
* Low-liquidity stress
* Rapid participation spike
* Governance override event

The agent must verify:

* Correct parameter adjustment
* Liquidity freeze activation
* Phase downgrade/upgrade behavior
* MSS calculation correctness

---

# 15. Deployment Competency

The agent must:

* Deploy contracts via factory
* Verify contract integrity
* Set initial bounds correctly
* Provision liquidity safely
* Register agent public keys
* Initialize phase state

Deployment must prevent misconfiguration.

---

# 16. Performance & Gas Awareness

The agent must:

* Avoid expensive on-chain loops
* Avoid redundant storage writes
* Minimize gas cost per transition
* Optimize transfer hook logic
* Avoid heavy computation on-chain

AI reasoning remains off-chain.

---

# 17. Economic Reasoning Skill

The agent must understand:

* Liquidity-to-supply ratio
* Market cap mechanics
* FDV implications
* Early-stage price discovery
* Incentive-driven participation
* Supply-demand balance

The agent must avoid naive token economics.

---

# 18. Architectural Discipline

The agent must:

* Separate intelligence from enforcement
* Maintain clean module boundaries
* Prevent circular dependency
* Avoid over-engineering
* Avoid unnecessary complexity
* Ensure hackathon feasibility

---

# 19. Failure Handling Capability

The agent must implement:

* Safe fallback if AI service unavailable
* MSS timeout fallback
* Emergency freeze if abnormal activity
* Manual governance intervention path

System must degrade safely, not catastrophically.

---

# 20. Mindset Requirements

The agent must operate with:

* Adversarial awareness
* Deterministic discipline
* Bounded authority principle
* Economic realism
* Security-first thinking
* Infrastructure-level reasoning

This project is not a UI demo.

It is infrastructure for adaptive market formation.

---

# Final Capability Summary

An agent building EvoLaunch must possess:

* Advanced smart contract engineering skills
* Multi-agent architecture design capability
* Market behavior modeling knowledge
* Grok AI integration expertise
* Cryptographic signature validation proficiency
* Liquidity and AMM understanding
* Governance-aware system design
* Security-first development discipline
* Deterministic state machine reasoning
* Economic modeling competence

Without these skills, the system will either become centralized, insecure, unstable, or economically flawed.
