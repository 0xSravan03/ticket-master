import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY as string;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL as string;
const ETHERSCAN_API = process.env.ETHERSCAN_API as string;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    localhost: {
      url: "",
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API,
  },
  solidity: "0.8.18",
};

export default config;
