import os
import json
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

class PhaseEvolutionAgent:
    def __init__(self, rpc_url, controller_address):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.controller_address = self.w3.to_checksum_address(controller_address)
        self.abi = [
            {"constant": True, "inputs": [], "name": "currentPhase", "outputs": [{"name": "", "type": "uint8"}], "type": "function"},
            {"constant": True, "inputs": [], "name": "currentMSS", "outputs": [{"name": "", "type": "uint256"}], "type": "function"}
        ]

    def evaluate(self, mss, volatility_risk, liquidity_stress):
        """
        Determines the next phase based on MSS and market risks.
        Follows a strict 'one step at a time' upward transition.
        Downgrades are immediate on high risk.
        """
        try:
            controller = self.w3.eth.contract(address=self.controller_address, abi=self.abi)
            current_phase = controller.functions.currentPhase().call()
            
            next_phase = current_phase
            reason = "Market stable; maintaining current phase."

            # Emergency Downgrade Logic (Thresholds: risk > 0.8 or stress > 0.8)
            if volatility_risk > 0.8 or liquidity_stress > 0.8:
                next_phase = 0 # Protective
                reason = f"Emergency downgrade: volatility={volatility_risk:.2f} stress={liquidity_stress:.2f}"
            
            # Evolution Logic
            elif mss >= 80:
                if current_phase < 2: # Max Phase 2 (Expansion) for automated agents
                    next_phase = current_phase + 1
                    reason = f"MSS {mss} allows upgrade to phase {next_phase}."
            elif mss < 40:
                if current_phase > 0:
                    next_phase = current_phase - 1
                    reason = f"MSS {mss} requires downgrade to phase {next_phase}."
            
            return {
                "currentPhase": current_phase,
                "nextPhase": next_phase,
                "reason": reason
            }
        except Exception as e:
            return {"error": str(e)}

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--mss", type=float, required=True)
    parser.add_argument("--volatility", type=float, required=True)
    parser.add_argument("--stress", type=float, required=True)
    args = parser.parse_args()
    
    rpc_url = os.getenv("BNB_RPC_URL")
    controller_addr = os.getenv("EVOLUTION_CONTROLLER_ADDRESS")
    
    agent = PhaseEvolutionAgent(rpc_url, controller_addr)
    result = agent.evaluate(args.mss, args.volatility, args.stress)
    print(json.dumps(result))
