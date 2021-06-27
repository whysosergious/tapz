/**
 * Dashboard
 */
import React, { useEffect, useState } from "react";
import "./Board.css";

import { _gc, fetchData, writeData, uploadFormData, uploadFiles } from 'logic/gc';
 
// components
import List from 'shared/List';
import ListItem from 'shared/ListItem';
import PdfProc from './PdfProc';
import HousingModal from 'Modals/Housing';
//  import Column from "./Column";

// media
import SaveIcon from 'ass/vector/files/save.svg';
import UndoIcon from 'ass/vector/files/undo.svg';

let ordinal = 0;
const DashBoard = () => {
  const [ , setState ] = useState(null);
  const [ openHours, setOpenHours ] = useState([]);
  const [ modified, setModified ] = useState(false);

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  const handleEditable = ({ target }) => {
    const findHero = () => {
      if ( !/h[\d]*/i.test(target.tagName) ) {
        target = target.parentElement;
        findHero();
      } else {
        target.setAttribute('contenteditable', true);    
      }
    }
    findHero();
  }
  
  const handleInput = (event, id, list, path) => {
    let { target } = event,
      data = _gc[`OpenHours`][list];

    path = path.split('.');
    for ( let i=0; i<data.length; i++ ) {
      if ( data[i].id === id ) {
        let key, d;
        if ( path.length > 1 ) {
          d = data[i][path[0]];
          key = path[1];
        } else {
          d = data[i];
          key = path;
        }

        d[key] = target.innerText;
        console.log(target.innerText);
        setModified(true);
        return;
      }
    }
  }

  const parseData = data => {
    let regular = [],
      exceptions = [];

    data.regular.forEach(({ id, name, closed, hours }) => {
      regular.push(
        <ListItem key={ `${ name }${ id }${ ordinal++ }` } title={ name } altClass="align-l">
          <h2 className="Hours-Editable" onMouseDown={ handleEditable } onInput={ event=>handleInput(event, id, 'regular', 'hours') }>
          { closed ? 'Closed' : hours }
          </h2>
        </ListItem>
      );
    });

    regular = <List key="HoursRegular" altClass="regular" title="Regular Hours">
      { regular }
    </List>

    data.exceptions.forEach(({ id, type, text, closed, hours }) => {
      exceptions.push(
        <ListItem key={ `${ type }${ id }${ ordinal++ }` } altClass={ `${ type } ${ type === 'info' ? '' : 'align-l' }` } title={ text.en } editable={ true } mousedown={ handleEditable } input={ event=>handleInput(event, id, 'exceptions', 'text.en') }>
          { type !== 'info' && 
              <h2 className="Hours-Editable" onMouseDown={ handleEditable } onInput={ event=>handleInput(event, id, 'exceptions', 'hours') }>
              { closed ? 'Closed' : hours }
            </h2>
          }
        </ListItem>
      );
    });

    exceptions = <List key="HoursExceptions" altClass="pc-2" title="Exceptions & Info">
      { exceptions }
    </List>

    setOpenHours([regular, exceptions]);
  }

  useEffect(() => {
    _gc.dashBoard = {
      dispatch: renderComponent,
    }

    let promises = [];
    promises.push(fetchData('OpenHours'));
    promises.push(fetchData('Menu'));
    Promise.all(promises).then(data => {
      parseData(data[0]);
    });
  }, []);
 
  const handleSave = () => {
    let hoursFlight = {
      filename: 'OpenHours',
      ext: '.json',
      history: false,
      dir: 'root',
      write: 'data',
      data: _gc.OpenHours
    }

    writeData(hoursFlight).then(() => {
      console.log('saved data');
      _gc.OpenHoursBackup = JSON.stringify(_gc.OpenHours);
      setModified(false);
    });
  }

  const handleUndo = () => {
    _gc.OpenHours = JSON.parse(_gc.OpenHoursBackup);
    parseData(_gc.OpenHours);
    setModified(false);
  }

  return (
    <section className="Board">
      <h1 className="Board-Heading">Dashboard</h1>

      {/* { loadState &&  */}
        <div className="Board-Grid Col-2"
          style={{ 
            '--left-col-width': '2fr',
            '--right-col-width': '1fr'
          }}
        >
        <List title="Menus" >
            <ListItem title="Lunch" handle="lunch" altClass="align-l"
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
            <ListItem title="A la carte" handle="food" altClass="align-l"
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
            <ListItem title="Drinks" handle="drinks" altClass="align-l"
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
          <div className="Tools">
          <div className={ `Tool ${ modified ? '' : 'disabled' }` } onClick={ handleUndo }>
            <img src={ UndoIcon } alt="Undo Icon" />
          </div>
          <div className="Tool" onClick={ handleSave }>
            <img src={ SaveIcon } alt="Save Icon" />
          </div>
        </div>
          { openHours }
        </div> 
      {/* } */}
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

    writeData(_gc.menu).then(()=>{
      _gc.dashBoard.dispatch();
    });
  });
}