/**
 * Board Column
 */
import React, { useEffect } from "react";
import "./Column.css";

// logic
import { useCustomHook, _gc, _tapz } from "logic/gc";

// components
import Card from "Entry/Card";
import TaskForm from "Modals/TaskForm";





let modals = [];
let count = 0;
const Column = ({ ego='', title, type, slotType, direction='columns', widthMod=1, hero=false }) => {
  let column = title.replace(" ", "");

  const [ , setState] = useCustomHook([], column);

  const handleCloseModal = () => {
    modals = [];
    renderComponent();
  };
  const handleAddCard = () => {
    let stamp = Date.now() + count++;

    modals = [
      <TaskForm
        key={`modal${stamp}`}
        column={column}
        stamp={`${stamp}`}
        close={handleCloseModal}
      />,
    ];
    renderComponent();
  };
  const handleViewCard = (title, desc, i, image) => {
    modals = [
      <TaskForm
        key={`modal${Date.now()}`}
        index={i}
        column={column}
        title={title}
        image={image}
        desc={desc}
        close={handleCloseModal}
      />,
    ];
    renderComponent();
  };

  const renderComponent = () => {
    setState(Date.now());
  };

  useEffect(() => {
    _gc[column].dispatch = renderComponent;
  }, []);

  let slots = [];
  if ( type === 'Keg' ) {

    for ( let i=1; i<=_tapz.options['Keg-rows']; i++) {
      if ( _tapz.options['Keg-groups'].repeat > 0 ) {
        var firstInGroup = _tapz.options['Keg-groups'].repeat === i-1 ? 'first-in-group' : '';
      }
      slots.push(
        <div key={ `Keg${ Date.now() + i }` }
          className={ `Entry-Slot ${ type } ${ slotType || '' } ${ firstInGroup }` }
          data-column={ column }
          data-index={ i }
        >
          { slotType === 'hero' ? <h1 className="Row-Title">{ i }</h1> : undefined }
        </div> 
      );
    }
  } else if ( type === 'Cask' ) {
    slots = [
      <div key={ `Cask${ Date.now() + 1 }` }
        className={ `Entry-Slot ${ type } hero` }
        data-column={ column }
        data-index={ 1 }
      ></div>,
      <div key={ `Cask${ Date.now() + 2 }` }
        className={ `Entry-Slot large ${ type }` }
        data-column={ column }
        data-index={ 2 }
      ></div>
    ];
  }

  

  let cards = _gc[column].cards.map((card, i) => {
    const { stamp, title, image, desc, column } = card;
    return (
      <Card
        key={stamp}
        index={i}
        title={title || "Untitled"}
        desc={desc || "No description"}
        image={image}
        column={column}
        compkey={stamp}
        clicked={handleViewCard}
      />
    );
  });

  return (      
    <div className={ `Column ${ type } ${ direction }` }
      style={{ width: `${ 14 * widthMod }vw` }}
      data-column={column} 
      data-key={column}
      >
      <h1 className="Column-Title">{title}</h1>
      <div className="Container">
        { slots }
      </div>
    </div>
  );
};

export default Column;
