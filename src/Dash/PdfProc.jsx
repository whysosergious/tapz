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


let pages = [], 
  seoText = [];
const PdfProc = ({ handle }) => {
  const target = _gc[handle].target;
  const [ , setState ] = useState(null);

  const reset = () => {
    pages = [];
    seoText = [];
  }

  const generatePreviews = (img) => {
    pages.push(
      <div key={ img.title } className="Preview">
        <img src={ img.url } alt={ img.alt } />
      </div>
    );
  }

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }

  useEffect(() => {
    _gc.pdfProc = {
      dispatch: renderComponent,
    }
    if ( pages.length !== target.images.length ) {
      target.images.forEach(img => generatePreviews(img));
      renderComponent();
    }
    return ()=>reset();
  }, []);

  const handlePreview = files => {
    if ( !files[0] )
      return;

    _gc.spinner.display(true);

    reset();
    target.pdf = files[0];
    //temp
    target.seo = '';
    target.images = [];

    let url = URL.createObjectURL(files[0]);

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
              let imgB64 = canvas.toDataURL('image/jpeg'),
                img = { 
                  name: `${ _gc.options.fileprefix }${ target.title.replace(/[\s]/g,'')}Page${ i }`,
                  ext: '.jpeg',
                  url: imgB64, 
                  alt: `${ _gc.options.imgaltprefix }${ target.title } Page-${ i }` 
                }
              target.images.push(img);
              generatePreviews(img);
            })
          );

          promises.push(
            page.getTextContent().then( res => {
              let pageText = [];

              res.items.forEach(txt => {
                /^[\s]$/.test(txt.str) || 
                  pageText.push(
                    !pageText[0] ? 
                      `<h1>${ txt.str }</h1>` : 
                    (!pageText[1]) ? 
                      `<h2>${ txt.str }</h2>` : 
                      `<h3>${ txt.str }</h3>`
                  );
              });
              target.seo += `<section>${ pageText.join('') }</section>`;
              seoText.push(
                <h4 key={ `${ target.title }text${ i }` }>{ pageText }</h4>
              );
            })
          );

          Promise.all(promises).then(() => {
            renderComponent();
            i < pageCount ? renderPage() : (_gc.spinner.display(false) || console.log('loc ', target));
            
          });
        });
      }
      renderPage();
    });
  }

  return (
    <div className="Component-Container Proc-Modal">
      <div className="Component-Header">
        <h1>{ target.title }</h1>
        { /pdf/.test(target.pdf) &&
          <a href={ target.pdf } target="_blank" rel="noreferrer"><h1 className="Text-Button">PDF</h1></a>
        }
        { /html/.test(target.seo) &&
          <a href={ target.seo } target="_blank" rel="noreferrer"><h1 className="Text-Button">Page</h1></a>
        }
      </div>
      
      <div className="Preview-Container">
        <div className="Preview-Wrapper">
          { pages }
        </div>
      </div>
      
      <DropBox changed={ handlePreview } />
    </div>
  );
};

export default PdfProc;