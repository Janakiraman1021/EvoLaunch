# EvoLaunch Protocol

## Real-Time Execution Output Specification

---

# 1. Execution Policy

This system must operate entirely on real-time blockchain state.

The following are explicitly prohibited:

* Mock liquidity
* Simulated trades
* Hardcoded MSS values
* Artificial phase transitions
* Manual override during demo
* Pre-scripted state changes
* UI-only simulation
* Fake volatility injection

All behavior must emerge from real BNB Smart Chain interactions.

---

# 2. Real Blockchain Requirement

The system must be deployed on:

BNB Smart Chain Testnet (minimum requirement)

Optional:
BNB Mainnet (if safe)

All outputs must be derived from:

* Live RPC data
* Real contract events
* Real token transfers
* Real liquidity pool changes

No local-only blockchain allowed for final demo.

---

# 3. Real Liquidity Requirement

Liquidity must be:

* Actually added to PancakeSwap
* LP tokens minted
* LP tokens transferred to LiquidityVault
* Unlock controlled by real contract logic

Unlock events must be verifiable on-chain.

No fake liquidity accounting.

---

# 4. Real Agent Computation Requirement

Grok-powered agents must:

* Pull live on-chain data
* Compute MSS using real metrics
* Analyze real transaction flows
* Produce real signed payloads
* Send real transactions to EvolutionController

No hardcoded MSS values allowed.

---

# 5. Real Market Stability Logic

MSS must be computed using:

* Real buy/sell transactions
* Real liquidity depth
* Real slippage
* Real holder distribution

Phase transitions must only occur when:

On-chain metrics justify threshold crossing.

No manual phase forcing.

---

# 6. Real Phase Transition Enforcement

EvolutionController must:

* Accept only signed payloads
* Verify ECDSA signatures
* Reject invalid or replayed payloads
* Update phase state on-chain
* Emit real events

Transitions must be triggered by real agent outputs only.

---

# 7. Real Adaptive Token Behavior

During real sell pressure:

* Sell tax must adjust within bounds.
* Transaction cap must adjust.
* Liquidity unlock must pause if instability detected.

These changes must affect real PancakeSwap trades.

You must be able to:

* Execute real swap
* Observe tax change
* Confirm liquidity lock behavior

---

# 8. Real Reputation Scoring

Wallet reputation must be computed using:

* Real wallet transaction history
* Real holding duration
* Real participation data

Allocation must be affected by computed score.

No static test score allowed.

---

# 9. Real Governance Safety

DAO or governance actions must:

* Execute real transactions
* Emit real events
* Freeze logic on-chain if triggered

No front-end-only freeze.

---

# 10. Demonstration Requirement

Demo must include:

1. Deploy contracts on BNB testnet.
2. Add real liquidity.
3. Execute real buy transactions.
4. Execute real sell transactions.
5. Let MSS compute naturally.
6. Trigger phase downgrade based on actual instability.
7. Show tax parameter adjustment affecting live trades.
8. Show liquidity unlock freeze in real contract state.

All steps must be verifiable via BNB explorer.

---

# 11. Observable Verification Criteria

Judges must be able to:

* View contracts on BNB explorer
* See LP tokens locked in vault
* Observe phase state variable changes
* Verify agent-signed payload transaction
* See adaptive parameter changes reflected in live swaps

If any behavior cannot be verified on-chain, it is invalid.

---

# 12. Failure Condition

The system is considered invalid if:

* Any MSS is hardcoded
* Phase transitions are manually triggered
* Liquidity unlock is time-only
* Agent output is not signed
* Adaptive behavior does not impact real swap outcome
* Dashboard simulates instead of reflects real chain state

---

# 13. Minimum Real-Time Guarantees

The final output must guarantee:

* Real on-chain adaptive evolution
* Real liquidity orchestration
* Real Grok-based reasoning
* Real signature validation
* Real bounded deterministic enforcement

No mock mode exists in production demonstration.

---

# 14. Final Output Definition

The final output is:

A live, deployed adaptive token launch protocol on BNB Smart Chain where:

* Liquidity unlock responds to real market behavior
* Token parameters evolve based on real trading conditions
* Agents operate on real data
* All transitions are cryptographically verified
* All logic is enforced by smart contracts

This system must behave as a real infrastructure protocol, not a prototype simulation.

