/**
 * Dashboard
 */
import React, { useEffect, useState } from "react";
import "./Board.css";

import { _gc } from 'logic/gc';
 
// components
import List from 'shared/List';
import ListItem from 'shared/ListItem';
import PdfProc from './PdfProc';
import HousingModal from 'Modals/Housing';
//  import Column from "./Column";


const childHandles = {};
const DashBoard = () => {
  const [ , setState ] = useState(null);


  const regChildHandles = (child, handle) => {
    console.log(child, handle)
    childHandles[child] = handle;
  }

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  useEffect(() => {
    _gc.dashBoard = {
      dispatch: renderComponent,
    }
  });

  const openModal = () => {
    // console.log(childHandles.modal)
    childHandles.modal(true);
  }

  return (
    <section className="Board">
      <h1 className="Board-Heading">Dash</h1>
      <div className="Board-Grid Col-2"
        style={{ 
          '--left-col-width': '2fr',
          '--right-col-width': '1fr'
        }}
      >
        <List title="Menus" >
          <ListItem title="Lunch" 
            buttons={
              <h1 className="Text-Button" onClick={ openModal }>Edit</h1>
            } 
          />
          <ListItem title="A la carte" 
            buttons={
              <h1 className="Text-Button" onClick={ openModal }>Edit</h1>
            } 
          />
          <ListItem title="Drinks" 
            buttons={
              <h1 className="Text-Button" onClick={ openModal }>Edit</h1>
            } 
          />
        </List>
        <List title="Opening hours">
          <ListItem title="Monday" 
            content={
              <h2 contentEditable="true">11-20</h2>
            } 
          />
          <ListItem title="Tuesday" 
            content={
              <h2 contentEditable="true">11-20</h2>
            } 
          />
          <ListItem title="Wednesday" 
            content={
              <h2 contentEditable="true">11-20</h2>
            } 
          />
          <ListItem title="Thursday" 
            content={
              <h2 contentEditable="true">11-20</h2>
            } 
          />
        </List>
      </div>
      <HousingModal handles={ regChildHandles } >
        <PdfProc menu="drinks" />
      </HousingModal>
    </section>
  );
};
 
export default DashBoard;
 