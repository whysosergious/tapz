/**
 * List component
 */
import React, { useState, useEffect } from "react";
import "./ListItem.css";

// logic
// import { _gc } from 'logic/gc';

const ListItem = ({ title, altClass='', buttons, content, children, mousedown, input }) => {

  return (
    <div className={ `List-Item-Component ${ altClass }` }>
      <h2 className={ `Text-Editable ${ altClass }` } onMouseDown={ mousedown } onInput={ (ev, id, li, pa)=>input(ev, id, li, pa)}>
        {
          /info/.test(altClass) ?
            title :
            <strong>{ title }</strong>
        }
      </h2>
      { content }
      { buttons }
      { children }
    </div>
  );
};

export default ListItem;