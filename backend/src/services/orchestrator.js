const { analyzeMarket } = require('../agents/marketAgent');
const { evaluatePhaseTransition } = require('../agents/phaseAgent');
const { signAgentSignal } = require('./signingService');
const { getContractWithSigner, agentWallet } = require('./blockchain');
const dotenv = require('dotenv');

dotenv.config();

const runEvaluationCycle = async () => {
    console.log(`[${new Date().toISOString()}] Starting Agent Evaluation Cycle...`);

    try {
        const tokenAddress = process.env.ADAPTIVE_TOKEN_ADDRESS;
        const pairAddress = process.env.AMM_PAIR_ADDRESS;
        const controllerAddress = process.env.EVOLUTION_CONTROLLER_ADDRESS;

        // 1. Market Intelligence
        const marketData = await analyzeMarket(tokenAddress, pairAddress);
        console.log(`Market Data: MSS=${marketData.mss}, Analysis=${marketData.analysis}`);

        // 2. Determine Parameters (Simplified mapping for demo)
        let sellTax = 500; // 5% base
        let buyTax = 200;  // 2% base
        if (marketData.mss < 40) {
            sellTax = 1500; // Increase tax in Protective mode
        }

        // 3. Sign Payload
        const timestamp = Math.floor(Date.now() / 1000);
        const nonce = 0; // This should be fetched from contract for each agent
        const signature = await signAgentSignal(
            marketData.mss,
            sellTax,
            buyTax,
            10000, // maxTxAmt (placeholder)
            20000, // maxWallet (placeholder)
            timestamp,
            nonce,
            controllerAddress
        );

        // 4. Submit to EvolutionController (if agent is authorized)
        // const controller = getContractWithSigner(controllerAddress, ABIs.EvolutionController);
        // await controller.processAgentSignal(...);

        console.log("Evaluation Cycle Complete. Signal Generated.");

    } catch (error) {
        console.error("Evaluation Cycle Error:", error.message);
    }
};

const startOrchestrator = () => {
    const interval = parseInt(process.env.UPDATE_INTERVAL_MS) || 60000;
    setInterval(runEvaluationCycle, interval);
    runEvaluationCycle(); // Initial run
};

module.exports = {
    startOrchestrator
};
