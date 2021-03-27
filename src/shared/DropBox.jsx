import React, { useRef, useEffect, useState } from "react";
import "./DropBox.css";

// logic
import { _gc } from "logic/gc";

// icons
import imageIcon from "ass/vector/image.svg";

let updateComponent;

const openFileExplorer = (event) => {
  event.currentTarget.firstElementChild.click();
};

var reader = new FileReader();
let previewSource;
const handleDroppedFiles = (files) => {
  if (files && files[0]) {
    reader.onload = function (e) {
      previewRef.current.style.display = "block";
      previewSource = e.target.result;
      previewRef.current.src = previewSource;
      _gc.taskForm.image = previewSource;
    };

    reader.readAsDataURL(files[0]);
  }
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
      let dt = event.dataTransfer;
      let files = dt.files;
      handleDroppedFiles(files);
    }
  } else {
    boxClass = /dragleave|drop/g.test(event.type) ? "" : "expand";
  }

  updateComponent();
};

const handleDropListeners = (target, action) => {
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    target[`${action}EventListener`](eventName, handleDragEvents, false);
  });
};

var dropBox;
var boxClass = "";
var messageClass = "";

const handleInpuChange = (event) => {
  let files = event.target.files;
  handleDroppedFiles(files);
};

var fileInput = React.createElement("input", {
  key: "mediainput",
  type: "file",
  className: "File-Input",
  name: "gallery",
  accept: "image/*",
  multiple: true,
  onChange: handleInpuChange,
});

var previewRef;
const DropBox = ({ image = "none" }) => {
  const [ , setState] = useState(null);
  previewRef = useRef();
  const dropBoxRef = useRef();

  updateComponent = () => {
    setState(Date.now());
  };

  useEffect(() => {
    if (image !== "none") {
      previewRef.current.style.display = "block";
    }
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
      <img
        className="Preview-Image"
        src={image}
        alt="Preview"
        ref={previewRef}
      />
      <div
        className={`Drop-Box ${boxClass} ${messageClass}`}
        ref={dropBoxRef}
        onClick={openFileExplorer}
      >
        {fileInput}
        <div className={`Drop-Box-Message`}>
          <img src={imageIcon} alt="File icon" />
          <h2 className={`small`}>Click to upload image or drag it here</h2>
        </div>
      </div>
    </>
  );
};

export default DropBox;
