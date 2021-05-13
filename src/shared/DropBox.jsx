import React, { useRef, useEffect, useState } from "react";
import "./DropBox.css";

// logic
// import { _gc } from "logic/gc";

// icons
// import imageIcon from "ass/vector/image.svg";

let renderComponent;

const openFileExplorer = (event) => {
  event.currentTarget.firstElementChild.click();
};



const handleDragEvents = (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (event.currentTarget !== window) {
    boxClass = /dragenter|dragover/g.test(event.type)
      ? "highlight expand"
      : "expand";
    if (/drop/g.test(event.type)) {
      boxClass = "";
      let files = event.dataTransfer.files;
      callback(files);
    }
  } else {
    boxClass = /dragleave|drop/g.test(event.type) ? "" : "expand";
  }

  renderComponent();
};

const handleDropListeners = (target, action) => {
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    target[`${action}EventListener`](eventName, handleDragEvents, false);
  });
};

var dropBox;
var boxClass = "";
var messageClass = "";

const handleInputChange = ( event ) => {
  let files = event.target.files;
  callback(files);
};

var fileInput = React.createElement("input", {
  key: "mediainput",
  type: "file",
  className: "File-Input",
  name: "gallery",
  accept: "application/pdf",
  multiple: false,
  onChange: handleInputChange,
});

var callback;
const DropBox = ({ changed }) => {
  const [ , setState] = useState(null);
  const dropBoxRef = useRef();
  callback = changed;

  renderComponent = ( s=Date.now() ) => {
    setState(s);
  };

  useEffect(() => {
    dropBox = dropBoxRef.current;
    handleDropListeners(dropBox, "add");
    handleDropListeners(window, "add");

    return () => {
      handleDropListeners(dropBox, "remove");
      handleDropListeners(window, "remove");
    };
  }, []);

  return (
    <>
      <div
        className={`Drop-Box ${ boxClass } ${ messageClass }`}
        ref={dropBoxRef}
        onClick={openFileExplorer}
      >
        {fileInput}
        <div className={ `Drop-Box-Message` }>
          {/* <img src={imageIcon} alt="File icon" /> */}
          <h2 className={ `small` }>Upload file</h2>
        </div>
      </div>
    </>
  );
};

export default DropBox;
