import React, { useEffect, useState } from "react";
import sass from "./PopUp.module.scss";
import EventEmiiter from "events";
import classNames from "classnames";

const emitter = new EventEmiiter();

export const show = ({ title, body, btn }) =>
  emitter.emit("show", { title, body, btn });

const PopUp = () => {
  const [show, setShow] = useState();
  const [options, setOptions] = useState({});

  const hideHandler = () => {
    setShow(false);
    setOptions({});
  };
  useEffect(() => {
    const showHandler = (obj) => {
      setShow(true);
      setOptions(obj);
    };
    emitter.on("show", showHandler);
    return () => {
      emitter.off("show", showHandler);
    };
  }, []);
  if (!show) return null;
  const modalClass = classNames(sass.overlay, "modal");
  return (
    <div className={modalClass} data-bs-theme="dark">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="title text-capitalize">{options.title}</h5>
            <button
              type="button"
              onClick={hideHandler}
              className="btn btn-close"
            ></button>
          </div>
          <div className="modal-body">{options.body}</div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={hideHandler}
              className="btn btn-secondary text-capitalize"
            >
              cancel
            </button>
            <button
              type="button"
              className={options.btn?.class}
              onClick={() => {
                options.btn?.handler();
                hideHandler();
              }}
            >
              {options.btn?.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
