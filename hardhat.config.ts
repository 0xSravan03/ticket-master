import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    localhost: {
      url: "",
    },
    sepolia: {
      url: "",
      accounts: []
    }
  },
  solidity: "0.8.18",
};

export default config;
