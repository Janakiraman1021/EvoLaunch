

import os
import json
import time
from web3 import Web3
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class MarketIntelligenceAgent:
    def __init__(self, rpc_url, token_address, pair_address):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.token_address = self.w3.to_checksum_address(token_address)
        self.pair_address = self.w3.to_checksum_address(pair_address)
        
        # Standard ABIs
        self.pair_abi = [
            {"constant": True, "inputs": [], "name": "getReserves", "outputs": [{"name": "", "type": "uint112"}, {"name": "", "type": "uint112"}, {"name": "", "type": "uint32"}], "type": "function"},
            {"constant": True, "inputs": [], "name": "token0", "outputs": [{"name": "", "type": "address"}], "type": "function"}
        ]
        self.token_abi = [
            {"constant": True, "inputs": [{"name": "account", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "", "type": "uint256"}], "type": "function"},
            {"constant": True, "inputs": [], "name": "totalSupply", "outputs": [{"name": "", "type": "uint256"}], "type": "function"}
        ]

    def fetch_live_metrics(self):
        """Fetches raw data directly from BNB Chain."""
        try:
            pair_contract = self.w3.eth.contract(address=self.pair_address, abi=self.pair_abi)
            token_contract = self.w3.eth.contract(address=self.token_address, abi=self.token_abi)
            
            # 1. Liquidity (Reserves)
            reserves = pair_contract.functions.getReserves().call()
            token0 = pair_contract.functions.token0().call()
            
            # Determine WBNB side (assuming the other token in the pair is BNB for this protocol)
            # In production, we'd verify the other token is actually WBNB.
            is_token0_evo = token0.lower() == self.token_address.lower()
            wbnb_reserve = reserves[1] if is_token0_evo else reserves[0]
            
            # 2. Total Supply & Distribution
            total_supply = token_contract.functions.totalSupply().call()
            
            return {
                "wbnb_reserve": wbnb_reserve / 1e18,
                "total_supply": total_supply / 1e18,
                "timestamp": int(time.time())
            }
        except Exception as e:
            print(f"Error fetching live metrics: {e}")
            return None

    def calculate_mss(self, metrics, rolling_data):
        """Mathematically derives MSS (0-100) from live metrics."""
        # 1. Liquidity Score (40%)
        # Benchmarking 50 BNB as 'ideal' liquidity for a small/medium cap on BNB Chain
        l_score = min(100, (metrics['wbnb_reserve'] / 50) * 100)
        
        # 2. Volatility Score (30%)
        # rolling_data contains {buyPressure, buyCount, sellCount} from Node.js events
        deviation = abs(rolling_data.get('buyPressure', 50) - 50)
        v_score = max(0, 100 - deviation * 2)
        
        # 3. Distribution Score (20%)
        # Whale ratio provided by Node.js event listener
        total_evs = rolling_data.get('buyCount', 0) + rolling_data.get('sellCount', 0) or 1
        whale_ratio = rolling_data.get('whaleCount', 0) / total_evs
        d_score = max(0, 100 - whale_ratio * 200)
        
        # 4. Participation Score (10%)
        p_score = min(100, rolling_data.get('uniqueBuyers', 0) * 5)
        
        raw_mss = (l_score * 0.4) + (v_score * 0.3) + (d_score * 0.2) + (p_score * 0.1)
        return round(raw_mss), l_score, v_score, d_score, p_score

def run_agent(metrics_json, raw_mss_in):
    # This is a bridge between Node.js data and Python logic
    # In a full Python implementation, we'd fetch EVERYTHING here.
    # For now, we use the raw data from Node.js events + live RPC liquidity.
    
    rpc_url = os.getenv("BNB_RPC_URL")
    token_addr = os.getenv("ADAPTIVE_TOKEN_ADDRESS")
    pair_addr = os.getenv("AMM_PAIR_ADDRESS")
    
    agent = MarketIntelligenceAgent(rpc_url, token_addr, pair_addr)
    live_data = agent.fetch_live_metrics()
    
    if not live_data:
        return {"error": "Failed to fetch on-chain metrics"}
    
    rolling_data = json.loads(metrics_json)
    mss, l, v, d, p = agent.calculate_mss(live_data, rolling_data)
    
    # ─── Grok Reasoning Layer ───────────────────────────────
    api_key = os.getenv("GROK_API_KEY")
    client = Groq(api_key=api_key)
    
    system_prompt = """You are a senior AI Risk Analyst for EvoLaunch Protocol on BNB Chain.
Analyze the provided metrics and return a JSON object with:
{
  "mssAdjustment": <int -5 to +5>,
  "riskLevel": <float 0.0 to 1.0>,
  "phaseRecommendation": <0, 1, or 2>,
  "analysis": "string"
}"""
    
    user_message = f"""Live Metrics:
- MSS (Math): {mss}
- Liquidity (BNB): {live_data['wbnb_reserve']}
- Buy Pressure: {rolling_data.get('buyPressure')}%
- Unique Buyers: {rolling_data.get('uniqueBuyers')}
- Whale Ratio: {d}% Score"""
    
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        reasoning = json.loads(completion.choices[0].message.content)
        
        final_mss = max(0, min(100, mss + reasoning.get('mssAdjustment', 0)))
        
        return {
            "mss": final_mss,
            "rawMSS": mss,
            "volatilityRisk": reasoning.get('riskLevel', 0.5),
            "liquidityStress": (100 - l) / 100,
            "analysis": reasoning.get('analysis', "Mathematical assessment complete."),
            "phaseRecommendation": reasoning.get('phaseRecommendation', 0)
        }
    except Exception as e:
        # On AI failure, return the mathematical MSS as fallback (Zero Placeholder Policy)
        return {
            "mss": mss,
            "rawMSS": mss,
            "volatilityRisk": (100 - v) / 100,
            "liquidityStress": (100 - l) / 100,
            "analysis": "AI reasoning failed; using deterministic mathematical score.",
            "error": str(e)
        }

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--metrics", required=True)
    parser.add_argument("--mss", type=float, default=50.0)
    args = parser.parse_args()
    
    result = run_agent(args.metrics, args.mss)
    print(json.dumps(result))
