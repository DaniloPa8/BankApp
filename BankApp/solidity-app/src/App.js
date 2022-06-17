import React, { useEffect, useState } from "react";
import "../src/styles/App.module.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Contract from "web3-eth-contract";
import abiInterface from "./contracts/Bank.json";
import ConnContext from "./components/conn-Context";

function App() {
  // setting states
  const [account, setAccount] = useState();
  const [contract, setContract] = useState();

  // detecting metamask account changes and refresing

  window.ethereum.on("accountsChanged", () => {
    window.location.reload(false);
  });

  //loading up metamask extension and retriving accounts

  useEffect(
    () => async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(accounts[0]);
        } catch (error) {
          if (error.code === 4001) {
            console.error(error);
          }

          console.error(error);
        }
      }
    },
    []
  );

  // loading the BANK contract

  useEffect(() => {
    const cont = new Contract(
      abiInterface.abi,
      process.env.REACT_APP_BANK_ADDR
    );

    cont.setProvider(`ws://localhost:${process.env.REACT_APP_PORT_NUMBER}`);
    setContract(cont);
  }, []);

  return (
    // setting up a context for the whole app to have access to contract and current account

    <ConnContext.Provider value={{ account, contract }}>
      <div className="App">
        <Navbar></Navbar>
        <Main></Main>
        <Footer> </Footer>
      </div>
    </ConnContext.Provider>
  );
}

export default App;
