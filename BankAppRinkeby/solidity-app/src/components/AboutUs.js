import React from "react";
import classes from "./../styles/Withdraw.module.css";
const AboutUs = () => {
  //Simple component returning JSX only

  return (
    <div className={classes.container}>
      <p className={classes.norm_text}>
        `Here at Token Bank we are all about staking. Rules are simple and as
        follows. Once the staking cycle starts, and it starts when the pledged
        reward gets deposited, users can stake their tokens and become stakers.
        Deposits are available for the first duration of the defined reward time
        "R". After that the lockdown period starts and lasts for another R,
        until 2R. After lockdown, withdrawals are enabled with following rules`
      </p>
      <p className={classes.norm_text}>
        First withdrawal from 2R to 3R: Reward is proportional to the total
        token stake and drawn from the pool R1
      </p>
      <p className={classes.norm_text}>
        Second withdrawal from 3R to 4R: Reward is proportional to the total
        token stake and drawn from the pool R1+R2
      </p>
      <p className={classes.norm_text}>
        Third withdrawal from 4R: Reward is proportional to the total token
        stake and drawn from the pool R1+R2+R3
      </p>
    </div>
  );
};

export default AboutUs;
