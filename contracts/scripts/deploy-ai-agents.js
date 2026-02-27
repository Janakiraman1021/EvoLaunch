const hre = require("hardhat");

/**
 * Deploy AI Agent Factory (isolated from human launchpad deployment).
 * This script ONLY deploys the AgentFactory contract.
 * The existing LaunchFactory and human launchpad are NOT touched.
 */
async function main() {
    const chainId = Number((await hre.ethers.provider.getNetwork()).chainId);
    const [deployer] = await hre.ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);

    console.log("=== AI Agent Factory Deployment ===\n");
    console.log(`Network Chain ID: ${chainId}`);
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Balance: ${hre.ethers.formatEther(balance)} BNB\n`);

    // Deploy AgentFactory
    console.log("Deploying AgentFactory...");
    const AgentFactory = await hre.ethers.getContractFactory("AgentFactory", deployer);
    const factory = await AgentFactory.deploy();
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log(`✓ AgentFactory deployed to: ${factoryAddress}\n`);

    // Create a test agent on testnet
    if (chainId !== 31337) {
        console.log("Creating test AI Agent...");
        try {
            const tx = await factory.createAgent(
                "Test Trading Agent",        // name
                "TTA",                       // symbol
                hre.ethers.parseEther("1000000"), // 1M tokens
                "trading",                   // strategy type
                deployer.address,            // executor (deployer for testing)
                2000,                        // 20% max capital per trade
                5000,                        // 50% max daily deployment
                1500,                        // 15% max drawdown
                { value: hre.ethers.parseEther("0.01"), gasLimit: 5000000 }
            );

            const receipt = await tx.wait();
            console.log(`✓ Test agent created! TX: ${receipt.hash}`);

            // Read agent data
            const agentData = await factory.getAgent(0);
            console.log("\n--- AI Agent Deployment Manifest ---");
            console.log(`AGENT_FACTORY_ADDRESS=${factoryAddress}`);
            console.log(`AGENT_TOKEN_ADDRESS=${agentData.agentToken}`);
            console.log(`AGENT_TREASURY_ADDRESS=${agentData.treasury}`);
            console.log(`AGENT_RISK_CONTROLLER_ADDRESS=${agentData.riskController}`);
            console.log(`AGENT_PERFORMANCE_TRACKER_ADDRESS=${agentData.performanceTracker}`);
            console.log(`AGENT_REVENUE_DISTRIBUTOR_ADDRESS=${agentData.revenueDistributor}`);
            console.log(`AGENT_STRATEGY_TYPE=${agentData.strategyType}`);
            console.log("------------------------------------\n");
        } catch (err) {
            console.error("⚠️  Test agent creation failed:", err.message);
            console.log("  Factory deployed successfully. You can create agents later.\n");
        }
    } else {
        console.log("⚠️  Running on Hardhat local network.");
        console.log("   Factory deployed. Skip test agent creation on local.\n");
    }

    console.log("=== Deployment Complete ===");
    console.log(`AgentFactory: ${factoryAddress}`);

    // Save addresses
    const fs = require("fs");
    const addresses = {
        agentFactory: factoryAddress,
        network: chainId === 97 ? "bscTestnet" : chainId === 56 ? "bscMainnet" : "hardhat",
        deployedAt: new Date().toISOString()
    };
    fs.writeFileSync(
        "deployment-addresses-ai-agent.json",
        JSON.stringify(addresses, null, 2)
    );
    console.log("✓ Addresses saved to deployment-addresses-ai-agent.json");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
