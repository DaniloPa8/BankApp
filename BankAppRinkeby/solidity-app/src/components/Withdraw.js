import React, { useContext, useEffect, useState } from "react";
import classes from "./../styles/Withdraw.module.css";
import ConnContext from "./conn-Context";
import signTransaction from "./signTransaction";

const Withdraw = () => {
  // consuming the global ConnContext containg account and contract details
  const { account, contract } = useContext(ConnContext);
  // setting up state
  const [currPeriod, setCurrPeriod] = useState();

  // useEffect for calculating the current reward period
  useEffect(() => {
    const getTime = async () => {
      let currTime = Date.now();

      let startTime = await contract.methods.savingsStartTime().call();
      startTime = startTime * 1000;
      let rewardTime = await contract.methods.rewardTime().call();
      rewardTime = rewardTime * 1000;
      if (
        currTime > startTime + 2 * rewardTime &&
        currTime < startTime + 3 * rewardTime
      ) {
        setCurrPeriod(1);
      }
      if (
        currTime > startTime + 3 * rewardTime &&
        currTime < startTime + 4 * rewardTime
      ) {
        setCurrPeriod(2);
      }

      if (currTime > startTime + 4 * rewardTime) {
        setCurrPeriod(3);
      }
    };

    getTime();
  }, [currPeriod, setCurrPeriod]);

  // function calling the Bank contract backend
  // and withdrawing the users deposits along with
  // reward added to their original staked amount
  // Also used by the owner of the BANK contract
  //to withdraw the remaining tokens after 4*T has passed

  const withdrawTokens = async () => {
    let action = contract.methods.withdrawTokens();
    signTransaction(action, "bank", account);
  };

  return (
    <div className={classes.container}>
      <p className={classes.norm_text}>
        {currPeriod
          ? `The current reward period is ${currPeriod}`
          : `You can not withdraw currently.`}
      </p>

      <button className={classes.button} onClick={withdrawTokens}>
        WITHDRAW
      </button>
    </div>
  );
};

export default Withdraw;
