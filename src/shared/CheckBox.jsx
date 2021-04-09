/**
 * Custom Checkbox
 */
import React, { useState } from "react";
import "./CheckBox.css";

const CheckBox = ({ theme='var(--dark)', checked, text, init=false }) => {
  const [ state, setState ] = useState(init ? 'checked' : '');

  const handleCheck = event => {
    event.stopPropagation();
    if ( state === '' ) {
      setState('checked')
      checked(true);
    } else {
      setState('');
      checked(false);
    }
  }

  return (
    <span className={ `Check-Box ${ state }` } style={{ '--theme': theme }} onClick={ handleCheck }>
      <h4>{ text }</h4>
    </span>
  );
};

export default CheckBox;
