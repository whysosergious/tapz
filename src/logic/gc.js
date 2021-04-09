import { useState } from "react";

// global controller
export const _gc = {
  options: {
    tapz: {
      doubleClickTiming: 400,
      'Keg-rows': 14,
      'Keg-groups': {
        repeat: 7,
        custom: [
          {
            title: 'Cellar',
            count: 7,
          }
        ],
      },
      colors: [
        'stout',
        'blueberry',
        'brown',
        'red',
        'ipa',
        'pale',
        'wheat',
        'lager'
      ],
      randomizeCardColors: true,
    }
  }
}

// tapz specific controller
export var _tapz = {
  filename: 'Tapz',
  num: 1,
}

export var _store = {
  filename: 'Store',
  num: 1,
  cards: []
}


const cmsroot = 'http://localhost/tapz/';
const dataFolder = 'data';
export const writeData = async (data) => {
  const response = await fetch(
    `${ cmsroot }fs/fw.php`,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  ).catch(err => { console.log(err) });

  await response.text();
}



export const fetchData = async (fileName, folder=dataFolder, { fileExt='.json', backup=true } = {}) => {
  let result = null;
  let filePath = `${ cmsroot }/${ folder }/${ fileName }${ fileExt }`;
  await fetch(filePath
  ,{
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
    },
    cache: 'no-store',
  })
    .then(function(response){
      // console.log(response)
      return response.json();
    })
    .then(function(data) {
      if ( data.filename === 'Tapz' )
        _tapz = data;
      else if ( data.filename === 'Store' )
        _store = data;
      
      if ( /(?<!History)(TextContent)/g.test(fileName) ) {
        // _gc.textContent = myJson;
        // backup && (_gc.textBackup = JSON.parse(JSON.stringify(_gc.textContent)));
      } else {
        // result = myJson;
      }
    }).catch(err => { console.log(err) });
  return result;
}


// custom hook
export const useCustomHook = (init, name) => {
  const [state, setState] = useState(init);

  if (!_gc[name]) {
    _gc[name] = {
      state,
      dispatch: setState,
    };
  }

  return [state, setState];
};

export const handleRecent = (targetColumn, targetSlot, targetIndex) => {
  let targetData = _tapz[targetColumn].slots[targetSlot].splice(targetIndex, 1)[0];
  targetData.column = 'Recent';
  targetData.slot = 1;
  targetData.hero = false;
  _tapz.Recent.slots[1].unshift(targetData);
  _gc.Recent.dispatch();
}