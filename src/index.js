import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// logic
import { _gc, _tapz,  _store, fetchData } from 'logic/gc';

fetchData('Store').then(()=>{
  fetchData('Tapz').then(()=>{
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    );
    reportWebVitals();

    // debbugging purpouses
    window.tapz = _tapz;
    window.store = _store;
    window.gc = _gc;
  });
});