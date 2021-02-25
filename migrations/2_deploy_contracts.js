var SplitIt = artifacts.require("./SplitIt.sol");
var SS = artifacts.require("./SimpleStorage.sol");

module.exports = function (deployer) {
  deployer.deploy(SplitIt);
  deployer.deploy(SS);
};
