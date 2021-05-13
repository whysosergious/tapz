/**
 * Container dialog
*/
import React, { useState, useEffect } from "react";
import "./Housing.css";

// components
import Button from 'shared/Button';


const HousingModal = ({ text='', altClass, accept, decline, children, handles }) => {
  const [ active, setActive ] = useState(false);

  const handleActive = bool => {
    setActive(bool);
  }

  const handleOk = () => {
    // accept();
  }

  const handleDecline = () => {
    decline();
  }

  useEffect(()=>{
    handles('modal', handleActive);
  }, []);
  
  if ( !active )
    return(<></>);

  return (
    <div className={`Prompt-Form-Container`}>
      <div className="Overlay" onClick={ handleDecline }></div>
      <div className={ `Housing-Modal` }>
        <div className="Button-Container a-r">
          <Button text="x" clicked={ ()=>handleActive(false) } />
        </div>
        <children.type { ...children.props } a="a" />
        <div className="Full-Button-Container">
          <Button text="Ok" altClass="accept" clicked={ handleOk } />
          <Button text="Cancel" altClass="decline" clicked={ ()=>handleActive(false) } />
        </div>
      </div>
    </div>
  );
};

export default HousingModal;