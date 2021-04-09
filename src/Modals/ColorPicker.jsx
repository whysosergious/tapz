/**
 * Color picker for cards
 */
import React, { useState } from "react";
import './ColorPicker.css';

// logic
import { _gc, _store } from 'logic/gc';

// components
import CheckBox from 'shared/CheckBox';


const ColorPicker = ({ color=0, onSelect, editOnly=true }) => {
  const [ clr, setColor ] = useState(color);
  
  const toggleRandomColor = bool => {
    _gc.options.tapz.randomizeCardColors = bool;
  }

  const switchColor = c => {
    onSelect(c);
    setColor(c);
  }
  
  const colorCards = _gc.options.tapz.colors.map((e,i) => {
    return(
      <div key={`color${ e }`}
        className={ `Swatch ${ e } ${ clr === i ? 'selected' : '' }` }
        onClick={ ()=>switchColor(i) }>
        
      </div>
    );
  });


  return (
    <div className="Color-Picker-Container">
      { !editOnly && <CheckBox text="Randomize colors" checked={ toggleRandomColor } init={ _gc.options.tapz.randomizeCardColors } /> }
      <div className="Swatches">
        { colorCards }
      </div>
    </div>
  );
};

export default ColorPicker;
 