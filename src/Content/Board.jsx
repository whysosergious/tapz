/**
 * Dashboard
 */
 import React, { useEffect, useState } from "react";
 import "./Board.css";
 
 import { _gc } from 'logic/gc';
 
 // components
//  import Column from "./Column";
 
 const ContentBoard = () => {
   const [ , setState ] = useState(null);
 
   const renderComponent = ( s=Date.now() ) => {
     setState(s);
   }
 
   useEffect(() => {
     _gc.contentBoard = {
       dispatch: renderComponent,
     }
   });
 
   return (
     <section className="Board">
       <h1 className="Board-Heading">Text and Locale</h1>
     </section>
   );
 };
 
 export default ContentBoard;
 