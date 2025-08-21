import { Form } from "react-bootstrap";
import scss from "./InputBox.module.scss";

import { forwardRef } from "react";

const InputBox = forwardRef(
  (
    { label, setValue, className, controlId, error, validate, ...others },
    ref
  ) => {
    const onChange = (e) => setValue(e.target.value);
    return (
      <Form.Group
        controlId={controlId}
        className={`${scss.InputBox} ${className} d-flex flex-column input-box`}
      >
        <Form.Label>{label}</Form.Label>
        <Form.Control ref={ref} {...(setValue && { onChange })} {...others} />
        {validate && (
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        )}
      </Form.Group>
    );
  }
);

export default InputBox;
