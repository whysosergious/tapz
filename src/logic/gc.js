import { useState } from "react";

let watchTimer = setTimeout;
// global controller
export const _gc = {
  options: {
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
      pdf: '',
      images: [],
      seo: ''
    },
    food: {
      title: 'A la carte',
      filename: 'food',
      pdf: '',
      images: [],
      seo: ''
    },
    drinks: {
      title: 'Drinks',
      filename: 'drinks',
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
      head: '<!DOCTYPE html><head><title>Menu for Oliver Twist Stockholm. Restaurant, beer bar & pub in Södermalm</title><meta name="description" content="One of the best selections of domestic and imported beer in Sweden accompanied by greatly prepared traditional pub food & svensk husmanskost"><meta name="robots" content="index"><style>body{background-color:black}main{position:absolute}h4{color:black}</style></head><html><body>',
      foot: '</body><footer><a href="https://zergski.com" alt="Dev homepage"><h4>developed by Sergio Stankevich { zergski.com }</h4></a></footer></html>'
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

export const uploadFiles = async (data) => {
  console.log(data);
  var formData = new FormData();
  // formData.append('file', data.pdf);
  formData.append('file', data.image);
  const response = await fetch(
    `${ cmsroot }fs/pdfu.php`,
    {
      method: "POST",

      body: formData,
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
        _tapz = Object.assign(_tapz, data);
      else if ( data.filename === 'Store' )
        _store = Object.assign(_store, data);
      
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
