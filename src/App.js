
import React, { useEffect } from 'react';
import { Redirect, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import './AppGeneral.css';
import './fonts.css';
import './typography.css';

// logic
import { useRouterHook } from 'logic/router';
import { _gc, _zcm, fetchData } from 'logic/gc';

// components
import LoginPage from 'Login/Page';
import { useSessionToken } from 'logic/session-token';
import Sidebar from 'Navigation/Sidebar';
import DashBoard from 'Dash/Board';
import ContentBoard from 'Content/Board';
import TapzBoard from 'Tapz/Board';
import UsersBoard from 'Users/Board';
import SettingsBoard from 'Settings/Board';
import { Spinner } from 'shared/PocketComponents';


function App() {
  const [ route ] = useRouterHook(null);
  const { sessionToken, setSessionToken, removeSessionToken } = useSessionToken();

  useEffect(()=>{
    if ( sessionToken && !_gc.activeUser )
      fetchData('ZCM', 'data/private').then(()=>{
        let user = _zcm.users.find(user => {
          return user.tokens.includes(sessionToken);
        });
        
        console.log('Session token expired');

        if ( !user )
          return removeSessionToken();

        _gc.activeUser = { 
          username: user.username, 
          id: user.id, 
          sessionToken 
        };
      });
  }, []);

  if (!sessionToken)
    return <LoginPage setSessionToken={ setSessionToken } />



  return (
    <section className="App">
      <Sidebar removeSessionToken={ removeSessionToken } />
      <section className="Content">
        <Router>
          { route ? <Redirect to={ route } /> : '' }
          <Route exact path="/">
            <Redirect to="/dash" />
          </Route>
          <Route path="/dash" component={ DashBoard } />
          <Route path="/content" component={ ContentBoard } />
          <Route path="/tapz" component={ TapzBoard } />
          <Route path="/users" component={ UsersBoard } />
          <Route path="/settings" component={ SettingsBoard } />
        </Router>
      </section>
      <Spinner />
    </section>
  );
}

export default App;

