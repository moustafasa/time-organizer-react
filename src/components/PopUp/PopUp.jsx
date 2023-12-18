import React from "react";
import sass from "./PopUp.module.scss";

const PopUp = ({ title, body, footer }) => {
  return (
    <div className="modal" data-bs-theme="dark" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button className="btn-close" type="button"></button>
          </div>
          <div className="modal-body">{body}</div>
          <div className="modal-footer">{footer}</div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
