const { MongoClient } = require('mongodb');
const { ethers } = require('ethers');

async function main() {
    const routerAddress = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
    const factoryAddress = "0x6725F303b657a9451d8BA641348b6761A6CC7a17";

    const uri = "mongodb+srv://evolaunch:evolaunch@evolaunch.udigxwh.mongodb.net/?appName=evolaunch";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('test');
        const launches = db.collection('launches');
        const latestLaunch = await launches.findOne({}, { sort: { createdAt: -1 } });

        if (!latestLaunch) {
            console.log("No launch found in DB.");
            return;
        }

        const tokenAddress = latestLaunch.tokenAddress;
        console.log("Found latest token deployed:", tokenAddress);

        const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545");

        const factoryAbi = ["function getPair(address tokenA, address tokenB) external view returns (address pair)"];
        const pancakeFactory = new ethers.Contract(factoryAddress, factoryAbi, provider);

        const routerAbi = ["function WETH() external view returns (address)"];
        const router = new ethers.Contract(routerAddress, routerAbi, provider);
        const WETH = await router.WETH();

        console.log("Checking if LP Pair exists in PancakeSwap...");
        const pairAddress = await pancakeFactory.getPair(tokenAddress, WETH);
        console.log("AMM Pair Address:", pairAddress);

        if (pairAddress === "0x0000000000000000000000000000000000000000") {
            console.log("❌ Pair does not exist! Factory failed to add liquidity.");
            return;
        }

        const pairAbi = ["function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)", "function token0() external view returns (address)"];
        const pair = new ethers.Contract(pairAddress, pairAbi, provider);

        const token0 = await pair.token0();
        const reserves = await pair.getReserves();

        console.log("✅ Pool Reserves on PancakeSwap:");
        if (token0.toLowerCase() === WETH.toLowerCase()) {
            console.log(`WBNB Reserve: ${ethers.formatEther(reserves.reserve0)}`);
            console.log(`Token Reserve: ${ethers.formatUnits(reserves.reserve1, 18)}`);
        } else {
            console.log(`Token Reserve: ${ethers.formatUnits(reserves.reserve0, 18)}`);
            console.log(`WBNB Reserve: ${ethers.formatEther(reserves.reserve1)}`);
        }

        const tokenAbi = ["function balanceOf(address account) external view returns (uint256)"];
        const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
        const deployerBal = await tokenContract.balanceOf("0x739757665bb0E597B76c6992A742BF6e5f8e66df");
        console.log(`Deployer Token Balance: ${ethers.formatUnits(deployerBal, 18)}`);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
