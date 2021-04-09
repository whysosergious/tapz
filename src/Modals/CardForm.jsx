/**
 * Card Form for new and existing cards
 */
import React, { useState, useEffect, useRef } from 'react';
import './CardForm.css';

// components
import Card from 'Entry/Card';
import Button from 'shared/Button';
import ColorPicker from './ColorPicker';

// logic
import { writeData, _gc, _tapz, _store } from 'logic/gc';

let formDesc,
  formBrewery = '';
let titleInput, descInput;
const handleDescChange = (event) => {
  titleInput = event.target;
  formDesc = titleInput.value;
};
const handleBreweryChange = (event) => {
  descInput = event.currentTarget;
  formBrewery = descInput.value;
};

_gc.CardForm = {
  image: 'none',
};


let cardId = null;
let activeList = 'store';
let selected = [];
let cardColor = 0;
const CardForm = ({ storeId=null, desc=null, brewery=null, color, column, close }) => {
  const inputDescRef = useRef(null);
  const inputBreweryRef = useRef(null);
  const [ , setState ] = useState(null);
  
  const setRandomCardColor = () => {
    cardColor = Math.floor(Math.random() * _gc.options.tapz.colors.length);
  }

  if ( cardId === null ) {
    cardId = storeId;
    formDesc = desc;
    formBrewery = brewery;
    _gc.options.tapz.randomizeCardColors && setRandomCardColor();
  } else {
    cardColor = color;
  }

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  const displayList = list => {
    activeList = list;
    renderComponent();
  }

  const handleClose = () => {
    selected = [];
    _gc.tapzBoard.dispatch();
    writeData(_tapz);
    clearAll();
    close();
  };

  const handleSave = () => {
    if ( cardId === null && formDesc ) {
      let newItem = {
        storeId: _store.num++,
        desc: formDesc,
        brewery: formBrewery,
        color: cardColor
      }
      _store.cards.push(newItem);
      writeData(_store);
      clearAll();
    } else if ( cardId !== null && formDesc ) {
      _store.cards.forEach(card => {
        if ( card.storeId === cardId ) {
          card.desc = formDesc;
          card.brewery = formBrewery;
          card.color = cardColor;
        }
      });
      writeData(_store).then(()=>{
        column ? renderComponent() : _gc.tapzBoard.dispatch();
        writeData(_tapz);
      });
      column || handleClose();
    }
  };

  const handleAddItemsToBoard = () => {
    _tapz[column].slots[1].push(...selected);
    handleClose();
    writeData(_tapz);
  }

  const selectCard = (data, add) => {
    if ( add ) {
      data.column = column;
      data.slot = 1;
      data.id = _tapz.num++;
      let deepCopy = JSON.parse(JSON.stringify(data));
      selected.push(deepCopy);
    } else {
      selected.forEach((e,i) => {
        if ( e.id === data.id )
          selected.splice(i, 1);
      });
    }
    renderComponent();
  }

  const handleEdit = storeId => {
    cardId = storeId;
    _store.cards.forEach(card => {
      if ( card.storeId === cardId ) {
        inputDescRef.current.value = card.desc;
        inputBreweryRef.current.value = card.brewery;
        formDesc = card.desc;
        formBrewery = card.brewery;
      }
    });
    renderComponent();
  }

  const clearAll = () => {
    cardId = null;
    inputDescRef.current.value = null;
    inputBreweryRef.current.value = null;
    renderComponent();
  }

  useEffect(()=>{

  }, []);

  let listResults = () => {
    let items;
    let cards = [];
    if ( activeList === 'store' )
      items = _store.cards;
    else
      items = selected;

    items.forEach(e => {
      cards.push(
        <div key={ `wrapper${ e.storeId }` } className="Card-Wrapper">
          <Card key={ e.storeId }
            data={ e }
            desc={ e.desc }
            brewery={ e.brewery }
            color={ e.color }
            clicked={ handleEdit }
            select={ selectCard }
            draggable={ false }
          />
        </div>
      );
    });
    return cards;
  }

  const setCardColor = clr => {
    cardColor = clr;
  }

  return (
    <div className={`Card-Form-Container`}>
      <div className="Overlay" onClick={ handleClose }></div>
      <div className={`Card-Form`}>
        <div className="Button-Container a-r">
          <Button text="x" clicked={ handleClose } />
        </div>
        
        <div className="Input-Container">
          <div className="Button-Container a-r">
            <h4 className="Card-Action-Status">{ cardId === null ? `New item` : `Selected item with id: ${ cardId }`  }</h4>
            { column &&
              <>
                <Button text="Clear" clicked={clearAll} />
                <Button text={ cardId === null ? 'Add' : 'Save' } clicked={handleSave} />
              </>
            }
          </div>
          <input
            type="text"
            ref={ inputDescRef }
            onChange={handleDescChange}
            defaultValue={formDesc}
            placeholder="Name and other stuff"
          ></input>
          <input
            type="text"
            ref={ inputBreweryRef }
            onChange={handleBreweryChange}
            defaultValue={formBrewery}
            placeholder="Brewery"
          ></input>
          <ColorPicker color={ cardColor } editOnly={ column && false } onSelect={ setCardColor } />
        </div>
        
        { column && 
          <div className="Store-Container">
            <div className="Button-Container fill b-b">
              <Button altClass={ activeList === 'store' ? `Tab active` : 'Tab' } text="Beer Bank" clicked={ ()=>displayList('store') } />
              <Button altClass={ activeList === 'selected' ? `Tab active` : 'Tab' } text="Selected Items" clicked={ ()=>displayList('selected') } />
            </div>
            <div class="List-Container">
              { listResults() }
            </div>
          </div> 
        }
        <Button text={ column ? `Add Selected Items to ${ column }` : 'Save Changes' } clicked={ column ? handleAddItemsToBoard : handleSave }/>
      </div>
    </div>
  );
};

export default CardForm;
