/**
 * Dashboard
 */
import React, { useEffect, useState } from "react";
import "./Board.css";

import { _gc } from 'logic/gc';
 
// components
import MenuHandler from './MenuHandler';
//  import Column from "./Column";
 
const DashBoard = () => {
  const [ , setState ] = useState(null);

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  useEffect(() => {
    _gc.dashBoard = {
      dispatch: renderComponent,
    }
  });

  return (
    <section className="Board">
      <h1 className="Board-Heading">Dash</h1>
      <MenuHandler menu="drinks" />
    </section>
  );
};
 
export default DashBoard;
 