/**
 * Dashboard
 */
import React, { useEffect, useState } from "react";
import "./Board.css";

import { _gc, _zcm, fetchData, writeData, uploadFormData, uploadFiles } from 'logic/gc';
 
// components
import List from 'shared/List';
import ListItem from 'shared/ListItem';
import PdfProc from './PdfProc';
import HousingModal from 'Modals/Housing';
//  import Column from "./Column";



const DashBoard = () => {
  const [ , setState ] = useState(null);
  const [ loadState, setLoadState ] = useState(false);

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  useEffect(() => {
    _gc.dashBoard = {
      dispatch: renderComponent,
    }

    let promises = [];
    promises.push(fetchData('Menu'));
    Promise.all(promises).then(() => {
      setLoadState(true);
    });
  }, []);
 
  return (
    <section className="Board">
      <h1 className="Board-Heading">Dashboard</h1>

      { loadState && 
        <div className="Board-Grid Col-2"
          style={{ 
            '--left-col-width': '2fr',
            '--right-col-width': '1fr'
          }}
        >
        <List title="Menus" >
            <ListItem title="Lunch" 
              buttons={
                <>
                  { /pdf/.test(_gc.menu.lunch.pdf) &&
                    <a href={ _gc.menu.lunch.pdf } target="_blank" rel="noreferrer"><h1 className="Text-Button">PDF</h1></a>
                  }
                  { /html/.test(_gc.menu.lunch.seo) &&
                    <a href={ _gc.menu.lunch.seo } target="_blank" rel="noreferrer"><h1 className="Text-Button">Page</h1></a>
                  }
                  <h1 className="Text-Button" 
                    onClick={ 
                      ()=>_gc['pdfmodal'].open(true, 'menu', 'lunch') 
                    }>Edit</h1>
                </>
              } 
            />
            <ListItem title="A la carte" 
              buttons={
                <>
                  { /pdf/.test(_gc.menu.food.pdf) &&
                    <a href={ _gc.menu.food.pdf } target="_blank" rel="noreferrer"><h1 className="Text-Button">PDF</h1></a>
                  }
                  { /html/.test(_gc.menu.food.seo) &&
                    <a href={ _gc.menu.food.seo } target="_blank" rel="noreferrer"><h1 className="Text-Button">Page</h1></a>
                  }
                  <h1 className="Text-Button" 
                  onClick={ 
                    ()=>_gc['pdfmodal'].open(true, 'menu', 'food') 
                  }>Edit</h1>
                </>
              } 
            />
            <ListItem title="Drinks" 
              buttons={
                <>
                  { /pdf/.test(_gc.menu.drinks.pdf) &&
                    <a href={ _gc.menu.drinks.pdf } target="_blank" rel="noreferrer"><h1 className="Text-Button">PDF</h1></a>
                  }
                  { /html/.test(_gc.menu.drinks.seo) &&
                    <a href={ _gc.menu.drinks.seo } target="_blank" rel="noreferrer"><h1 className="Text-Button">Page</h1></a>
                  }
                  <h1 className="Text-Button" 
                  onClick={ 
                    ()=>_gc['pdfmodal'].open(true, 'menu', 'drinks') 
                  }>Edit</h1>
                </>
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
      }
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
  pageFlight.page = `${ _gc.seo.page.head }${ _gc.seo.page.css }${ _gc.seo.page.body }<main>${ data.seo }</main><div class="pages">${ images }</div>${ _gc.seo.page.foot }`;
  
  let filesToDelete = data.snap.images.map(img=>img.path);
  data.snap.pdf && filesToDelete.push(data.snap.pdf);
  data.snap.seo && filesToDelete.push(data.snap.seo);

  let fileFlight = {
    dir: 'root',
    delete: filesToDelete,
    upload: data.images.map(img => {
      return {
        file: img.url,
        path: `/${ data.dir }/${ img.name }${ img.ext }`
      }
    })
  }

  let formDataFlight = {
    file: data.pdf,
    path: `/${ data.dir }/${ _gc.options.fileprefix }${ data.filename }.pdf`
  }

  let promises = [];
  promises.push(writeData(pageFlight));
  promises.push(uploadFiles(fileFlight));
  promises.push(uploadFormData(formDataFlight));

  Promise.all(promises).then(() => {
    let images = data.images.map(img => {
      return({
        url: `${ _gc.options.publicUrl }data/${ data.dir }/${ img.name }${ img.ext }`,
        path: `/${ data.dir }/${ img.name }${ img.ext }`,
        alt: img.alt
      });
    });
    data.images = images;
    data.pdf = `${ _gc.options.publicUrl }data/${ formDataFlight.path }`;
    data.seo = `${ _gc.options.publicUrl }data/${ data.dir }/${ pageFlight.filename }${ pageFlight.ext }`;

    // TODO dynamic menues
    _gc.menu.lunch.snap = null;
    _gc.menu.food.snap = null;
    _gc.menu.drinks.snap = null;

    writeData(_gc.menu);
  });
}