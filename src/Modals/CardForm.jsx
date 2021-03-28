/**
 * Card Form for new and existing cards
 */
import React from "react";
import "./CardForm.css";

// components
import Button from "shared/Button";
import DropBox from "shared/DropBox";

// logic
import { _gc } from "logic/gc";

let formTitle,
  formDesc = "";
let titleInput, descInput;
const handleTitleChange = (event) => {
  titleInput = event.currentTarget;
  formTitle = titleInput.value;
};
const handleDescChange = (event) => {
  descInput = event.currentTarget;
  formDesc = descInput.value;
};

_gc.taskForm = {
  image: "none",
};

const CardForm = ({
  index,
  title = "",
  desc = "",
  image,
  column,
  stamp,
  close,
}) => {
  formTitle = title;
  formDesc = desc;

  const handleCancel = () => {
    close();
  };

  const handleSave = () => {
    if (index >= 0) {
      let card = _gc[column].cards[index];
      card.title = formTitle;
      card.desc = formDesc;
      card.image = _gc.taskForm.image === 'none' ? image : _gc.taskForm.image;
    } else {
      _gc[column].cards.push({
        stamp,
        column,
        title: formTitle,
        desc: formDesc,
        image: _gc.taskForm.image,
      });
    }

    _gc.taskForm.image = 'none';
    close();
  };

  return (
    <div className={`Task-Form-Container`}>
      <div className={`Task-Form`}>
        <h3>Title</h3>
        <input
          type="text"
          onChange={handleTitleChange}
          defaultValue={formTitle}
        ></input>
        <h3>Description</h3>
        <textarea
          onChange={handleDescChange}
          defaultValue={formDesc}
        ></textarea>
        {/* <DropBox image={image} /> */}
        <div className="Buttons-Wrapper">
          <Button text="Save" clicked={handleSave} />
          <Button text="Cancel" clicked={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default CardForm;
