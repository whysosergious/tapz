/**
 * List component
 */
import React, { useState, useEffect } from "react";
import "./ListItem.css";

// logic
// import { _gc } from 'logic/gc';

const ListItem = ({ title, buttons, content }) => {

  return (
    <div className="List-Item-Component">
      <h1>{ title }</h1>
      { content }
      { buttons }
    </div>
  );
};

export default ListItem;