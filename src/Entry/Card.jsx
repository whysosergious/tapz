/**
 * Task card
 */
import React from "react";
import "./Card.css";

// logic
import { startDrag } from "logic/drag";

const Card = ({ index, title, image, desc, column, compkey, clicked }) => {
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
      clicked(title, desc, index, image);
    }
    window.removeEventListener("mouseup", handleRelease);
  };

  return (
    <>
      <div
        className="Task-Card"
        data-column={column}
        data-key={compkey}
        onMouseDown={handlePress}
      >
        <h4>{title}</h4>
        {image !== "none" && <img src={image} alt="Preview" />}
      </div>
    </>
  );
};

export default Card;
