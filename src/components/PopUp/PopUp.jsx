import React, { useEffect, useState } from "react";
import sass from "./PopUp.module.scss";
import EventEmiiter from "events";
import classNames from "classnames";
import { useSelector } from "react-redux";

const emitter = new EventEmiiter();

export const show = ({ title, body, btn, black = false }) =>
  emitter.emit("show", { title, body, btn, black });

export const modify = ({ black, disabled, args }) =>
  emitter.emit("modify", { black, disabled, args });

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
    const modifyHandler = (obj) => {
      setOptions((opts) => ({
        ...opts,
        black: obj.black,
        args: obj.args,
        btn: { ...opts.btn, disabled: obj.disabled },
      }));
    };
    emitter.on("show", showHandler);
    emitter.on("modify", modifyHandler);

    return () => {
      emitter.off("show", showHandler);
      emitter.off("modify", modifyHandler);
    };
  }, []);

  if (!show) return null;
  const modalClass = classNames(sass.overlay, "modal", {
    [sass.black]: options.black,
  });

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
            {options.btn?.jsx ? (
              options.btn.jsx(hideHandler, options.args || {})
            ) : (
              <button
                type="button"
                className={options.btn?.className}
                onClick={() => {
                  hideHandler();
                  options.btn?.handler();
                }}
                disabled={options.btn.disabled}
              >
                {options.btn?.name}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
