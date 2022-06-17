import React, { useContext, useState, useEffect } from "react";
import classes from "./../styles/Interface.module.css";
import ConnContext from "./conn-Context";

const Interface = () => {
  // consuming the global ConnContext containg account and contract details
  const { account, contract } = useContext(ConnContext);

  // setting up states
  const [staker, setStaker] = useState();
  const [reward, setReward] = useState([]);
  const [dispReward, setDispReward] = useState(false);
  const [dispStaker, setDispStaker] = useState(false);
  const [period, setPeriod] = useState();
  const [startTime, setStartTime] = useState();

  // calls the backend contract and checks if current user is the staker
  const checkStaker = async () => {
    const res = await contract.methods
      .checkIfStaker(account)
      .call({ from: account });
    setStaker(res);
    console.log(res);
    setDispStaker(true);
  };

  // calls the backend contract and retrives reward pools
  const getRewards = async () => {
    const res = await contract.methods.getRewards().call();
    let rew = Object.entries(res).slice(3);
    let result = [...rew];
    let rewards = result.map((el, i) => el[1]);
    setReward(rewards);

    setDispReward(true);
  };

  // calls the backend and retrives how long does one reward period last
  const getRewardPeriod = async () => {
    let res = await contract.methods.rewardTime().call();
    setPeriod(res);
  };

  // calls the backend and gets the last start time of a staking cycle
  const getStartTime = async () => {
    let res = await contract.methods.savingsStartTime().call();
    setTimeout(1000);

    if (res) {
      setStartTime(res);
    } else if (!res) {
      setStartTime(0);
    }
  };

  return (
    <div className={classes.container}>
      <h3>Choose interaction:</h3>
      <button className={classes.button} onClick={checkStaker}>
        Check if staker!
      </button>

      {dispStaker && (
        <p className={classes.text}>
          {staker ? "You are a staker!" : "You are not a staker"}{" "}
        </p>
      )}

      <button className={classes.button} onClick={getRewards}>
        Get rewards
      </button>

      {dispReward && (
        <p className={classes.text}>
          {reward[2] !== "0"
            ? `Reward pool 1 is: ${reward[0]}, reward pool 2 is: ${reward[1]},
          reward pool 3 is ${reward[2]}`
            : "No rewards have been set up yet."}
        </p>
      )}

      <button className={classes.button} onClick={getRewardPeriod}>
        Get reward period
      </button>

      {period && (
        <p className={classes.text}>
          One reward period lasts: {period}s, or{" "}
          {(period / 60 / 60).toPrecision(2)}h
        </p>
      )}

      <button className={classes.button} onClick={getStartTime}>
        Get start time
      </button>
      {startTime && (
        <p className={classes.text}>
          {startTime == 0
            ? `Staking is not active yet.`
            : `The start time of staking was: ${new Date(
                startTime * 1000
              ).toLocaleString("en-us")}`}
        </p>
      )}
    </div>
  );
};

export default Interface;
