import { useState } from "react";

// global controller
export const _gc = {
};

// tapz specific controller
export const _tapz = {
  num: 8,
  Current: {
    slots: {
      '1': [
        {
          id: 1,
          hero: true,
          desc: 'Landsort Lager 5%',
          brewery: 'Nynäshanms Ång Bryggeri',
          slot: 1,
          column: 'Current',
        }
      ]
    }
  },
  Queued: {
    slots: {
      '6': [
        {
          id: 2,
          hero: false,
          desc: 'Roughneck IPA 6%',
          brewery: 'Fjäderholmarna',
          slot: 6,
          column: 'Queued',
        },
        {
          id: 3,
          hero: false,
          desc: 'Modus Hoperandi 6%',
          brewery: 'Ska Brewing',
          slot: 6,
          column: 'Queued',
        }
      ]
    }
  },
  RealAle1: {
    slots: {
      '1': []
    }
  },
  RealAle2: {
    slots: {
      '1': []
    }
  },
  RealAle3: {
    slots: {
      '1': []
    }
  },
  CaskBench: {
    slots: {
      '1': []
    }
  },
  KegBench: {
    slots: {
      '1': [
        {
          id: 4,
          hero: false,
          desc: 'Pickla Pils 5%',
          brewery: 'Nynäshanms Ång Bryggeri',
          slot: 1,
          column: 'RealAle3',
        },
        {
          id: 5,
          hero: false,
          desc: 'Sunny Sandy dry hopped IPA 6.5%',
          brewery: 'Fjäderholmarna',
          slot: 1,
          column: 'RealAle1',
        },
        {
          id: 6,
          hero: false,
          desc: 'Fantasma NEIPA 6%',
          brewery: 'Magic Rock',
          slot: 1,
          column: 'KegBench',
        }
      ]
    }
  },
  Recent: {
    slots: {
      '1': [
        {
          id: 7,
          hero: false,
          desc: 'Modus Hoperandi 6%',
          brewery: 'Ska Brewing',
          slot: 1,
          column: 'Recent',
        }
      ]
    }
  },
  options: {
    'Keg-rows': 14,
    'Keg-groups': {
      repeat: 7,
      custom: [
        {
          title: 'Cellar',
          count: 7,
        }
      ],
    }
  }
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


// debbugging purpouses
window.tapz = _tapz;
window.gc = _gc;