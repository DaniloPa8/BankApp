import web3 from "web3";
import React, { useState, useContext } from "react";
import classes from "./../styles/Stake.module.css";
import ConnContext from "./conn-Context";
import signTransaction from "./signTransaction";

const Stake = (props) => {
  //setting up BigNumber for later use
  const BN = web3.utils.BN;

  // consuming the global ConnContext containg account and contract details
  const { account, contract } = useContext(ConnContext);

  const [stakedValue, setStakedValue] = useState("");

  // function that calls the backend and deposits tokens for the user
  // with this user becomes a staker
  const stake = async (e) => {
    e.preventDefault();
    let deposit = new BN(stakedValue);
    let action = contract.methods.depositTokens(deposit);

    signTransaction(action, "bank", account);
  };

  if (props.title === "stake") {
    return (
      <form className={classes.form}>
        <label className={classes.label}>
          Input the amount of tokens you want to stake:
        </label>
        <input
          value={stakedValue}
          onInput={(e) => setStakedValue(e.target.value)}
          id="stakeAmount"
          name="stakeAmount"
          type="number"
          min="1"
          className={classes.input}
          placeholder="INPUT DESIRED AMOUNT OF TOKENS"
        ></input>

        <button type="submit" className={classes.button} onClick={stake}>
          STAKE
        </button>
      </form>
    );
  }
};

export default Stake;
