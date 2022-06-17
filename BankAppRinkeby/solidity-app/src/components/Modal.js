import React, { useState, useEffect } from "react";
import classes from "./../styles/Modal.module.css";
import Stake from "./Stake";
import Withdraw from "./Withdraw";
import Interface from "./Interface";
import AboutUs from "./AboutUs";

const Modal = (props) => {
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
              {/* populating the modal depending on the passed prop */}

              {props.title === "stake" && <Stake title="stake"></Stake>}

              {props.title === "withdraw" && (
                <Withdraw title="withdraw"></Withdraw>
              )}

              {props.title === "interface" && <Interface></Interface>}

              {props.title === "about us" && <AboutUs></AboutUs>}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default Modal;
