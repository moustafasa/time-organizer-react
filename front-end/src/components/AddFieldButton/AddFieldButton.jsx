import React from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import sass from "./AddFieldButton.module.scss";

const AddFieldButton = ({ onClick, type, title }) => {
  return (
    <button
      className={`${sass["add-field-btn"]} ${sass[`${type}-btn`]}`}
      onClick={onClick}
      type="button"
      title={title}
    >
      {type === "plus" ? (
        <FaPlusCircle className={sass.icon} />
      ) : (
        <FaMinusCircle className={sass.icon} />
      )}
    </button>
  );
};

export default AddFieldButton;
