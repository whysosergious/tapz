/**
 * Simple button component
 */
import React from "react";
import "./Button.css";

const Button = ({ text='', action, clicked, altClass }) => {
  return (
    <button className={ altClass } onClick={(ev) => clicked(ev, action)}>
      <h4>{text}</h4>
    </button>
  );
};

export default Button;
