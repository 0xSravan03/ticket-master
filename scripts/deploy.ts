// Contract Address : 0x7bD058A0cBBeb65B43487A50cA9E2D09E4BE7b4D

import { ethers } from "hardhat";

async function main() {
  console.log("Deploying TokenMaster contract");
  const TokenMasterFactory = await ethers.getContractFactory("TokenMaster");
  const TokenMaster = await TokenMasterFactory.deploy("TokenMaster", "TM");
  await TokenMaster.deployed();
  console.log(`TokenMaster contract deployed at ${TokenMaster.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
