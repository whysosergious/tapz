/**
 * Board Column
 */
import React, { useEffect } from "react";
import "./Column.css";

// logic
import { useCustomHook, _gc, _tapz, _store, writeData } from "logic/gc";

// components
import Card from "Entry/Card";
import CardForm from "Modals/CardForm";


const structureData = (column, key, entry={}) => {
  _tapz[column] = {
    [key]: entry
  };
}

let modals = [];
let count = 0;
const Column = ({ title, type, slotType='', direction='columns', widthMod=1, addable=false }) => {
  let column = title.replace(/[\s+]/g, "");
  _tapz[column] || structureData(`${ column }`, 'slots');
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
        close={handleCloseModal}
      />,
    ];
    renderComponent();
  };
  const handleViewCard = (storeId, desc, brewery) => {
    let stamp = Date.now() + count++;
    modals = [
      <CardForm
        key={`modal${stamp}`}
        storeId={storeId}
        desc={desc}
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
    let cards = [];
    entries?.forEach(e => {
      let storeCard = _store.cards.find(card => card.storeId === e.storeId);
      let card = <Card key={ e.id }
        data={ e }
        desc={ storeCard.desc }
        brewery={ storeCard.brewery }
        clicked={ handleViewCard }
      />;
      slotType === 'hero' ? cards = [card] : cards.push(card);      
    });
    return cards[0] ? cards : undefined ;
  }

  let slots = [];
  if ( type === 'Keg' ) {

    for ( let i=1; i<=_gc.options.tapz['Keg-rows']; i++) {
      _tapz[column].slots[i] || ( _tapz[column].slots[i] = [] );
      if ( _gc.options.tapz['Keg-groups'].repeat > 0 ) {
        var firstInGroup = _gc.options.tapz['Keg-groups'].repeat === i-1 ? 'first-in-group' : '';
      }

      slots.push(
        <div key={ `${ type }${ Date.now() + i }` }
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
    _tapz[column].slots[1] || ( _tapz[column].slots[1] = [] );
    _tapz[column].slots[2] || ( _tapz[column].slots[2] = [] );
    slots = [
      <div key={ `${ type }${ Date.now() + 1 }` }
        className={ `Entry-Slot ${ type } hero` }
        data-column={ column }
        data-slot={ 1 }
        data-hero={ true }
      >
        { createCards(_tapz[column].slots[1]) }
      </div>,
      <div key={ `${ type }${ Date.now() + 2 }` }
        className={ `Entry-Slot large ${ type }` }
        data-column={ column }
        data-slot={ 2 }
        data-hero={ false }
      >
        { createCards(_tapz[column].slots[2]) }
      </div>
    ];
  } else {
    _tapz[column].slots[1] || ( _tapz[column].slots[1] = [] );
    slots = [
      <div key={ `${ type }${ Date.now() }` }
        className={ `Entry-Slot ${ type }` }
        data-column={ column }
        data-slot={ 1 }
        data-hero={ false }
      >
        { createCards(_tapz[column].slots[1]) || <h4 className="Idle-Message" >This bench is empty</h4> }
      </div>
    ]
  }  

  // save on every rerender ( user action )
  writeData(_tapz);

  return (      
    <div className={ `Column ${ type } ${ direction }` }
      style={{ width: `${ 14 * widthMod }vw` }}
      data-column={column}
      data-key={column}
    >
      <div className="Column-Heading-Group">
        <h1 className="Column-Title">{title}</h1>
        { addable && <h1 className="Text-Button" onClick={ handleAddCard }>Add+</h1> }
      </div>
      
      <div className="Container">
        { slots }
      </div>
      { modals }
    </div>
  );
};

export default Column;
