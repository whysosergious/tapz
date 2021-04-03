/**
 * Card Form for new and existing cards
 */
import React, { useState, useEffect, useRef } from 'react';
import './CardForm.css';

// components
import Card from 'Entry/Card';
import Button from 'shared/Button';

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
let count = 0;
const CardForm = ({ storeId=null, desc=null, brewery=null, column, close }) => {
  const inputDescRef = useRef(null);
  const inputBreweryRef = useRef(null);
  const [ , setState ] = useState(null);
  
  if ( cardId === null ) {
    cardId = storeId;
    formDesc = desc;
    formBrewery = brewery;
  }

  const renderComponent = () => {
    setState(Date.now());
  }

  const displayList = list => {
    activeList = list;
    renderComponent();
  }

  const handleClose = () => {
    selected = [];
    clearAll();
    close();
  };

  const handleSave = () => {
    if ( cardId === null && formDesc ) {
      let newItem = {
        storeId: _store.num++,
        desc: formDesc,
        brewery: formBrewery,
      }
      _store.cards.push(newItem);
      writeData(_store);
      clearAll();
    }
    // if (index >= 0) {
    //   let card = _gc[column].cards[index];
    //   card.title = formDesc;
    //   card.desc = formDesc;
    //   card.image = _gc.CardForm.image === 'none' ? image : _gc.CardForm.image;
    // } else {
    //   _gc[column].cards.push({
    //     stamp,
    //     column,
    //     title: formDesc,
    //     desc: formDesc,
    //     image: _gc.CardForm.image,
    //   });
    // }

    // _gc.CardForm.image = 'none';
    // close();
  };

  const handleAddItemsToBoard = () => {
    _tapz[column].slots[1].push(...selected);
    handleClose();
    writeData(_tapz);
  }

  const handleCheck = (data, add) => {
    if ( add ) {
      data.column = column;
      data.slot = 1;
      data.id = _tapz.num++;
      let deepCopy = JSON.parse(JSON.stringify(data));
      selected.push(deepCopy);
    } else {
      selected.forEach((e,i) => {
        if ( e === data )
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
            clicked={ handleEdit }
            checked={ handleCheck }
            draggable={ false }
          />
        </div>
      );
    });
    return cards;
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
        <Button text={ column ? `Add Selected Items to ${ column }` : 'Save Changes' } clicked={ handleAddItemsToBoard }/>
      </div>
    </div>
  );
};

export default CardForm;
