/**
 * List component
 */
import React from "react";
import "./List.css";

// components


const List = ({ altClass='', title, children }) => {
// console.log(...items.props.children);
  // const handleClose = () => {

  // }

  // const handleOk = () => {
  //   accept(date, who)
  // }

  // const handleDecline = () => {
  //   decline();
  // }

  return (
    <div className={ `List-Component ${ altClass }` }>
      <div className="Column-Heading-Group">
        <h1 className="Column-Title">{ title }</h1>
      </div>
      <div className={ `List-Container ${ altClass }` }>
        { children }
      </div>
    </div>
  );
};

export default List;