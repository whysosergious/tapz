/**
 * Dashboard
 */
import React, { useEffect, useState } from "react";
import "./Board.css";

import { _gc, writeData, uploadFiles } from 'logic/gc';
 
// components
import List from 'shared/List';
import ListItem from 'shared/ListItem';
import PdfProc from './PdfProc';
import HousingModal from 'Modals/Housing';
//  import Column from "./Column";



const DashBoard = () => {
  const [ , setState ] = useState(null);

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  useEffect(() => {
    _gc.dashBoard = {
      dispatch: renderComponent,
    }
  });
 
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
              <h1 className="Text-Button" 
                onClick={ 
                  ()=>_gc['pdfmodal'].open(true, 'menu', 'lunch') 
                }>Edit</h1>
            } 
          />
          <ListItem title="A la carte" 
            buttons={
              <h1 className="Text-Button" 
              onClick={ 
                ()=>_gc['pdfmodal'].open(true, 'menu', 'food') 
              }>Edit</h1>
            } 
          />
          <ListItem title="Drinks" 
            buttons={
              <h1 className="Text-Button" 
              onClick={ 
                ()=>_gc['pdfmodal'].open(true, 'menu', 'drinks') 
              }>Edit</h1>
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
      <HousingModal handle="pdfmodal" preflight={ prepMenuData }>
        <PdfProc/>
      </HousingModal>
    </section>
  );
};
 
export default DashBoard;
 

// prep data before POST
const prepMenuData = data => {
  let pageFlight = {
    filename: data.filename,
    ext: '.html',
    history: false,
    dir: 'menu',
    write: 'page'
  }
  let images = data.images.map(img => {
    return(
      `<img src="${ img.name }${ img.ext }" alt="${ img.alt }" />`
    );
  }).join('');
  pageFlight.page = `${ _gc.seo.page.head }<main>${ data.seo }</main><div>${ images }</div>${ _gc.seo.page.foot }`;
  
  // let filesFlight = {
  //   filename: `${ _gc.options.fileprefix }${ data.filename }`,
  //   ext: '.pdf',
  //   history: false,
  //   dir: 'menu',
  //   write: 'all',
  //   pdf: data.pdf
  // }

  let filesFlight = {
    pdf: data.pdf,
    images: {
      // image: data.images[0].name + data.images[0].ext
      
    },
    image: data.images[0].url
  }

  let promises = [];
  // promises.push(writeData(pageFlight));
  promises.push(uploadFiles(filesFlight));

  Promise.all(promises).then(() => {
    let images = data.images.map(img => {
      return({
        url: `/menu/${ img.name }${ img.ext }`,
        alt: img.alt
      });
    });
    data.images = images;
    data.pdf = ``;
    // writeData(_gc.menu);
    // console.log(_gc.menu);
  });
}