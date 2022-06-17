import React, { useState } from "react";
import classes from "./../styles/Navbar.module.css";
import Modal from "./Modal";
import ListItem from "./ListItem";

const Navbar = () => {
  // setting up states

  const [isOpen, setIsOpen] = useState(false);
  const [caller, setCaller] = useState();

  // modal handler functions

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    // calling a Modal component with coresponding props
    // depending on the option selected
    <>
      <Modal
        openModal={openModal}
        closeModal={closeModal}
        isOpen={isOpen}
        title={caller}
      ></Modal>

      {/* Navbar layout with ListItem components for simplicity */}

      <nav className={classes.navbar}>
        <span className={classes.toggleNav} id="toggle-nav">
          <i className={classes.materialIcons}>menu</i>
        </span>
        <div className="">
          <a href="#" className={classes.logo}>
            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="" />
            <p className={classes.compName}>Token Staking</p>
          </a>
        </div>
        <ul className={classes.mainNav} id="main-nav">
          <ListItem
            text="stake"
            action={() => {
              setCaller("stake");
              openModal();
            }}
          ></ListItem>
          <ListItem
            text="withdraw"
            action={() => {
              setCaller("withdraw");
              openModal();
            }}
          ></ListItem>
          <ListItem
            text="interface"
            action={() => {
              setCaller("interface");
              openModal();
            }}
          ></ListItem>
          <ListItem text="documentation"></ListItem>
          <ListItem
            text="about us"
            action={() => {
              setCaller("about us");
              openModal();
            }}
          ></ListItem>
        </ul>
      </nav>
    </>
  );
};
export default Navbar;
