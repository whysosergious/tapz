/**
 * Main navigation bar
 */
 import React from "react";
 import "./Sidebar.css";

 import { routerHook } from 'logic/router';
 // components

 // icons
 import Logo from 'ass/vector/files/zcm.svg';
 import DashIcon from 'ass/vector/files/dashboard.svg';
 import ContentIcon from 'ass/vector/files/content.svg';
 import TapzIcon from 'ass/vector/files/keg.svg';
 import UsersIcon from 'ass/vector/files/users.svg';
 import SettingsIcon from 'ass/vector/files/settings.svg';
 import LogoutIcon from 'ass/vector/files/logout.svg';
 
const Sidebar = () => {
  return (
    <nav className="Sidebar">
      <div className="Nav-Button Logo">
        <img src={ Logo } alt="Zergski Content Manager icon" />
      </div>

      <div className="Nav-Button" onClick={ ()=>routerHook.routeTo('/dash') }>
        <img src={ DashIcon } alt="Dashboard icon" />
      </div>
      <div className="Nav-Button" onClick={ ()=>routerHook.routeTo('/content') }>
        <img src={ ContentIcon } alt="Content icon" />
      </div>
      <div className="Nav-Button" onClick={ ()=>routerHook.routeTo('/tapz') }>
        <img src={ TapzIcon } alt="Keg icon" />
      </div>
      <div className="Nav-Button" onClick={ ()=>routerHook.routeTo('/users') }>
        <img src={ UsersIcon } alt="Users icon" />
      </div>
      <div className="Nav-Button" onClick={ ()=>routerHook.routeTo('/settings') }>
        <img src={ SettingsIcon } alt="Settings icon" />
      </div>
      <div className="Nav-Button Logout">
        <img src={ LogoutIcon } alt="Logout icon" />
      </div>

    </nav>
  );
};
 
 export default Sidebar;
 