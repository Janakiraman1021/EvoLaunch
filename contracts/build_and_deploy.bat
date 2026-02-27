@echo off
echo.
echo [1/2] Compiling Smart Contracts...
call npx hardhat compile

echo.
echo [2/2] Deploying to BNB Testnet...
call npx hardhat run scripts/deploy.js --network bscTestnet

echo.
echo Deployment complete. Please copy the addresses above into your backend/.env file.
pause

