/**
 * Dashboard
 */
import React, { useEffect, useState } from "react";
import "./Board.css";

import { _gc, fetchData, writeData } from 'logic/gc';
// import { flattenIndent } from 'logic/procs';
 
// components
import List from 'shared/List';

// media
import SaveIcon from 'ass/vector/files/save.svg';
import UndoIcon from 'ass/vector/files/undo.svg';

let content = [],
  path = [],
  ordinal = 0;
const ContentBoard = () => {
  const [ , setState ] = useState(null);
  const [ modified, setModified ] = useState(false);
  const [ elArray, setElArray ] = useState([]);

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  const handleEditable = ({ target }) => {
    target.setAttribute('contenteditable', true);    
  }
  
  const handleInput = event => {
    let { target } = event,
      { dataset } = target,
      path = dataset.path.split(','),
      data = _gc[`TextContent${ path[0] }`];
    path.shift();

    let targetData;
    for ( let i=0; i<path.length; i++ ) {
      if ( i+1 < path.length ) {
        data = data[path[i]];
      } else {
        targetData = path[i];
      }
    }
    data[targetData] = target.innerText;
    setModified(true);
  }

  let sectionTitle = 'init';
  let nestedContent = [];
  let contentGroup = [];
  const parseToEditable = (data, parent=null) => {
    Object.entries(data).forEach((d, i, a) => {

      let key = d[0],
        val = d[1],
        keyId = `${ parent }${ key }${ ordinal++ }`,
        isLastEntry = i === a.length-1;
      
      if ( !parent ) {
        path = []
        nestedContent = [];
        sectionTitle = key;
      } else {
        if ( typeof val === 'object' ) {
          contentGroup.length > 0 && nestedContent.push(
            <div key={ parent ? `${ keyId }nc` : `${ key }nc` } className="Content-Group">
              { contentGroup }
            </div>
          );
          contentGroup = [];
          nestedContent.push(
            <h2 key={ parent ? `${ keyId }sg` : `${ key }sg` } className="SubGroup">
              <strong>{ key }</strong>
            </h2>
          );
        }
      }
      path.push(key);

      if ( typeof val === 'object' ) {
        
        parseToEditable(val, key);
        isLastEntry && path.pop();
        contentGroup.length > 0 && nestedContent.push(
          <div key={ parent ? `${ keyId }nc` : `${ key }nc` } className="Content-Group">
            { contentGroup }
          </div>
        );
        contentGroup = [];
        
        return;
      }

      let eng;
      path.forEach((p, i) => {
        i === 0 && (eng = _gc.TextContent_en);
        eng = eng[p];
      });

      contentGroup.push(
        <div key={ parent ? `${ keyId }cg` : `${ key }cg` } className="Content-Row">
          <h2 className="ContentKey">
            <strong>{ key }</strong>
          </h2>
          <h2
            data-path={ '_sv,' + path.join() }
            onInput={ handleInput }
            onMouseDown={ handleEditable }>
              { val }
          </h2>
          <h2
            data-path={ '_en,' + path.join() }
            onInput={ handleInput }
            onMouseDown={ handleEditable }>
              { eng }
          </h2>
        </div>
      );

      path.pop();
      isLastEntry && path.pop();
    });

    sectionTitle === parent && content.push(
      <List key={ `${ sectionTitle }${ ordinal }` } title={ sectionTitle }>
        <div className="ColumnGroup">
          <h2 className="ColumnDesc key">Key</h2>
          <h2 className="ColumnDesc">Swedish</h2>
          <h2 className="ColumnDesc">English</h2>
        </div>
        { nestedContent }
      </List>
    );
  }

  useEffect(() => {
    _gc.dashBoard = {
      dispatch: renderComponent,
    }

    let promises = [];
    promises.push(fetchData('TextContent_sv'));
    promises.push(fetchData('TextContent_en'));
    Promise.all(promises).then(data => {
      content = [];
      parseToEditable(data[0]);
      setElArray(content);
    });
  }, []);

  const handleSave = () => {
    let promises = [];
    let svFlight = {
      filename: 'TextContent_sv',
      ext: '.json',
      history: false,
      dir: 'root',
      write: 'data',
      data: _gc.TextContent_sv
    }

    let enFlight = {
      filename: 'TextContent_en',
      ext: '.json',
      history: false,
      dir: 'root',
      write: 'data',
      data: _gc.TextContent_en
    }

    promises.push(writeData(svFlight));
    promises.push(writeData(enFlight));
    Promise.all(promises).then(() => {
      console.log('saved data');
      _gc.TextContent_svBackup = JSON.stringify(_gc.TextContent_sv);
      _gc.TextContent_enBackup = JSON.stringify(_gc.TextContent_en);
      setModified(false);
    });
  }

  const handleUndo = () => {
    content = [];

    _gc.TextContent_sv = JSON.parse(_gc.TextContent_svBackup);
    _gc.TextContent_en = JSON.parse(_gc.TextContent_enBackup);
    parseToEditable(_gc.TextContent_sv);
    setModified(false);
    setElArray(content);
  }

  return (
    <section className="Board Content">
      <h1 className="Board-Heading">Text and Locale</h1>
      <div className="Tools">
        <div className={ `Tool ${ modified ? '' : 'disabled' }` } onClick={ handleUndo }>
          <img src={ UndoIcon } alt="Undo Icon" />
        </div>
        <div className="Tool" onClick={ handleSave }>
          <img src={ SaveIcon } alt="Save Icon" />
        </div>
      </div>
      { elArray }
    </section>
  );
};
 
export default ContentBoard;
 