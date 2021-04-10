/**
 * Task card
 */
import React, { useState } from "react";
import "./Card.css";

// logic
import { startDrag } from "logic/drag";
import { _gc, _store, handleRecent, _tapz, writeData } from "logic/gc";

// components
import CheckBox from 'shared/CheckBox';
import Button from 'shared/Button';
import Prompt from 'shared/Prompt';

// vector
import { CrossCircle, DeleteIcon } from 'ass/vector/icons';


let doubleClickTimer = window.setTimeout;

let viewingElement;
const Card = ({ data, desc, brewery, color, marked=false, select, clicked, draggable=true }) => {
  const { id, storeId, slot, column, hero } = data;
  const [ , setState ] = useState(null);

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  const tapCard = (e) => {
    e && console.log(e,'double event');
    tapped = false;
    let today = new Date();
    let mm = today.getMinutes();
    data.tapped = {
      who: 'Cissi',
      stamp: `${ today.getMonth()+1}/${ today.getDate()} ${ today.getHours() }:${ mm < 10 ? `0${ mm }` : mm }`
    }
    writeData(_tapz);
    alert('Tap');
    renderComponent();
  }

  let origY,
    origX = 0;
  
  let eventElement;
  let tapped = false;
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
    if ( event.target.dataset.root === 'false' ) {
      tapped = true;
      event.target = event.target.parentElement;
    }
      

    eventElement = event.target;
    let pos = /(?:mouse)/g.test(event.type) ? event : event.touches[0];
    origY = pos.screenY;
    origX = pos.screenX;
    startDrag(event);
  }

  // crossCircle.setAttribute('style', 'fill: blue')

  let click = false;
  const handleRelease = event => {
    
    let pos = /(?:mouse)/g.test(event.type) ? event : event.changedTouches[0];
    let offsetY = pos.screenY - origY;
    let offsetX = pos.screenX - origX;
    window.clearTimeout(doubleClickTimer);
    doubleClickTimer = window.setTimeout(()=>{
      click = false;
    }, _gc.options.tapz.doubleClickTiming)
    click && clicked(storeId, desc, brewery, color);
    click = true;
    if (offsetY <= 10 && offsetY >= -10 && offsetX <= 10 && offsetX >= -10) {
      tapped && tapCard();
      
      viewingElement !== eventElement && viewingElement?.parentElement.classList.remove('expand');
      viewingElement = eventElement;
      viewingElement.parentElement.classList.add('expand');
    }
  };

  const handleMouseUp = () => {
    clicked(storeId);
  }

  const selectCard = bool => {
    select(data, bool);
  }

  const removeCard = () => {
    _tapz[column].slots[slot].forEach((card, i) => {
      if ( card.id === id ) {
        handleRecent(column, slot, i);
        _gc[column].dispatch();
        writeData(_tapz);
      }
        
    })
  }

  const deleteFromBank = () => {
    for ( let i=0; i<_store.cards.length; i++) {
      if ( _store.cards[i].storeId === storeId ) {
        _store.cards.splice(i,1);
        break;
      }
    }
    writeData(_store);
    _gc.CardForm.dispatch();
  }

  // const prompt = <Prompt />

  return (
    <div className="Card-Holder">
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
        
          <Button text={ data.tapped ? `${ data.tapped.stamp } ${ data.tapped.who }` : 'Tap' } altClass={ `Tap-Button` } 
            id={id}
            storeid={ storeId }
            column={column}
            slot={slot}
            hero={hero} 
            root={ false }
            clicked={ tapCard }
          />
        
      </div>
      
      <CheckBox checked={ selectCard } theme={ color <= 3 ? 'var(--light)' : 'var(--dark)' } init={ marked }/>
      <div className="Remove-Button" onClick={ removeCard }>
        <CrossCircle style={{ fill: color <= 3 ? 'var(--light)' : 'var(--dark)'}} />
      </div>
      <div className="Delete-Button" onClick={ deleteFromBank }>
        <DeleteIcon style={{ fill: color <= 3 ? 'var(--light)' : 'var(--dark)'}} />
      </div>
      {/* { prompt } */}
    </div>
  );
};

export default Card;
