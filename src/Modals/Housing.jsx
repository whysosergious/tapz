/**
 * Container dialog
*/
import React, { useState, useEffect } from "react";
import "./Housing.css";

//
import { _gc } from 'logic/gc';

// components
import Button from 'shared/Button';


const HousingModal = ({ text='', altClass, preflight, children, handle }) => {
  const [ , setState ] = useState(null);
  const [ open, setOpen ] = useState(false);

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  const handleOpen = (bool, obj, target) => {
    if ( bool ) {
      _gc[handle].target = _gc[obj][target];
      _gc[handle].target.snap = JSON.parse(JSON.stringify(_gc[handle].target));
    }
    setOpen(bool);
  }

  const handleOk = () => {
    handleOpen(false);
    preflight(_gc[handle].target);
  }

  const handleDecline = () => {
    _gc[handle].target = _gc[handle].target.snap;
    handleOpen(false);
  }

  useEffect(()=>{
    _gc[handle] = {
      open: handleOpen,
      dispatch: renderComponent,
    }
  }, []);

  if ( !open )
    return(<></>);

  return (
    <div className={`Prompt-Container`}>
      <div className="Overlay" onClick={ handleDecline }></div>
      <div className={ `Housing-Modal` }>
        <div className="Button-Container a-r">
          <Button text="x" clicked={ handleDecline } />
        </div>
        <children.type { ...children.props } handle={ handle } />
        <div className="Full-Button-Container">
          <Button text="Save" altClass="accept" clicked={ handleOk } />
          <Button text="Cancel" altClass="decline" clicked={ handleDecline } />
        </div>
      </div>
    </div>
  );
};

export default HousingModal;