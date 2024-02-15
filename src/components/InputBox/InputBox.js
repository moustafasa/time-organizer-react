import React from "react";
import { Form } from "react-bootstrap";
import scss from "./InputBox.module.scss";

const InputBox = ({
  label,
  setValue,
  className,
  controlId,
  error,
  validate,
  ...others
}) => {
  const onChange = (e) => setValue(e.target.value);
  return (
    <Form.Group
      controlId={controlId}
      className={`${scss.InputBox} ${className} d-flex flex-column input-box`}
    >
      <Form.Label>{label}</Form.Label>
      <Form.Control {...(setValue && { onChange })} {...others} />
      {validate && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default InputBox;
