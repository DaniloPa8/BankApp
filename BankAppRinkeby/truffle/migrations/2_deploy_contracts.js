let Att = artifacts.require("ATT");
let Bank = artifacts.require("Bank");

module.exports = async function (deployer) {
  deployer.deploy(Att).then(function () {
    return deployer.deploy(Bank, Att.address, 1000, 432000);
  });
};
