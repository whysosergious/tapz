/**
 * Board view
 */
import React from "react";
import "./Board.css";

// components
import Column from "./Column";

const Board = () => {
  return (
    <section>
      <div className="Group Keg">
        <Column title="Current"
          slotType="hero"
          type="Keg"
          direction="rows"
        />
        <Column title="Queued"
          type="Keg"
          direction="rows"
          widthMod={ 1.7 }
        />
      </div>
      
      <div className="Group Cask">
        <Column title="Real Ale 1" type="Cask" />
        <Column title="Real Ale 2" type="Cask" />
        <Column title="Real Ale 3" type="Cask" />
      </div>

      <div className="Group Cask-Bench">
        <Column title="Cask Bench" 
          type="Bench"
          direction="rows"
          widthMod={ 3 }
          addable={ true }
        />
      </div>

      <div className="Group Keg-Bench">
        <Column title="Keg Bench"
          type="Bench"
          direction="rows"
          widthMod={ 3 }
          addable={ true }
        />
      </div>

      <div className="Group Recent">
        <Column title="Recent"
          type="Bench"
          direction="rows"
          widthMod={ 3 }
        />
      </div>
    </section>
  );
};

export default Board;
