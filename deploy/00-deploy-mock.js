const { developmentChains } = require("../helper-hardhat-config.js");
const { network, ethers } = require("hardhat");

const BASE_FEE = "250000000000000000";
const GAS_PRICE_LINK = 1e9;

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  // const args = { BASE_FEE, GAS_PRICE_LINK };

  // if (developmentChains.includes(network.name)) {
  if (chainId == 31337) {
    log("Local network detected! Deploying mocks...");

    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: [BASE_FEE, GAS_PRICE_LINK],
    });

    log("Mock DEPLOYED!");
    log("----------------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
