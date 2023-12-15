import React from "react";
import sass from "./PopUp.module.scss";

const PopUp = ({ children }) => {
  return (
    <div className={sass.overlay}>
      <div className={sass.window}>{children}</div>
    </div>
  );
};

export default PopUp;
