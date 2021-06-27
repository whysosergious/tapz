/**
 * Dashboard
 */
import React, { useEffect, useState } from "react";
import "./Board.css";

import { _gc, fetchData, _zcm, writeData } from 'logic/gc';

// components
import List from 'shared/List';
import ListItem from 'shared/ListItem';

let username, password, name;
const handleUsernameInput = event => {
  username = event.target.value;
}

const handlePasswordInput = event => {
  password = event.target.value;
}

const handleNameInput = event => {
  name = event.target.value;
}


let users = [];
const UsersBoard = () => {
  const [ , setState ] = useState(null);

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  const displayUsers = () => {
    users = [];
    _zcm.users.forEach(user => {
      users.push(
        <ListItem key={ `user${ user.username }${ user.id }` } title={ user.username } altClass="align-l"
          buttons={
            <>
              <div style={{ display: 'flex', flexBasis: '70%', justifyContent: 'space-evenly', alignItems: '', marginLeft: '1rem' }}>
                <h2 style={{ flexBasis: '20%', margin: '0 .5rem' }}>{ user.name }</h2>
                <h2 style={{ flexBasis: '20%', margin: '0 .5rem' }}>{ _zcm.roles[user.role] }</h2>
                <h2 style={{ flexBasis: '20%', margin: '0 .5rem' }}>{ user.password }</h2>
                <h2 style={{ flexBasis: '20%', margin: '0 .5rem' }}>{ user.id }</h2>
                <h2 style={{ flexBasis: '20%', margin: '0 .5rem' }}>{ user.tokens.join(', ') }</h2>
              </div>
              
              <h1 className="Text-Button" 
                onClick={ ()=>editUser(user) }>Edit</h1>
              <h1 className="Text-Button" 
                onClick={ ()=>deleteUser(user) }>Delete</h1>
            </>
          } 
        />
      );
    });
    renderComponent();
  }

  useEffect(() => {
    _gc.usersBoard = {
      dispatch: renderComponent,
    }
    fetchData('ZCM', 'data/private').then(()=>{
      displayUsers();
    });
  }, []);

  // TODO encrypt password
  const createUser = () => {
    if ( !username || !password )
      return;

    _zcm.users.push(
      {
        id: ++_zcm.num,
        username,
        password,
        role: 1,
        name,
        tokens: []
      }
    );
    writeData(_zcm).then(()=>{
      displayUsers();
    });
  }

  const editUser = user => {
    console.log('Edit user ', user);
  }

  const deleteUser = user => {
    _zcm.users.find((u, i, a) => {
      return u.id === user.id && a.splice(i,1);
    });
    writeData(_zcm).then(()=>{
      displayUsers();
    });
  }

  return (
    <section className="Board">
      <h1 className="Board-Heading">Users</h1>
        <div className="Board-Grid Col-2"
          style={{ 
            '--left-col-width': '2fr',
            '--right-col-width': '1fr'
          }}
        >
          <List title="Name" >
            { users }
          </List>
          <List title="New user">
            <input type="text"
              className="Defined" 
              placeholder="Username" 
              onChange={ handleUsernameInput }
              // required

              // TEMP***
              autoComplete="off"
            />
            <input type="password"
              className="Defined" 
              placeholder="Password"
              onChange={ handlePasswordInput }
              // required
            />
            <input type="text"
              className="Defined" 
              placeholder="Name" 
              onChange={ handleNameInput }

              // TEMP***
              autoComplete="off"
            />
            <button text="Login" className="accept" style={{ width: '100%' }} onClick={ createUser }>
              <h4>Register</h4>
            </button>
          </List>
        </div> 
    </section>
  );
};

export default UsersBoard;
 