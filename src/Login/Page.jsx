/**
 * Login
 */
import React, { useEffect, useState } from "react";
import "./Page.css";

// logic
import { _gc, _zcm, setData, writeData } from 'logic/gc';

// components
// import Button from 'shared/Button';

let username = '',
  password = '',
  error;
const handleUsernameInput = event => {
  username = event.target.value;
}

const handlePasswordInput = event => {
  password = event.target.value;
}

const signIn = async (credentials) => {
  return fetch('http://localhost/tapz/data/private/li.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then(response => response.json())
}

const LoginPage = ({ setSessionToken }) => {
  const [ , setState ] = useState(null);

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  useEffect(() => {
    _gc.loginPage = {
      dispatch: renderComponent,
    }
  });

  const handleSubmit = event => {
    event.preventDefault();

    signIn({ 
      username,
      password
    }).then(response => {
      console.log('Sign in responce: ', response);
      if ( response.status === 'success') {
        _gc.activeUser = {
          username,
          id: response.userid,
          sessionToken: response.sessiontoken
        }
        setSessionToken(response.sessiontoken);
        setData('ZCM', response.zcm);

        let user = _zcm.users.find(user => {
          return user.id === response.userid;
        });
        if ( !user.tokens.includes(response.sessiontoken) ) {
          user.tokens.push(response.sessiontoken);
          
          writeData(_zcm).then(()=>{
            console.log('Saved user session token');
            console.log('Active user: ', _gc.activeUser);
          });
        }
      } else {
        error = response.attempt;
        renderComponent();
      }
    }).catch(err => console.log(err));
  }

  return (
    <section className="Login">
      <h1>admin_#tapz</h1>
      <form className="Login" onSubmit={ handleSubmit }>
        <input type="text" id="username" name="username" 
          className="Defined" 
          placeholder="Username" 
          onChange={ handleUsernameInput }
          // required

          // TEMP***
          autoComplete="off"
        />
        <input type="password" id="password" name="password" 
          className="Defined" 
          placeholder="Password"
          onChange={ handlePasswordInput }
          // required
        />
        <button text="Login" className="accept" type="submit" >
          <h4>Sign in</h4>
        </button>
        { error && <h2 className="Message">Sign in failed. Wrong credentials</h2> }
      </form>
      <a href="#doris" className="Login"><h2>Forgot password?</h2></a>
      
    </section>
  );
};

export default LoginPage;
