const { ethers } = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545");
    const tokenAddress = "0x8085b146fbf7179a6a5f8902386392eaf9886974";

    const tokenAbi = ["function totalSupply() external view returns (uint256)"];
    const token = new ethers.Contract(tokenAddress, tokenAbi, provider);

    const totalSupply = await token.totalSupply();
    console.log(`Total Supply: ${ethers.formatUnits(totalSupply, 18)}`);

    // To find the holder, let's look at the Transfer logs starting from block 92918000
    // To find the holder, let's look at the Transfer logs starting from block 92918000

    // We fetch logs manually because ethers filters can sometimes be weird
    const rawFilter = {
        address: tokenAddress,
        fromBlock: 92918000,
        toBlock: "latest",
        topics: [ethers.id("Transfer(address,address,uint256)")]
    };

    const logs = await provider.getLogs(rawFilter);
    console.log(`Found ${logs.length} transfers!`);

    for (let log of logs) {
        const from = ethers.hexlify(ethers.stripZerosLeft(log.topics[1]));
        const to = ethers.hexlify(ethers.stripZerosLeft(log.topics[2]));
        const amount = ethers.formatUnits(log.data, 18);
        console.log(`Transfer: ${from} -> ${to} : ${amount}`);
    }
}

main().catch(console.error);
