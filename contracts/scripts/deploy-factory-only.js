const hre = require("hardhat");

async function main() {
    console.log("Deploying LaunchFactory...");

    // PancakeSwap addresses for BSC Testnet
    const PANCAKE_ROUTER = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
    const PANCAKE_FACTORY = "0x6725F303b657a9451d8BA641348b6761A6CC7a17";

    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deploying with account: ${deployer.address}`);

    const balance = await deployer.provider.getBalance(deployer.address);
    console.log(`Account balance: ${hre.ethers.formatEther(balance)} BNB`);

    // Check if account has enough for deployment
    if (balance < hre.ethers.parseEther("0.05")) {
        console.error("\n❌ Insufficient funds!");
        console.error(`   Need: ~0.05 BNB for factory deployment`);
        console.error(`   Have: ${hre.ethers.formatEther(balance)} BNB`);
        console.error(`\n   Get testnet BNB from: https://testnet.binance.org/faucet-smart`);
        process.exit(1);
    }

    try {
        const LaunchFactory = await hre.ethers.getContractFactory("LaunchFactory", deployer);
        const factory = await LaunchFactory.deploy(PANCAKE_ROUTER, PANCAKE_FACTORY);

        await factory.waitForDeployment();
        const factoryAddress = await factory.getAddress();

        console.log(`\n✓ LaunchFactory deployed to: ${factoryAddress}`);
        console.log("\n--- Deployment Addresses ---");
        console.log(`LAUNCH_FACTORY_ADDRESS=${factoryAddress}`);
        console.log(`PANCAKE_ROUTER=${PANCAKE_ROUTER}`);
        console.log(`PANCAKE_FACTORY=${PANCAKE_FACTORY}`);
        console.log("----------------------------\n");

        // Save to file for later use
        const fs = require("fs");
        const addresses = {
            launchFactory: factoryAddress,
            pancakeRouter: PANCAKE_ROUTER,
            pancakeFactory: PANCAKE_FACTORY,
            deployedAt: new Date().toISOString(),
            deployer: deployer.address,
            network: "bscTestnet"
        };
        fs.writeFileSync("deployment-addresses.json", JSON.stringify(addresses, null, 2));
        console.log("✓ Addresses saved to deployment-addresses.json\n");

    } catch (err) {
        console.error("\n❌ Deployment failed:");
        console.error("Message:", err.message);
        throw err;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
