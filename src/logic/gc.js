import { useState } from "react";

let watchTimer = setTimeout;
// global controller
export const _gc = {
  activeUser: null,
  options: {
    publicUrl: 'http://localhost/tapz/',
    fileprefix: 'ots-',
    imgaltprefix: 'Oliver Twist Stockholm ',
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
  },
  // timer to track changes and save or fetch when done
  watch: (callback, target) => {
    console.log('Changes to board requested')
    clearTimeout(watchTimer);
    watchTimer = setTimeout(()=>{
      callback(target);
      console.log('done  ', target)
    }, 400);
  },
  menu: {
    filename: 'Menu',
    ext: '.json',
    history: false,
    dir: 'root',
    write: 'all',
    lunch: {
      title: 'Lunch',
      filename: 'lunch',
      dir: 'menu',
      pdf: '',
      images: [],
      seo: ''
    },
    food: {
      title: 'A la carte',
      filename: 'food',
      dir: 'menu',
      pdf: '',
      images: [],
      seo: ''
    },
    drinks: {
      title: 'Drinks',
      filename: 'drinks',
      dir: 'menu',
      pdf: '',
      images: [],
      seo: ''
    },
  },
  seo: {
    page: {
      filename: '',
      ext: '.html',
      history: false,
      dir: 'menu',
      write: 'page',
      head: '<!DOCTYPE html><html lang="en"><head><title>Menu for Oliver Twist Stockholm. Restaurant, beer bar & pub in Södermalm</title><meta name="description" content="One of the best selections of domestic and imported beer in Sweden accompanied by greatly prepared traditional pub food & svensk husmanskost"><meta name="robots" content="index"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta charset="UTF-8">',
      css: '<style>*{box-sizing:border-box;padding:0;margin:0;}body{text-align:center;background-color:black;}main{position:absolute;width:100%;z-index:-1;}section{display:flex;flex-wrap:wrap;}h4{color:black;}.pages{display:flex;flex-direction:column;align-items:center}img{width:fit-content;height:fit-content;max-width:96%;margin-top:1rem;}a{text-decoration:none;}</style>',
      body: '</head><body>',
      foot: '</body><footer><a href="https://zergski.com" alt="Dev homepage"><h4>developed by Sergio Stankevich { zergski.com }</h4></a></footer></html>',
      page: null
    }
  }
}

// tapz specific controller
export var _tapz = {
  filename: 'Tapz',
  ext: '.json',
  history: true,
  dir: 'root',
  write: 'all',
  num: 1,
}

export var _store = {
  filename: 'Store',
  ext: '.json',
  history: true,
  dir: 'root',
  write: 'all',
  num: 1,
  cards: []
}

export var _zcm = {
  filename: 'ZCM',
  ext: '.json',
  history: false,
  dir: 'private',
  write: 'all',
  num: 1,
  roles: {
    0: 'DEV',
    1: 'Admin',
    2: 'Staff',
    3: 'Shared'
  },
  users: []
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

export const uploadFormData = async data => {
  var formData = new FormData();
  formData.append('file', data.file);
  formData.append('path', data.path);
  const response = await fetch(
    `${ cmsroot }fs/fdu.php`,
    {
      method: "POST",
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      body: formData,
    }
  ).catch(err => { console.log(err) });

  await response.text();
}

export const uploadFiles = async data => {
  const response = await fetch(
    `${ cmsroot }fs/fu.php`,
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
  let filePath = `${ cmsroot }${ folder }/${ fileName }${ fileExt }`;
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
    .then(response => {
      return response.json();
    })
    .then(data => {
      setData(data.filename, data);
      
      if ( /(?<!History)(TextContent)/g.test(fileName) ) {
        // _gc.textContent = myJson;
        // backup && (_gc.textBackup = JSON.parse(JSON.stringify(_gc.textContent)));
      } else {
        // result = myJson;
      }
    }).catch(err => { console.log(err) });
  return result;
}

export const setData = (objName, data) => {
  if ( objName === 'Tapz' )
      _tapz = Object.assign(_tapz, data);
    else if ( objName === 'Store' )
      _store = Object.assign(_store, data);
    else if ( objName === 'Menu' )
      _gc.menu = data;
    else if ( objName === 'ZCM' )
      _zcm = data;
}


// custom hook
export const useCustomHook = (init, name) => {
  const [ state, setState ] = useState(init);

  if (!_gc[name]) {
    _gc[name] = {
      state,
      dispatch: setState,
    };
  }

  return [ state, setState ];
};

export const handleRecent = (targetColumn, targetSlot, targetIndex) => {
  let targetData = _tapz[targetColumn].slots[targetSlot].splice(targetIndex, 1)[0];
  targetData.column = 'Recent';
  targetData.slot = 1;
  targetData.hero = false;
  _tapz.Recent.slots[1].unshift(targetData);
  _tapz.Recent.slots[1].length >= 12 && (_tapz.Recent.slots[1] = _tapz.Recent.slots[1].slice(0, 12));
  _gc.Recent.dispatch();
}
