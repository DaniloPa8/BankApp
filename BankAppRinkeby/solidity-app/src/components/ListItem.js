import classes from "./../styles/Navbar.module.css";
const ListItem = (props) => {
  return (
    <li>
      <button
        className={classes.buttonLink}
        onClick={props.action}
      >{`${props.text.toUpperCase()}`}</button>
    </li>
  );
};

export default ListItem;
