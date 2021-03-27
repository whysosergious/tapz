/**
 * Simple button component
 */
import React from "react";
import "./Button.css";

const Button = ({ text, action, clicked }) => {
  return (
    <button onClick={(ev) => clicked(ev, action)}>
      <h3>{text}</h3>
    </button>
  );
};

export default Button;
