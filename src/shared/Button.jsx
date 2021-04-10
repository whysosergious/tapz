/**
 * Simple button component
 */
import React from "react";
import "./Button.css";

const Button = ({ text='', action, clicked, altClass, id, storeId, column, slot, hero, root=false }) => {
  return (
    <button className={ altClass } onClick={ (ev)=>clicked(ev, action) }
      data-id={id}
      data-storeid={ storeId }
      data-column={column}
      data-slot={slot}
      data-hero={hero}
      data-root={ root }
      >
      <h4>{text}</h4>
    </button>
  );
};

export default Button;
