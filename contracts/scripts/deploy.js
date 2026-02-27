const hre = require("hardhat");

async function main() {
    console.log("Checking account balance...\n");

    // PancakeSwap addresses for BNB Testnet
    let PANCAKE_ROUTER, PANCAKE_FACTORY;
    
    const chainId = Number((await hre.ethers.provider.getNetwork()).chainId);
    const [deployer] = await hre.ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    
    console.log(`Account: ${deployer.address}`);
    console.log(`Balance: ${hre.ethers.formatEther(balance)} BNB`);
    console.log(`Balance (wei): ${balance.toString()}\n`);
    
    if (chainId === 31337) {
        // Hardhat local network - use mock addresses (won't work but prevents deploy error)
        PANCAKE_ROUTER = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
        PANCAKE_FACTORY = "0x6725F303b657a9451d8BA641348b6761A6CC7a17";
        console.log("⚠️  Running on local Hardhat network. Using mock PancakeSwap addresses.");
        console.log("    createLaunch will fail. Deploy to BSC Testnet for real deployment.");
    } else if (chainId === 97) {
        // BSC Testnet
        PANCAKE_ROUTER = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
        PANCAKE_FACTORY = "0x6725F303b657a9451d8BA641348b6761A6CC7a17";
        console.log("✓ Connected to BSC Testnet");
    } else {
        throw new Error(`Unsupported network. Chain ID: ${chainId}`);
    }

    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deploying with account: ${deployer.address}`);

    const LaunchFactory = await hre.ethers.getContractFactory("LaunchFactory", deployer);
    const factory = await LaunchFactory.deploy(PANCAKE_ROUTER, PANCAKE_FACTORY);

    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();

    console.log(`LaunchFactory deployed to: ${factoryAddress}`);

    // Skip createLaunch on local network
    if (chainId === 31337) {
        console.log("\n✓ Factory deployment successful on local network");
        console.log("  To deploy a launch, use: npx hardhat run scripts/deploy.js --network bscTestnet");
        return;
    }

    // Create a sample launch on testnet
    const totalSupply = hre.ethers.parseEther("1000000"); // 1M tokens

    const launchParams = {
        name: "EvoLaunch Sample",
        symbol: "EVO",
        totalSupply: totalSupply,
        initialSellTax: 500,
        initialBuyTax: 200,
        initialMaxTx: hre.ethers.parseEther("10000"),
        initialMaxWallet: hre.ethers.parseEther("20000"),
        minTax: 0,
        maxTax: 2500,
        minMaxTx: hre.ethers.parseEther("1000"),
        minMaxWallet: hre.ethers.parseEther("2000"),
        feeCollector: deployer.address,
        agentPublicKeys: [deployer.address]
    };

    console.log("\nCalling createLaunch with parameters:");
    console.log(JSON.stringify(launchParams, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));

    try {
        // First, try to call it statically to see the actual error
        console.log("\nSimulating transaction with staticCall...");
        try {
            await factory.createLaunch.staticCall(launchParams);
            console.log("✓ Static call succeeded");
        } catch (staticErr) {
            console.error("❌ Static call failed with error:");
            console.error("   Message:", staticErr.message);
            if (staticErr.reason) console.error("   Reason:", staticErr.reason);
            if (staticErr.revert) console.error("   Revert:", JSON.stringify(staticErr.revert));
            throw staticErr;
        }

        // If static call succeeds, estimate gas and check balance
        console.log("\nEstimating gas and checking account balance...");
        
        const gasPrice = await hre.ethers.provider.getFeeData();
        console.log(`Gas price: ${hre.ethers.formatUnits(gasPrice.gasPrice, 'gwei')} gwei`);
        
        const balance = await deployer.provider.getBalance(deployer.address);
        console.log(`Account balance: ${hre.ethers.formatEther(balance)} BNB`);
        
        const estimatedGas = 3000000;
        const estimatedCost = BigInt(estimatedGas) * (gasPrice.gasPrice || 0n);
        console.log(`Estimated transaction cost: ${hre.ethers.formatEther(estimatedCost)} BNB`);
        
        if (balance < estimatedCost) {
            console.error(`\n❌ Insufficient funds!`);
            console.error(`   Need: ${hre.ethers.formatEther(estimatedCost)} BNB`);
            console.error(`   Have: ${hre.ethers.formatEther(balance)} BNB`);
            console.error(`   Shortfall: ${hre.ethers.formatEther(estimatedCost - balance)} BNB`);
            console.error(`\n   Get testnet BNB from: https://testnet.binance.org/faucet-smart`);
            throw new Error("Insufficient funds for deployment");
        }

        // If static call succeeds, send the actual transaction
        console.log("\nSending actual transaction...");
        const tx = await factory.createLaunch(launchParams, { gasLimit: 3000000 });
        console.log(`Transaction sent: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log("✓ Transaction successful!");

        // Find the LaunchCreated event
        const event = receipt.logs
            .map((log) => {
                try { return factory.interface.parseLog(log); } catch (e) { return null; }
            })
            .find((parsed) => parsed && parsed.name === "LaunchCreated");

        if (event) {
            const [token, vault, controller, governance, ammPair] = event.args;
            console.log("\n--- EvoLaunch Deployment Manifest ---");
            console.log(`LAUNCH_FACTORY_ADDRESS=${factoryAddress}`);
            console.log(`ADAPTIVE_TOKEN_ADDRESS=${token}`);
            console.log(`LIQUIDITY_VAULT_ADDRESS=${vault}`);
            console.log(`EVOLUTION_CONTROLLER_ADDRESS=${controller}`);
            console.log(`GOVERNANCE_MODULE_ADDRESS=${governance}`);
            console.log(`AMM_PAIR_ADDRESS=${ammPair}`);
            console.log("-------------------------------------\n");
        } else {
            console.log("Launch created successfully, but event not found in logs.");
        }
    } catch (err) {
        console.error("\n❌ Error creating launch:");
        console.error("Message:", err.message);
        if (err.data) console.error("Error data:", err.data);
        if (err.reason) console.error("Reason:", err.reason);
        console.error("\nFull error object:");
        console.error(err);
        throw err;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
