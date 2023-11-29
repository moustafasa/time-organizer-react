import React from "react";

const InputBox = ({ type, label, value, setValue, className, readOnly }) => {
  return (
    <div className={`input-box ${className}`}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  );
};

export default InputBox;
