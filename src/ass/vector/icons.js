/**
 * Vector icons and adhering styling
 */
import './icons.css';



export const CrossCircle = ({ altclass='', style={}}) => {
  return (
    <svg data-name="crossCircle" className={ `Cross-Circle ${ altclass }` } style={ style } xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <path d="M128,0A128,128,0,1,0,256,128,128.1,128.1,0,0,0,128,0Zm47.1,160.1a10.6,10.6,0,1,1-15,15l-32.1-32-32.1,32a10.6,10.6,0,0,1-15-15l32-32.1-32-32.1a10.6,10.6,0,0,1,15-15l32.1,32,32.1-32a10.6,10.6,0,0,1,15,15l-32,32.1Z"/>
    </svg>
  );
}


export const DeleteIcon = ({ altclass='', style={}}) => {
  return(
    <svg data-name="delete" className={ `Delete-Icon ${ altclass }` } style={ style } xmlns="http://www.w3.org/2000/svg" width="201.2" height="256" viewBox="0 0 201.2 256">
      <g>
        <path d="M193.7,72.5a7.6,7.6,0,0,0,7-10.3,47.7,47.7,0,0,0-44.1-29.7h-9.2C144,14.4,128.1,0,108.6,0h-16C73.2,0,57.2,14.4,53.8,32.5H44.6A47.7,47.7,0,0,0,.5,62.2a7.6,7.6,0,0,0,7,10.3ZM92.6,15h16A24.7,24.7,0,0,1,132,32.5H69.2A24.8,24.8,0,0,1,92.6,15Z"/>
        <path d="M28.1,235.1A22.7,22.7,0,0,0,50.6,256h100a22.7,22.7,0,0,0,22.5-20.9L183.6,87.5H17.6Zm93-107.5a7.5,7.5,0,0,1,15,.8l-4,80a7.5,7.5,0,0,1-15-.8Zm-48.9-7.1a7.5,7.5,0,0,1,7.9,7.1l4,80a7.5,7.5,0,0,1-15,.8l-4-80a7.5,7.5,0,0,1,7.1-7.9Z"/>
      </g>
    </svg>
  );
}
