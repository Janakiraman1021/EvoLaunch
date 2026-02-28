const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("Deploying token infrastructure via LaunchFactory...\n");

    const [deployer] = await hre.ethers.getSigners();
    const LAUNCH_FACTORY_ADDRESS = "0x4Ab4727c436077cD56652166d32503f959e943Ab";

    console.log(`Account: ${deployer.address}`);
    console.log(`LaunchFactory: ${LAUNCH_FACTORY_ADDRESS}\n`);

    // Get the LaunchFactory contract
    const LaunchFactory = await hre.ethers.getContractFactory("LaunchFactory");
    const factory = LaunchFactory.attach(LAUNCH_FACTORY_ADDRESS);

    // Create launch parameters
    const launchParams = {
        name: "EvoLaunch Sample Token",
        symbol: "EVO",
        totalSupply: hre.ethers.parseEther("1000000"), // 1M tokens
        initialSellTax: 500, // 5%
        initialBuyTax: 200, // 2%
        initialMaxTx: hre.ethers.parseEther("10000"), // 10k tokens
        initialMaxWallet: hre.ethers.parseEther("20000"), // 20k tokens
        minTax: 0, // 0%
        maxTax: 2500, // 25%
        minMaxTx: hre.ethers.parseEther("1000"), // 1k tokens
        minMaxWallet: hre.ethers.parseEther("2000"), // 2k tokens
        feeCollector: deployer.address,
        agentPublicKeys: [deployer.address]
    };

    console.log("📝 Token Parameters:");
    console.log(`  Name: ${launchParams.name}`);
    console.log(`  Symbol: ${launchParams.symbol}`);
    console.log(`  Supply: 1,000,000 tokens`);
    console.log(`  Initial Sell Tax: 5%`);
    console.log(`  Initial Buy Tax: 2%\n`);

    try {
        console.log("Calling createLaunch()...\n");

        // Estimate gas
        const gasEstimate = await factory.createLaunch.estimateGas(launchParams);
        console.log(`Gas estimate: ${gasEstimate.toString()}`);

        // Call createLaunch with higher gas limit
        const tx = await factory.createLaunch(launchParams, {
            gasLimit: Math.floor(Number(gasEstimate) * 1.2) // 20% buffer
        });

        console.log(`📤 Transaction sent: ${tx.hash}\n`);
        console.log("⏳ Waiting for confirmation...\n");

        const receipt = await tx.wait();

        if (!receipt || receipt.status === 0) {
            console.error("❌ Transaction reverted!");
            process.exit(1);
        }

        console.log("✅ Transaction confirmed!\n");

        // Parse LaunchCreated event from logs
        const launchEvent = receipt.logs
            .map((log) => {
                try {
                    return factory.interface.parseLog(log);
                } catch (e) {
                    return null;
                }
            })
            .find((parsed) => parsed && parsed.name === "LaunchCreated");

        if (!launchEvent) {
            console.error("❌ LaunchCreated event not found in logs!");
            process.exit(1);
        }

        const [token, vault, controller, governance, ammPair] = launchEvent.args;

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🎉 DEPLOYMENT SUCCESSFUL!\n");
        console.log("📋 Deployed Contracts:\n");
        console.log(`  LaunchFactory:       ${LAUNCH_FACTORY_ADDRESS}`);
        console.log(`  AdaptiveToken:       ${token}`);
        console.log(`  LiquidityVault:      ${vault}`);
        console.log(`  EvolutionController: ${controller}`);
        console.log(`  GovernanceModule:    ${governance}`);
        console.log(`  AMM Pair:            ${ammPair}\n`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

        // Update backend .env file
        const envPath = path.join(__dirname, "../../backend/.env");
        let envContent = fs.readFileSync(envPath, "utf8");

        // Update addresses in .env
        envContent = envContent.replace(
            /ADAPTIVE_TOKEN_ADDRESS=.*/,
            `ADAPTIVE_TOKEN_ADDRESS=${token}`
        );
        envContent = envContent.replace(
            /LIQUIDITY_VAULT_ADDRESS=.*/,
            `LIQUIDITY_VAULT_ADDRESS=${vault}`
        );
        envContent = envContent.replace(
            /EVOLUTION_CONTROLLER_ADDRESS=.*/,
            `EVOLUTION_CONTROLLER_ADDRESS=${controller}`
        );
        envContent = envContent.replace(
            /GOVERNANCE_MODULE_ADDRESS=.*/,
            `GOVERNANCE_MODULE_ADDRESS=${governance}`
        );

        fs.writeFileSync(envPath, envContent);
        console.log("✅ Updated backend/.env with all addresses\n");

        // Also update contracts .env if it exists
        const contractsEnvPath = path.join(__dirname, ".env");
        if (fs.existsSync(contractsEnvPath)) {
            let contractsEnv = fs.readFileSync(contractsEnvPath, "utf8");
            contractsEnv = contractsEnv.replace(
                /ADAPTIVE_TOKEN_ADDRESS=.*/,
                `ADAPTIVE_TOKEN_ADDRESS=${token}`
            );
            contractsEnv = contractsEnv.replace(
                /LIQUIDITY_VAULT_ADDRESS=.*/,
                `LIQUIDITY_VAULT_ADDRESS=${vault}`
            );
            contractsEnv = contractsEnv.replace(
                /EVOLUTION_CONTROLLER_ADDRESS=.*/,
                `EVOLUTION_CONTROLLER_ADDRESS=${controller}`
            );
            contractsEnv = contractsEnv.replace(
                /GOVERNANCE_MODULE_ADDRESS=.*/,
                `GOVERNANCE_MODULE_ADDRESS=${governance}`
            );
            fs.writeFileSync(contractsEnvPath, contractsEnv);
            console.log("✅ Updated contracts/.env with all addresses\n");
        }

        // Save to JSON file
        const deploymentAddresses = {
            launchFactory: LAUNCH_FACTORY_ADDRESS,
            adaptiveToken: token,
            liquidityVault: vault,
            evolutionController: controller,
            governanceModule: governance,
            ammPair: ammPair,
            deployedAt: new Date().toISOString(),
            deployer: deployer.address,
            transactionHash: tx.hash,
            blockNumber: receipt.blockNumber,
            network: "bscTestnet"
        };

        fs.writeFileSync(
            path.join(__dirname, "deployment-addresses-full.json"),
            JSON.stringify(deploymentAddresses, null, 2)
        );
        console.log("✅ Saved full deployment addresses to deployment-addresses-full.json\n");

        console.log("📝 NEXT STEPS:\n");
        console.log("1. ✅ LaunchFactory deployed");
        console.log("2. ✅ AdaptiveToken deployed");
        console.log("3. ✅ LiquidityVault deployed");
        console.log("4. ✅ EvolutionController deployed");
        console.log("5. ✅ GovernanceModule deployed");
        console.log("6. ✅ Backend .env updated\n");
        console.log("All contracts are now live on BSC Testnet! 🚀\n");

    } catch (err) {
        console.error("❌ Deployment failed:\n");
        console.error("Error:", err.message);

        if (err.reason) {
            console.error("Reason:", err.reason);
        }

        // Check if it's a revert error
        if (err.data) {
            console.error("Error Data:", err.data);
        }

        console.error("\n💡 Troubleshooting:");
        console.error("- Make sure you have enough BNB for gas");
        console.error("- Check that LaunchFactory address is correct");
        console.error("- Verify PancakeSwap addresses are valid for BSC Testnet\n");

        process.exit(1);
    }
}

main();
