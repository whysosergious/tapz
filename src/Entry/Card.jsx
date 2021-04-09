/**
 * Task card
 */
import React, { useState } from "react";
import "./Card.css";

// logic
import { startDrag } from "logic/drag";
import { _gc, _store } from "logic/gc";

// components
import CheckBox from 'shared/CheckBox';


let doubleClickTimer = window.setTimeout;

let viewingElement;
const Card = ({ data, desc, brewery, color, marked=false, select, clicked, draggable=true }) => {
  const { id, storeId, slot, column, hero } = data;
  // const [ , setState ] = useState(null);

  // const renderComponent = ( s=Date.now() ) => {
  //   setState(s);
  // }

  let origY,
    origX = 0;
  
  let eventElement;
  const handleMouseDown = event => {
    if ( 'touchstart' in window )
      return;

    eventPress(event);
    window.addEventListener("mouseup", handleRelease, { once: true });
  }

  const handleTouchStart = event => {
    eventPress(event);
  }

  const eventPress = event => {
    eventElement = event.target;
    let pos = /(?:mouse)/g.test(event.type) ? event : event.touches[0];
    origY = pos.screenY;
    origX = pos.screenX;
    startDrag(event);
  }

  let click = false;
  const handleRelease = event => {
    let pos = /(?:mouse)/g.test(event.type) ? event : event.changedTouches[0];
    let offsetY = pos.screenY - origY;
    let offsetX = pos.screenX - origX;
    window.clearTimeout(doubleClickTimer);
    doubleClickTimer = window.setTimeout(()=>{
      click = false;
    }, _gc.options.tapz.doubleClickTiming)
    console.log(color)
    click && clicked(storeId, desc, brewery, color);
    click = true;
    if (offsetY <= 10 && offsetY >= -10 && offsetX <= 10 && offsetX >= -10) {
      
      
      viewingElement !== eventElement && viewingElement?.classList.remove('expand');
      viewingElement = eventElement;
      viewingElement.classList.add('expand');
    }
  };

  const handleMouseUp = () => {
    clicked(storeId);
  }

  const selectCard = bool => {
    select(data, bool);
  }
  marked && selectCard();

  return (
    <>
      <div
        className={ `Card ${ _gc.options.tapz.colors[color] }` }
        data-id={id}
        data-storeid={ storeId }
        data-column={column}
        data-slot={slot}
        data-hero={hero}
        onMouseDown={ draggable ? handleMouseDown : undefined }
        onTouchStart={ draggable ? handleTouchStart : undefined }
        onMouseUp={ !draggable ? handleMouseUp : undefined }
      >
        
        <h4>{desc}</h4>
        <h4>{brewery}</h4>
      </div>

      <CheckBox checked={ selectCard } theme={ color <= 3 ? 'var(--light)' : 'var(--dark)' }/>
    </>
  );
};

export default Card;
