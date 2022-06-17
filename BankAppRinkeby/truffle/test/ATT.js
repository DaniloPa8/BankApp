const ATT = artifacts.require("ATT");
const Bank = artifacts.require("Bank");
let bank = null;
contract("Bank", () => {
  before(async () => {
    bank = await Bank.deployed();
  });
  it("Should return the pledge amount", async () => {
    let pledgeAmount = await bank.pledgeAmount();
    assert(pledgeAmount.toString() === "1000000000000000000000");
  });
});

contract("ATT", (accounts) => {
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let att = null;

  before(async () => {
    att = await ATT.deployed();
  });

  it("Should transfer tokens to ddress's of the 2 stakers from owner", async () => {
    await att.transfer(accounts[1], web3.utils.toBN("1000000000000000000000"));
    await att.transfer(accounts[2], web3.utils.toBN("4000000000000000000000"));
    let acc1 = await att.balanceOf(accounts[1]);
    let acc2 = await att.balanceOf(accounts[2]);

    acc1 = acc1.toString();
    acc2 = acc2.toString();

    assert(acc1 === "1000000000000000000000");
    assert(acc2 === "4000000000000000000000");
  });

  it("Should approve a desired value to be spent on the bank contract address by 2 accounts ", async () => {
    await att.approve(bank.address, web3.utils.toBN("1000000000000000000000"), {
      from: accounts[1],
    });
    await att.approve(bank.address, web3.utils.toBN("4000000000000000000000"), {
      from: accounts[2],
    });

    let allowance1 = await att.allowance(accounts[1], bank.address, {
      from: accounts[1],
    });
    let allowance2 = await att.allowance(accounts[2], bank.address, {
      from: accounts[2],
    });

    allowance1 = allowance1.toString();
    allowance2 = allowance2.toString();

    assert(allowance1 === "1000000000000000000000");
    assert(allowance2 === "4000000000000000000000");
  });
  it("Owner of the Bank should deposit the pledge amount to start a staking cycle", async () => {
    let deposit = await bank.pledgeAmount();

    await att.approve(bank.address, deposit, {
      from: accounts[0],
    });

    await bank.savingsStart(deposit, {
      from: accounts[0],
    });
    const res = await bank.rewardDeposited();

    assert(res === true);
  });
  it("Stakers should deposit the desired amounts into the Bank contract", async () => {
    await bank.depositTokens(1000, { from: accounts[1] });

    await bank.depositTokens(4000, { from: accounts[2] });

    const totalStake = await bank.getTotalStake();

    assert(totalStake.toString() === "5000");
  });
  it("Staker 1 should withdraw after T0 + 2*T has passed", async () => {
    await timeout(62000);
    await bank.withdrawTokens({ from: accounts[1] });
    let balance = await att.balanceOf(accounts[1], { from: accounts[1] });
    assert(balance.toString() === "1040000000000000000000");
  });
  it("Staker 2 should withdraw after T0 + 3*T has passed and before 4*T has passed", async () => {
    await timeout(30000);
    await bank.withdrawTokens({ from: accounts[2] });

    let balance = await att.balanceOf(accounts[2], { from: accounts[2] });

    assert(balance.toString() === "4460000000000000000000");
  });
  it("The owner of the Bank contract should wihdraw all remaining funds after 4*T has passed", async () => {
    await timeout(30000);
    await bank.withdrawTokens({ from: accounts[0] });

    let balance = await att.balanceOf(bank.address, { from: accounts[0] });

    assert(balance.toString() === "0");
  });
});
