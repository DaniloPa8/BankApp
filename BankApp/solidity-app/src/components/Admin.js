import React, { useContext } from "react";
import ConnContext from "./conn-Context";
import classes from "./../styles/Admin.module.css";
import web3 from "web3";

const Admin = (props) => {
  // consuming the global ConnContext with account and contract
  const { account, contract } = useContext(ConnContext);

  // setting up BigNumbers for later usage
  const BN = web3.utils.BN;

  // function that calls the backend solidity contract
  // starting the staking cycle
  //only accesible to the owner as it is in the admin modal

  const startStakingHandle = async () => {
    let pledge = new BN();
    pledge = await contract.methods.pledgeAmount().call();
    await contract.methods
      .savingsStart(pledge)
      .send({ from: account, gas: 3000000 });
    const check = contract.methods.rewardDeposited.call();
  };

  const withdrawHandler = async () => {
    await contract.methods
      .withdrawTokens()
      .send({ from: account, gas: 3000000 });
  };

  return (
    <div>
      <>
        <div className={classes.overlay} onClick={props.closeModal}></div>
        <div className={classes.modal}>
          <header className={classes.modal__header}>
            <h2>{props.title.toUpperCase()}</h2>
            <button onClick={props.closeModal} className={classes.closeButton}>
              &times;
            </button>
          </header>
          <main className={classes.modal__main}>
            <div>
              <button className={classes.button} onClick={startStakingHandle}>
                START STAKING
              </button>
            </div>
            <div>
              <button className={classes.button} onClick={withdrawHandler}>
                WITHDRAW REAMINING TOKENS
              </button>
            </div>
          </main>
        </div>
      </>
    </div>
  );
};

export default Admin;
