require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");

const ALCHEMY_API_KEY = "7suGv0do7mFFx0gG-hPPk4d8A8CQnWhH";

const GOERLI_PRIVATE_KEY = "9fa94ad52bcb32ba80525bd24cb499b998d9f76b55281001a662a2dc56aa4b2e";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/7suGv0do7mFFx0gG-hPPk4d8A8CQnWhH`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  }
};

// https://eth-goerli.g.alchemy.com/v2/7suGv0do7mFFx0gG-hPPk4d8A8CQnWhH