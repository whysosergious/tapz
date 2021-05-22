/**
 * Dynamic propmt
 */
import React from "react";
import "./Prompt.css";

// components
import Button from 'shared/Button';


let date, who;
const Prompt = ({ text='', altClass, accept, decline, pocket }) => {

  // const handleClose = () => {

  // }

  const handleOk = () => {
    accept(date, who)
  }

  const handleDecline = () => {
    decline();
  }

  return (
    <div className={`Card-Form-Container`}>
      <div className="Overlay" onClick={ handleDecline }></div>
        <div className={ `Prompt` }>
          { pocket }
          <div className="Full-Button-Container">
            <Button text="Ok" altClass="accept" clicked={ handleOk } />
            <Button text="Cancel" altClass="decline" clicked={ handleDecline } />
          </div>
        </div>
    </div>
  );
};
 
export default Prompt;
 