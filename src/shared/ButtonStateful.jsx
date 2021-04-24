/**
 * Stateful button
 */
import React, { useState, useEffect } from "react";
import "./Button.css";

let stateText;
const ButtonStateful = ({ text='', clicked, action, altClass, init=false, altState, rs=false }) => {
  const [ state, setState ] = useState(init);

  const renderComponent = (s=Date.now()) => {
    setState(s);
  }

  useEffect(()=>{
    stateText = text;
  }, []);

  const handleClick = ev => {
    stateText = 'close';
    clicked(ev, action);
    rs && renderComponent(!state);clicked(ev, action)
  }

  return (
    <button className={ altClass } onClick={ handleClick }

      >
      <h1 className="Text-Button">{stateText}</h1>
    </button>
  );
};

export default ButtonStateful;
