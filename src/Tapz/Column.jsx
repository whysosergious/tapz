/**
 * Board Column
 */
import React, { useEffect, useState } from "react";
import "./Column.css";

// logic
import { useCustomHook, _gc, _tapz, _store, writeData, fetchData } from "logic/gc";

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
  const [ minimized, setMinimized ] = useState(column === 'Recent' ? true : false);

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
  const handleViewCard = (storeId, desc, brewery, clr) => {
    let stamp = Date.now() + count++;
    modals = [
      <CardForm
        key={`modal${stamp}`}
        storeId={storeId}
        desc={desc}
        brewery={brewery}
        color={ clr }
        close={handleCloseModal}
      />,
    ];
    renderComponent();
  };

  const renderComponent = (s=Date.now()) => {
    setState(s);
  };

  useEffect(() => {
    _gc[column].dispatch = renderComponent;
  }, []);


  const createCards = ( entries, slot ) => {
    let cards = [];

    try {
      entries?.forEach((e, i) => {
        
        let storeCard = _store.cards.find(card => card.storeId === e.storeId);
        if ( storeCard ) {
          e.desc = storeCard.desc;
          e.brewery = storeCard.brewery;
          let card = <Card key={ e.id }
            data={ e }
            color={ storeCard.color }
            desc={ storeCard.desc }
            brewery={ storeCard.brewery }
            clicked={ handleViewCard }
          />;
          slotType === 'hero' ? cards = [card] : cards.push(card);   
          
          // insert a span element after every x card with a full width flex-basis for row break
          if ( type === 'Bench' && (i+1) % 4 === 0)
            cards.push(<span key={ `${ column }RowBreak${ i }` } className="Bench-Row-Break" />);

        } else {
          // managing deleted store cards
          if ( _store.cards.length < 1 ) {
            fetchData('Store').then(()=>{
              _gc.tapzBoard.dispatch();
              console.log('refetched _store data');
            });
            return;
          }
            

          _tapz[column].slots[slot].splice(i,1);
          _gc.watch(writeData, _tapz);
        }
      });
    } catch(exc) { console.log(exc) }
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
        <div key={ `${ column }${ i }` }
          className={ `Entry-Slot ${ type } ${ slotType } ${ firstInGroup }` }
          data-column={ column }
          data-slot={ i }
          data-hero={ slotType === 'hero' }
        >
          { slotType === 'hero' ? <h1 className="Row-Title">{ i }</h1> : undefined }
          
          { createCards(_tapz[column].slots[i], i) }
        </div> 
      );
    }
  } else if ( type === 'Cask' ) {
    _tapz[column].slots[1] || ( _tapz[column].slots[1] = [] );
    _tapz[column].slots[2] || ( _tapz[column].slots[2] = [] );
    slots = [
      <div key={ `${ column }${ 1 }` }
        className={ `Entry-Slot ${ type } hero` }
        data-column={ column }
        data-slot={ 1 }
        data-hero={ true }
      >
        { createCards(_tapz[column].slots[1], 1) }
      </div>,
      <div key={ `${ column }${ 2 }` }
        className={ `Entry-Slot large ${ type }` }
        data-column={ column }
        data-slot={ 2 }
        data-hero={ false }
      >
        { createCards(_tapz[column].slots[2], 2) }
      </div>
    ];
  } else {
    _tapz[column].slots[1] || ( _tapz[column].slots[1] = [] );
    slots = [
      <div key={ `${ column }${ 1 }` }
        className={ `Entry-Slot ${ type }` }
        data-column={ column }
        data-slot={ 1 }
        data-hero={ false }
      >
        { createCards(_tapz[column].slots[1], 1) || <h4 className="Idle-Message" >This bench is empty</h4> }
      </div>
    ]
  }  

  const expandToggle = () => {
    setMinimized(!minimized);
  }

  return (      
    <div className={ `Column ${ type } ${ direction } ${ minimized ? 'minimized' : '' }` }
      style={{ width: `${ 14 * widthMod }vw` }}
      data-column={column}
      data-key={column}
    >
      <div className="Column-Heading-Group">
        <h1 className="Column-Title">{title}</h1>
        { column === 'Recent' && <h1 className="Text-Button" onClick={ expandToggle }>{ minimized ? 'show' : 'hide' }</h1> }
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
