const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    const routerAddress = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
    const factoryAddress = "0x6725F303b657a9451d8BA641348b6761A6CC7a17";

    // Try to find the token address from the latest deployer. 
    // We don't have the token address, but we can check the deployer's tokens.
    // Actually, we can get the token address from the backend db or from hardhat.
    // Let's just do a simple factory getPair.
    // I will check the most recent tokens in the backend db.
    const { MongoClient } = require('mongodb');
    const uri = "mongodb+srv://evolaunch:evolaunch@evolaunch.udigxwh.mongodb.net/?appName=evolaunch";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('test'); // default mongoose db
        const launches = db.collection('launches');
        const latestLaunch = await launches.findOne({}, { sort: { createdAt: -1 } });

        if (!latestLaunch) {
            console.log("No launch found in DB.");
            return;
        }

        const tokenAddress = latestLaunch.tokenAddress;
        console.log("Found latest token:", tokenAddress);

        const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545");

        const factoryAbi = ["function getPair(address tokenA, address tokenB) external view returns (address pair)"];
        const pancakeFactory = new ethers.Contract(factoryAddress, factoryAbi, provider);

        const routerAbi = ["function WETH() external view returns (address)"];
        const router = new ethers.Contract(routerAddress, routerAbi, provider);
        const WETH = await router.WETH();

        const pairAddress = await pancakeFactory.getPair(tokenAddress, WETH);
        console.log("AMM Pair Address from Factory:", pairAddress);

        if (pairAddress === "0x0000000000000000000000000000000000000000") {
            console.log("Pair does not exist!");
            return;
        }

        const pairAbi = ["function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)", "function token0() external view returns (address)"];
        const pair = new ethers.Contract(pairAddress, pairAbi, provider);

        const token0 = await pair.token0();
        const reserves = await pair.getReserves();

        console.log("Pool Reserves:");
        if (token0.toLowerCase() === WETH.toLowerCase()) {
            console.log(`WBNB Reserve: ${ethers.formatEther(reserves.reserve0)}`);
            console.log(`Token Reserve: ${ethers.formatUnits(reserves.reserve1, 18)}`);
        } else {
            console.log(`Token Reserve: ${ethers.formatUnits(reserves.reserve0, 18)}`);
            console.log(`WBNB Reserve: ${ethers.formatEther(reserves.reserve1)}`);
        }

    } finally {
        await client.close();
    }
}

main().catch(console.error);
