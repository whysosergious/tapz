/**
 * Pdf menu handler
 */
import React, { useEffect, useState } from "react";

import './MenuHandler.css';

import { _gc } from 'logic/gc';

// components
import DropBox from 'shared/DropBox';
//  import Column from "./Column";


// workers
// pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';

const MenuHandler = ({ menu }) => {
  const [ , setState ] = useState(null);

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  useEffect(() => {
    _gc.menu = {
      dispatch: renderComponent,
    }
  });

  const handlePreview = files => {
    // let url = URL.createObjectURL(files[0]),
      // loadingTask = pdfjsLib.getDocument(url);

    // loadingTask.promise.then((pdf)=>{
    //   let pageCount = pdf._pdfInfo.numPages;

    //   let i = 0;
    //   const renderPage = () => {
    //     pdf.getPage(i).then(async function(page) {

        

    //       let scale = 1.5;
    //       let viewport = page.getViewport({ scale: scale, });
          
    //       let canvas = document.createElement("canvas");
    //       let context = canvas.getContext("2d");
    //       canvas.height = viewport.height;
    //       canvas.width = viewport.width;
  
    //       var renderContext = {
    //         canvasContext: context,
    //         viewport: viewport,
    //       }
  
    //       var renderTask = page.render({canvasContext: context, viewport: viewport});
  
    //       await renderTask.promise.then(function() {
    //         let imgUrl = canvas.toDataURL('image/jpeg');
    //         let lastPage = i<pageCount ? false : true;
    //         // abPrime.appendPreview(imgUrl, el, i, pageCount, lastPage);
    //         i<pageCount && renderPage();
    //       });
    //     });
    //   }
    //   renderPage();
    // });
  }

  return (
    <div>
      <h1>{ menu }</h1>
      <div className="Preview-Container">
        <div className="Preview">

        </div>
      </div>
      <DropBox changed={ handlePreview } />
    </div>
  );
};

export default MenuHandler;