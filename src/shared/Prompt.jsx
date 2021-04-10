/**
 * Dynamic propmt
 */
import React from "react";
import "./Prompt.css";

// components
import Button from 'shared/Button';

const Prompt = ({ text='', altClass, accept, decline, pocket }) => {

  const handleClose = () => {

  }
  return (
    <div className={`Card-Form-Container`}>
      <div className="Overlay" onClick={ handleClose }>
        <div className={ `Prompt` }>
          { pocket }
          <div className="Full-Button-Container">
            <Button text="Ok" altClass="accept" />
            <Button text="Cancel" altClass="decline" />
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Prompt;
 