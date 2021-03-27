import { useState } from "react";

// global controller
export const _gc = {
};

// tapz specific controller
export const _tapz = {
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
      cards: [],
      state,
      dispatch: setState,
    };
  }

  return [state, setState];
};
