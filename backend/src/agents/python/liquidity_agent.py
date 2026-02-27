import os
import json
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

class LiquidityOrchestratorAgent:
    def __init__(self, rpc_url, vault_address):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.vault_address = self.w3.to_checksum_address(vault_address)
        self.abi = [
            {"constant": True, "inputs": [], "name": "getTotalTranches", "outputs": [{"name": "", "type": "uint256"}], "type": "function"},
            {"constant": True, "inputs": [{"name": "index", "type": "uint256"}], "name": "tranches", "outputs": [{"name": "amount", "type": "uint256"}, {"name": "mssThreshold", "type": "uint256"}, {"name": "phaseRequirement", "type": "uint8"}, {"name": "isReleased", "type": "bool"}], "type": "function"}
        ]

    def evaluate_unlocks(self, current_mss, current_phase):
        """
        Evaluates which liquidity tranches are eligible for release.
        Zero placeholders: Reads directly from the Vault contract.
        """
        try:
            vault = self.w3.eth.contract(address=self.vault_address, abi=self.abi)
            total_tranches = vault.functions.getTotalTranches().call()
            
            unlocks = []
            for i in range(total_tranches):
                tranche = vault.functions.tranches(i).call()
                # tranche = [amount, mssThreshold, phaseRequirement, isReleased]
                
                if not tranche[3]: # If not already released
                    if current_mss >= tranche[1] and current_phase >= tranche[2]:
                        unlocks.append({
                            "index": i,
                            "amount": str(tranche[0]),
                            "reason": f"Met MSS {tranche[1]} and Phase {tranche[2]}"
                        })
            
            return {
                "eligibleUnlocks": unlocks,
                "count": len(unlocks)
            }
        except Exception as e:
            return {"error": str(e)}

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--mss", type=float, required=True)
    parser.add_argument("--phase", type=int, required=True)
    args = parser.parse_args()
    
    rpc_url = os.getenv("BNB_RPC_URL")
    vault_addr = os.getenv("LIQUIDITY_VAULT_ADDRESS")
    
    agent = LiquidityOrchestratorAgent(rpc_url, vault_addr)
    result = agent.evaluate_unlocks(args.mss, args.phase)
    print(json.dumps(result))
