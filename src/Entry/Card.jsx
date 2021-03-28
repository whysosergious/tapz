/**
 * Task card
 */
import React from "react";
import "./Card.css";

// logic
import { startDrag } from "logic/drag";
import { _tapz } from "logic/gc";

const Card = ({ id, slot, desc, brewery, column, hero, clicked }) => {
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
      clicked(id, desc, brewery);
    }
    window.removeEventListener("mouseup", handleRelease);
  };

  return (
    <>
      <div
        className="Card"
        data-id={id}
        data-column={column}
        data-slot={slot}
        data-hero={hero}
        onMouseDown={handlePress}
      >
        <h4>{desc}</h4>
      </div>
    </>
  );
};

export default Card;
