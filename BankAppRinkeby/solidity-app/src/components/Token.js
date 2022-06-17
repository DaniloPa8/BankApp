import React, { useContext, useState, useEffect } from "react";
import ConnContext from "./conn-Context";
import classes from "./../styles/Token.module.css";
import Contract from "web3-eth-contract";
import abiInterface from "./../contracts/ATT.json";
import web3 from "web3";
import signTransaction from "./signTransaction";

const Admin = (props) => {
  // setting up BigNumber for later usage
  const BN = web3.utils.BN;

  // consuming the global ConnContext containg account and contract details
  const { account, contract } = useContext(ConnContext);

  // setting up states
  const [token, setToken] = useState();
  const [balance, setBalance] = useState();
  const [allowance, setAllowance] = useState();
  const [reciver1, setReciver1] = useState();
  const [transfer, setTransfer] = useState();
  const [reciver2, setReciver2] = useState();
  web3 = new web3(
    new web3.providers.HttpProvider(
      "https://rinkeby.infura.io/v3/55011acadefd45d99111ce39df02d95e"
    )
  );
  // useEffect for loading the Token contract details
  // this info is only used inside this modal

  useEffect(() => {
    const cont = new Contract(
      abiInterface.abi,
      process.env.REACT_APP_TOKEN_ADDR
    );
    cont.setProvider(
      `https://rinkeby.infura.io/v3/55011acadefd45d99111ce39df02d95e`
    );
    setToken(cont);
  }, []);

  // function that calls the Token backend and sets up allowance
  // a necessary step implemented as a ERC-20 safety feature

  const allowanceHandle = async () => {
    let amount = allowance + "000000000000000000";
    let amt = new BN(amount);
    let action = token.methods.approve(reciver1, amt);
    signTransaction(action, "token", account);
  };

  // function that calls the Token backend and handles
  // the transfer of tokens to the desired address
  // which has suficient allowance

  const transferHandle = async () => {
    let amount = transfer + "000000000000000000";
    let amt = new BN(amount);
    let action = token.methods.transfer(reciver2, amt);
    signTransaction(action, "token", account);
  };

  // function that calls the Token backend and
  // retrives the current user's balance

  const balanceHandler = async () => {
    let res = await token.methods.balanceOf(account).call({ from: account });
    res = res.toString().slice(0, -18);
    setBalance(res);
  };

  return (
    <div>
      {props.isOpen && (
        <>
          <div className={classes.overlay} onClick={props.closeModal}></div>
          <div className={classes.modal}>
            <header className={classes.modal__header}>
              <h2>{props.title.toUpperCase()}</h2>
              <button
                onClick={props.closeModal}
                className={classes.closeButton}
              >
                &times;
              </button>
            </header>
            <main className={classes.modal__main}>
              <div className={classes.textCont}>
                <p
                  className={classes.text}
                >{`The address of this staking contract is ${process.env.REACT_APP_BANK_ADDR}`}</p>
              </div>
              <div>
                <input
                  className={classes.input}
                  placeholder="INPUT ALLOWNACE"
                  value={allowance}
                  onInput={(e) => setAllowance(e.target.value)}
                  type="number"
                  min="1"
                  step="1"
                ></input>

                <input
                  className={classes.input}
                  placeholder="INPUT ADDRESS"
                  value={reciver1}
                  onInput={(e) => setReciver1(e.target.value)}
                ></input>

                <button className={classes.button} onClick={allowanceHandle}>
                  {" "}
                  GIVE ALLOWANCE
                </button>
              </div>
              <div>
                <input
                  className={classes.input}
                  placeholder="INPUT AMOUNT TO TRANSFER"
                  value={transfer}
                  onInput={(e) => setTransfer(e.target.value)}
                  type="number"
                  min="1"
                  step="1"
                ></input>
                <input
                  className={classes.input}
                  placeholder="INPUT ADDRESS"
                  value={reciver2}
                  onInput={(e) => setReciver2(e.target.value)}
                ></input>
                <button className={classes.button} onClick={transferHandle}>
                  {" "}
                  TRANSFER TOKENS
                </button>
              </div>
              <button onClick={balanceHandler} className={classes.button}>
                {balance
                  ? `Your balance is ${balance}`
                  : `Check your token balance`}
              </button>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
