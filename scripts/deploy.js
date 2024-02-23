const hre = require("hardhat");

async function main() {

  const DKRCoin = await hre.ethers.getContractFactory("DKRCoin");
  const gasPrice = await DKRCoin.signer.getGasPrice();
  console.log(`Current gas price: ${gasPrice}`);

  const estimatedGas = await DKRCoin.signer.estimateGas(
    DKRCoin.getDeployTransaction(),
  );
  console.log(`Estimated gas: ${estimatedGas}`);

  const deploymentPrice = gasPrice.mul(estimatedGas);
  const deployerBalance = await DKRCoin.signer.getBalance();
  console.log(`Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`);
  console.log(`Deployment price:  ${ethers.utils.formatEther(deploymentPrice)}`);
  if (deployerBalance.lt(deploymentPrice)) {
    throw new Error(
      `Insufficient funds. Top up your account balance by ${ethers.utils.formatEther(
        deploymentPrice.sub(deployerBalance),
      )}`,
    );
  }
  const dkrcoin = await DKRCoin.deploy();

  await dkrcoin.deployed();

  console.log("DKRCoin deployed to:", dkrcoin.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});