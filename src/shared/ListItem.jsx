/**
 * List component
 */
import React from "react";
import "./ListItem.css";

// components


const ListItem = ({ title, buttons, content }) => {

  // const handleClose = () => {

  // }

  // const handleOk = () => {
  //   accept(date, who)
  // }

  // const handleDecline = () => {
  //   decline();
  // }

  return (
    <div className="List-Item-Component">
      <h1>{ title }</h1>
      { content }
      { buttons }
    </div>
  );
};

export default ListItem;