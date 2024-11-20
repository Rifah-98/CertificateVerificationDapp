/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.27",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Ganache local blockchain URL
      accounts: [
        "0x2a2e03ddbc7c9c1e31bfb66bbef8fb53b58e748f028fead69785369266e3001e", // Private key for deployer 1
        "0xeb94187f4a58b7bf8c03f78fca2a0731c9a5eacfa0de60b83876350e7f78f264"  // Private key for deployer 2
      ],
    },
  },
};
