import React, { useState, useEffect, useContext } from "react";
import classes from "./../styles/Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faGithub,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import Admin from "./Admin";
import Token from "./Token";
import ConnContext from "./conn-Context";

const Footer = () => {
  // consuming the global ConnContext containg account and contract details
  const { account, contract } = useContext(ConnContext);

  // setting up states for handling modals

  const [admin, openAdmin] = useState();
  const [token, openToken] = useState();
  const [isAdmin, setIsAdmin] = useState(false);

  // modal handler functions

  const closeAdminHandle = () => {
    openAdmin(false);
  };

  const openAdminHandle = () => {
    checkAdmin();
    if (isAdmin) openAdmin(true);
  };

  const closeTokenHandle = () => {
    openToken(false);
  };

  const openTokenHandle = () => {
    openToken(true);
  };

  // check if current user is admin, giving acces to Admin modal if 'true'

  const checkAdmin = async () => {
    const res = await contract.methods.owner().call();
    if (res.toLowerCase() === account.toLowerCase()) openAdmin(true);
  };

  return (
    <div>
      {/* rendering the admin modal */}

      {admin && <Admin title="admin" closeModal={closeAdminHandle}></Admin>}

      {/* rendering the token modal */}

      <Token
        isOpen={token}
        title="token interface"
        closeModal={closeTokenHandle}
      ></Token>

      <footer className={classes.footer}>
        <div className={classes.footerContainer}>
          <div className={classes.item1}>
            <button className={classes.button} onClick={openAdminHandle}>
              ADMIN
            </button>
            <button className={classes.button} onClick={openTokenHandle}>
              TOKEN
            </button>
          </div>

          <div className={classes.item2}>
            <span style={{ paddingRight: 5 }}> </span>
            <FontAwesomeIcon icon={faCopyright} />{" "}
            <span style={{ paddingLeft: 5 }}>
              {new Date().getFullYear()} Simple. Safe. Trusted.
            </span>
          </div>
          <a
            href="https://github.com/DaniloPa8"
            target="_blank"
            className={classes.item3}
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="http://fb.com/" target="_blank" className={classes.item4}>
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            className={classes.item5}
          >
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
