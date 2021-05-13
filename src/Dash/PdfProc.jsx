/**
 * Pdf menu handler
 */
import React, { useEffect, useState } from "react";
import * as pdfjsLib from 'pdfjs-dist/webpack';
import './PdfProc.css';

import { _gc } from 'logic/gc';

// components
import DropBox from 'shared/DropBox';
//  import Column from "./Column";


let pages, seoText;
const PdfProc = ({ menu }) => {
  const [ , setState ] = useState(null);

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  useEffect(() => {
    _gc.pdfProc = {
      dispatch: renderComponent,
    }
  });

  const handlePreview = files => {
    if ( !files[0] )
      return;

    let url = URL.createObjectURL(files[0]);
    pages = [];
    seoText = [];

    pdfjsLib.getDocument(url).promise.then( pdf => {
      let pageCount = pdf._pdfInfo.numPages,
        i = 0;

      const renderPage = () => {
        i++;

        pdf.getPage(i).then( page => {
          let promises = [],
            scale = 1.3,
            viewport = page.getViewport({ scale }),
            canvas = document.createElement("canvas"),
            context = canvas.getContext("2d");

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          promises.push(
            page.render({
              canvasContext: context, 
              viewport: viewport
            }).promise.then(() => {
              let imgB64 = canvas.toDataURL('image/jpeg');
              
              pages.push(
                <div key={ `${ menu }page${ i }` } className="Preview">
                  <img src={ imgB64 } alt={ `${ menu }page${ i }` } />
                </div>
              );
            })
          );

          promises.push(
            page.getTextContent().then( res => {
              seoText.push(
                <h4 key={ `${ menu }text${ i }` }>{ res.items.map(txt => txt.str).join('') }</h4>
              );
            })
          );

          Promise.all(promises).then(() => {
            renderComponent();
            i < pageCount && renderPage();
          });
        });
      }
      renderPage();
    });
  }

  return (
    <div className="Component-Container Proc-Modal">
      <div className="Component-Header">
        <h1>{ menu }</h1>
        <h1 className="Text-Button">PDF</h1>
        <h1 className="Text-Button">Raw</h1>
      </div>
      
      <div className="Preview-Container">
        <div className="Preview-Wrapper">
          { pages }
        </div>
      </div>
      
      <DropBox changed={ handlePreview } />
      {/* <div>
        { seoText }
      </div> */}
      
    </div>
  );
};

export default PdfProc;