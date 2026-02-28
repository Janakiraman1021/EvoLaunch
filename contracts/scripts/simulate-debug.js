const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    const [deployer] = await ethers.getSigners();
    // Using the new factory deployed with console bounds!
    const factoryAddress = "0x37d28D8E694FdDc282Df52C297BfCC492Ca1940c";

    const LaunchFactory = await ethers.getContractFactory("LaunchFactory");
    const factory = LaunchFactory.attach(factoryAddress);

    const params = [
        "Token BNB-BLR",
        "BLRbnb",
        ethers.parseUnits("500000", 18),
        ethers.parseUnits("4998", 18),
        500, // 5%
        200, // 2%
        ethers.parseUnits("100", 18),
        ethers.parseUnits("1014", 18),
        0,
        2500, // 25%
        ethers.parseUnits("100", 18),
        ethers.parseUnits("1014", 18),
        deployer.address,
        [deployer.address]
    ];

    const bnbValue = ethers.parseEther("0.01");

    console.log("Simulating createLaunch on bscTestnet...");

    try {
        console.log("Estimating gas...");
        const gas = await factory.createLaunch.estimateGas(params, { value: bnbValue });
        console.log("Gas estimate:", gas.toString());

        console.log("Calling static method to get return value/trace...");
        const result = await factory.createLaunch.staticCall(params, { value: bnbValue, gasLimit: 8000000 });
        console.log("Static call succeeded! Returned:", result);
    } catch (err) {
        console.error("Simulation failed!");
        if (err.data) {
            console.error("Error data:", err.data);
        }
        console.error(err.message);
    }
}

main().catch(console.error);
