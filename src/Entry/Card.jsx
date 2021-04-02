/**
 * Task card
 */
import React, { useState } from "react";
import "./Card.css";

// logic
import { startDrag } from "logic/drag";
import { _gc } from "logic/gc";

let doubleClickTimer = setTimeout;
let click = false;
const Card = ({ data, desc, brewery, marked=false, checked, clicked, draggable=true }) => {
  const { id, storeId, slot, column, hero } = data;
  const [ checkState, setChecked ] = useState('');
  let origY,
    origX = 0;

  const handlePress = (event) => {
    origY = event.screenY;
    origX = event.screenX;
    startDrag(event);
    window.addEventListener("mouseup", handleRelease);
    
  };
  const handleRelease = (event) => {
    let offsetY = event.screenY - origY;
    let offsetX = event.screenX - origX;
    if (offsetY <= 10 && offsetY >= -10 && offsetX <= 10 && offsetX >= -10) {
      clearTimeout(doubleClickTimer);
      doubleClickTimer = setTimeout(()=>{
        click = false;
      }, _gc.options.tapz.doubleClickTiming)
      click && clicked(storeId, desc, brewery);
      click = true;
    }
    window.removeEventListener("mouseup", handleRelease);
  };

  const handleMouseUp = () => {
    clicked(storeId);
  }

  const handleCheck = event => {
    event.stopPropagation();
    if ( checkState === '' ) {
      setChecked('checked')
      checked(data, true);
    } else {
      setChecked('');
      checked(data, false);
    }
  }
  marked && handleCheck();

  return (
    <>
      <div
        className={ `Card` }
        data-id={id}
        data-storeid={ storeId }
        data-column={column}
        data-slot={slot}
        data-hero={hero}
        onMouseDown={ draggable && handlePress }
        onMouseUp={ draggable || handleMouseUp }
      >
        
        <h4>{desc}</h4>
        <h4>{brewery}</h4>
      </div>
      <span className={ `Check-Box ${ checkState }` } onClick={ handleCheck } />
    </>
  );
};

export default Card;
