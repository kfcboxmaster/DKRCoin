require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const dotenv = require("dotenv");
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: 'https://sepolia.infura.io/v3/47bd0a928dc14158898d88ad52dc8937',
      accounts: [process.env.METAMASK],
    },
  },  
 etherscan: {
  apiKey: process.env.ETHERSCAN,
 },
};