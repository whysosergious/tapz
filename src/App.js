
import React from 'react';
import { Redirect, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import './AppGeneral.css';
import './fonts.css';
import './typography.css';

// logic
import { useRouterHook } from 'logic/router';

// components
import Sidebar from 'Navigation/Sidebar';
import DashBoard from 'Dash/Board';
import ContentBoard from 'Content/Board';
import TapzBoard from 'Tapz/Board';
import UsersBoard from 'Users/Board';
import SettingsBoard from 'Settings/Board';


function App() {
  const [ route ] = useRouterHook(null);
  return (
    <div className="App">
      <Sidebar />
      <section className="Content">
      <Router>
        { route ? <Redirect to={ route } /> : '' }
        <Redirect to="/dash" />
        <Route path="/dash" component={ DashBoard } />
        <Route path="/content" component={ ContentBoard } />
        <Route path="/tapz" component={ TapzBoard } />
        <Route path="/users" component={ UsersBoard } />
        <Route path="/settings" component={ SettingsBoard } />
      </Router>
      </section>
    </div>
  );
}

export default App;

