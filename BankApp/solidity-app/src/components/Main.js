import React from "react";
import classes from "./../styles/Main.module.css";

const Main = () => {
  // simple component returning JSX only

  return (
    <div className={classes.main}>
      <div className={classes.title}>
        <h1>STAKE WITH US!</h1>
      </div>
      <div className={classes.text}>
        <h2>
          Want to make passive income just by staking your coins with us?{" "}
        </h2>
        <h3>
          You can start staking by clicking the STAKE button on the top of the
          page!
        </h3>
        <h3>
          Before depositing tokens with us, you need to give us allowance in the
          TOKEN interface!
        </h3>
        <h3>
          If you are already a STAKER, you can withdraw you tokens if the time
          is right by clicking the WIHDRAW button on the top of the page!
        </h3>
        <h4>For all other interactions you can click the INTERFACE option!</h4>
      </div>
    </div>
  );
};

export default Main;
