const { ethers } = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545");
    const factoryAddress = "0x37d28D8E694FdDc282Df52C297BfCC492Ca1940c"; // latest

    // Get all LaunchCreated logs from this factory
    const filter = {
        address: factoryAddress,
        fromBlock: 92918000,
        toBlock: "latest",
        topics: [
            ethers.id("LaunchCreated(address,address,address,address,address)")
        ]
    };

    const logs = await provider.getLogs(filter);
    console.log(`Found ${logs.length} launches on the new factory`);

    if (logs.length > 0) {
        const lastLog = logs[logs.length - 1];
        // The token is the first indexed parameter (topic[1])
        const tokenAddress = ethers.hexlify(ethers.stripZerosLeft(lastLog.topics[1]));
        console.log("Real Token Address:", tokenAddress);

        // Let's check the balance of this real token
        const tokenAbi = ["function balanceOf(address) external view returns (uint256)", "function totalSupply() external view returns (uint256)"];
        const token = new ethers.Contract(tokenAddress, tokenAbi, provider);

        const totalSupply = await token.totalSupply();
        const deployerBal = await token.balanceOf("0x739757665bb0E597B76c6992A742BF6e5f8e66df");
        const factoryBal = await token.balanceOf(factoryAddress);
        const routerBal = await token.balanceOf("0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3");

        console.log(`Total Supply: ${ethers.formatUnits(totalSupply, 18)}`);
        console.log(`Deployer Bal: ${ethers.formatUnits(deployerBal, 18)}`);
        console.log(`Factory Bal : ${ethers.formatUnits(factoryBal, 18)}`);
        console.log(`Router Bal  : ${ethers.formatUnits(routerBal, 18)}`);

        // Also check pool reserves
        const factoryAbi = ["function getPair(address,address) external view returns (address)"];
        const pancakeFactory = new ethers.Contract("0x6725F303b657a9451d8BA641348b6761A6CC7a17", factoryAbi, provider);
        const WETH = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"; // BSC Testnet WBNB
        const pairAddress = await pancakeFactory.getPair(tokenAddress, WETH);

        console.log(`Pair Address: ${pairAddress}`);
        if (pairAddress && pairAddress !== ethers.ZeroAddress) {
            const pairBal = await token.balanceOf(pairAddress);
            console.log(`Pair Bal    : ${ethers.formatUnits(pairBal, 18)}`);

            const pairAbi = ["function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)", "function token0() external view returns (address)"];
            const pair = new ethers.Contract(pairAddress, pairAbi, provider);
            try {
                const reserves = await pair.getReserves();
                console.log(`Reserves 0: ${reserves.reserve0.toString()}`);
                console.log(`Reserves 1: ${reserves.reserve1.toString()}`);
            } catch (e) { console.log('Could not get reserves (maybe empty)'); }
        }
    }
}

main().catch(console.error);
