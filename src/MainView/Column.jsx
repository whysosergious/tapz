/**
 * Board Column
 */
import React, { useEffect } from "react";
import "./Column.css";

// logic
import { useCustomHook, _gc, _tapz } from "logic/gc";

// components
import Card from "Entry/Card";
import CardForm from "Modals/CardForm";





let modals = [];
let count = 0;
const Column = ({ title, type, slotType='', direction='columns', widthMod=1 }) => {
  let column = title.replace(/\s+/g, "");
  const [ , setState] = useCustomHook([], column);

  const handleCloseModal = () => {
    modals = [];
    renderComponent();
  };
  const handleAddCard = () => {
    let stamp = Date.now() + count++;

    modals = [
      <CardForm
        key={`modal${stamp}`}
        column={column}
        stamp={`${stamp}`}
        close={handleCloseModal}
      />,
    ];
    renderComponent();
  };
  const handleViewCard = (id, desc, brewery) => {
    let stamp = Date.now() + count++;
    modals = [
      <CardForm
        key={`modal${stamp}`}
        id={id}
        desc={desc}
        column={column}
        brewery={brewery}
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


  const createCards = ( entries ) => {
    // console.log(_tapz[column], entries)
    let cards = [];
    entries?.forEach(e => {
      let card = <Card
      key={ e.id }
        id={ e.id }
        slot={ e.slot }
        desc={ e.desc }
        brewery={ e.brewery }
        column={ column }
        hero={ e.hero }
        clicked={ handleViewCard }
      />;
      slotType === 'hero' ? cards = [card] : cards.push(card);      
    });
    return cards[0] ? cards : undefined ;
  }

  
  let slots = [];
  if ( type === 'Keg' ) {

    for ( let i=1; i<=_tapz.options['Keg-rows']; i++) {
      if ( _tapz.options['Keg-groups'].repeat > 0 ) {
        var firstInGroup = _tapz.options['Keg-groups'].repeat === i-1 ? 'first-in-group' : '';
      }

      slots.push(
        <div key={ `Keg${ Date.now() + i }` }
          className={ `Entry-Slot ${ type } ${ slotType } ${ firstInGroup }` }
          data-column={ column }
          data-slot={ i }
          data-hero={ slotType === 'hero' }
        >
          { slotType === 'hero' ? <h1 className="Row-Title">{ i }</h1> : undefined }
          
          { createCards(_tapz[column].slots[i]) }
        </div> 
      );
    }
  } else if ( type === 'Cask' ) {
    slots = [
      <div key={ `Cask${ Date.now() + 1 }` }
        className={ `Entry-Slot ${ type } hero` }
        data-column={ column }
        data-slot={ 1 }
        data-hero={ true }
      >
        { createCards(_tapz[column].slots[1]) }
      </div>,
      <div key={ `Cask${ Date.now() + 2 }` }
        className={ `Entry-Slot large ${ type }` }
        data-column={ column }
        data-slot={ 2 }
        data-hero={ false }
      >
        { createCards(_tapz[column].slots[2]) }
      </div>
    ];
  } else {
    slots = [
      <div key={ `Bench${ Date.now() }` }
        className={ `Entry-Slot ${ type }` }
        data-column={ column }
        data-slot={ 1 }
        data-hero={ false }
      >
        { createCards(_tapz[column].slots[1]) || <h4 className="Idle-Message" >This bench is empty</h4> }
      </div>
    ]
  }

  



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
      { modals }
    </div>
  );
};

export default Column;
