import React, { useEffect, useState } from "react";
import sass from "./PopUp.module.scss";
import EventEmiiter from "events";
import classNames from "classnames";
import { Button, Modal } from "react-bootstrap";

const emitter = new EventEmiiter();

export const show = ({ title, body, btn, backdrop, black = false }) =>
  emitter.emit("show", { title, body, btn, black, backdrop });

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
      console.log(obj);
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
  const overlay = classNames(sass.overlay, {
    [sass.black]: options.black,
  });

  return (
    <Modal
      show={show}
      onHide={hideHandler}
      data-bs-theme="dark"
      style={{ zIndex: 5000 }}
      backdrop={options.backdrop}
      backdropClassName={overlay}
    >
      <Modal.Header closeButton>
        <h5 className="title text-capitalize">{options.title}</h5>
      </Modal.Header>
      <Modal.Body>{options.body}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          type="button"
          onClick={hideHandler}
          className="text-capitalize"
        >
          cancel
        </Button>
        {options.btn?.jsx ? (
          options.btn.jsx(hideHandler, options.args || {})
        ) : (
          <Button
            type="button"
            className={options.btn?.className}
            onClick={() => {
              hideHandler();
              options.btn?.handler();
            }}
            disabled={options.btn.disabled}
          >
            {options.btn?.name}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PopUp;
