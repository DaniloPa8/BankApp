import React from "react";
import classes from "./../styles/Result.module.css";

const Result = (props) => {
  console.log(props.isStaker);
  if (props.isStaker) return <p>You are a staker.</p>;
  else return <p className={classes.text}>You are not a staker</p>;
};

export default Result;
