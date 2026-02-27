const hre = require("hardhat");

async function main() {
    console.log("Checking account balance...\n");

    // PancakeSwap addresses for BSC Testnet
    let PANCAKE_ROUTER, PANCAKE_FACTORY;
    
    const chainId = Number((await hre.ethers.provider.getNetwork()).chainId);
    const [deployer] = await hre.ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    
    console.log(`Account: ${deployer.address}`);
    console.log(`Balance: ${hre.ethers.formatEther(balance)} BNB`);
    console.log(`Balance (wei): ${balance.toString()}\n`);
    
    if (chainId === 31337) {
        // Hardhat local network
        PANCAKE_ROUTER = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
        PANCAKE_FACTORY = "0x6725F303b657a9451d8BA641348b6761A6CC7a17";
        console.log("⚠️  Running on local Hardhat network. Using mock addresses.\n");
    } else if (chainId === 97) {
        // BSC Testnet
        PANCAKE_ROUTER = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
        PANCAKE_FACTORY = "0x6725F303b657a9451d8BA641348b6761A6CC7a17";
        console.log("✓ Connected to BSC Testnet\n");
    } else {
        throw new Error(`Unsupported network. Chain ID: ${chainId}`);
    }

    // Get gas price to estimate cost
    const feeData = await hre.ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    
    // Estimate factory deployment: ~600k gas
    const estimatedFactoryGas = 600000n;
    const estimatedFactoryCost = estimatedFactoryGas * gasPrice;
    
    console.log(`Gas Price: ${hre.ethers.formatUnits(gasPrice, 'gwei')} gwei`);
    console.log(`Estimated LaunchFactory cost: ${hre.ethers.formatEther(estimatedFactoryCost)} BNB\n`);
    
    // Check if we have enough for factory deployment
    if (balance < estimatedFactoryCost) {
        console.log("❌ INSUFFICIENT FUNDS FOR DEPLOYMENT\n");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        const shortfall = estimatedFactoryCost - balance;
        console.log(`  Current Balance:    ${hre.ethers.formatEther(balance)} BNB`);
        console.log(`  Needed for Deploy:  ${hre.ethers.formatEther(estimatedFactoryCost)} BNB`);
        console.log(`  SHORTFALL:          ${hre.ethers.formatEther(shortfall)} BNB ⚠️\n`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        
        console.log("📝 HOW TO FIX:\n");
        console.log("1. GET TEST BNB FROM FAUCET:");
        console.log("   URL: https://testnet.binance.org/faucet-smart\n");
        console.log("2. PROVIDE YOUR WALLET ADDRESS:");
        console.log(`   ${deployer.address}\n`);
        console.log("3. REQUEST 0.5 BNB:");
        console.log("   Method: Select BNB token and click 'Claim'");
        console.log("   Wait: Usually 5-10 minutes\n");
        console.log("4. TRY DEPLOYMENT AGAIN:\n");
        console.log(`   npx hardhat run scripts/deploy-clean.js --network bscTestnet\n`);
        
        process.exit(1);
    }

    console.log("✅ Sufficient funds! Deploying LaunchFactory...\n");

    try {
        const LaunchFactory = await hre.ethers.getContractFactory("LaunchFactory", deployer);
        const factory = await LaunchFactory.deploy(PANCAKE_ROUTER, PANCAKE_FACTORY);

        await factory.waitForDeployment();
        const factoryAddress = await factory.getAddress();

        console.log(`\n🎉 LaunchFactory deployed to: ${factoryAddress}\n`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`LAUNCH_FACTORY_ADDRESS=${factoryAddress}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

        // Save to file
        const fs = require("fs");
        const addresses = {
            launchFactory: factoryAddress,
            deployedAt: new Date().toISOString(),
            deployer: deployer.address,
            network: "bscTestnet"
        };
        fs.writeFileSync("deployment-addresses.json", JSON.stringify(addresses, null, 2));
        console.log("✓ Addresses saved to deployment-addresses.json\n");

        // Skip createLaunch on local network
        if (chainId === 31337) {
            console.log("✓ Local deployment complete!");
            return;
        }

        console.log("📝 NEXT STEPS:\n");
        console.log("1. Update frontend contract address in:");
        console.log("   /frontend/lib/contracts/index.ts\n");
        console.log("   Replace LAUNCH_FACTORY: with the address above\n");
        console.log("2. Test frontend:");
        console.log("   cd ../frontend");
        console.log("   npm run dev\n");
        console.log("3. Visit: http://localhost:3000\n");

    } catch (err) {
        console.error("❌ Deployment failed:\n");
        console.error("Error:", err.message);
        if (err.reason) console.error("Reason:", err.reason);
        process.exit(1);
    }
}

main();
