import { useState } from 'react';
// import { createBrowserHistory } from 'history';
// const history = createBrowserHistory();
// let location = history.location;
// let unlisten = history.listen(({ location, action }) => {
//   console.log(action, location.pathname, location.state);
// });
export const routerHook = {};

export const useRouterHook = () => {
  const [state, setState] = useState(null);

  // state && history.push(`http://localhost:3000/${ state }`, { some: 'state' });
  routerHook.uri = state;
  routerHook.routeTo = setState;

  return [state, setState];
};