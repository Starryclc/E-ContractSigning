var EContract = artifacts.require("./EContract.sol");

module.exports = function(deployer) {
  deployer.deploy(EContract);
};
