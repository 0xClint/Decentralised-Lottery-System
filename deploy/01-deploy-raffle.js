const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("2");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let vrfCoordinatorV2Address, subcriptionId, vrfCoordinatorV2Mock;
  if (chainId == 31337) {
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;

    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait(1);
    subcriptionId = transactionReceipt.events[0].args.subId;
    log("IF statement");

    await vrfCoordinatorV2Mock.fundSubscription(
      subcriptionId,
      VRF_SUB_FUND_AMOUNT
    );
  } else {
    log("ELSE statement");
    vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
    subcriptionId = networkConfig[chainId]["subscriptionId"];
  }

  const entranceFee = networkConfig[chainId]["entranceFee"];
  const gasLane = networkConfig[chainId]["gasLane"];
  const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];
  const interval = networkConfig[chainId]["interval"];

  const args = [
    vrfCoordinatorV2Address,
    entranceFee,
    gasLane,
    subcriptionId,
    callbackGasLimit,
    interval,
  ];

  const Raffle = await deploy("Raffle", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 2,
  });

  // if (chainId == 31337 && process.env.ETHERSCAN_API_KEY) {
  //   log("verifying...");
  //   await verify(Raffle.address, args);
  // }
  log("CONTRACT DEPLOYED!");
};

module.exports.tags = ["all", "raffle"];
