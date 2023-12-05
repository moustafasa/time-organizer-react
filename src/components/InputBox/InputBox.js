import React from "react";

const InputBox = ({
  type,
  label,
  value,
  setValue,
  className,
  readOnly,
  name,
  required = true,
}) => {
  return (
    <div className={`input-box ${className}`}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        readOnly={readOnly}
        name={name}
        required={required}
      />
    </div>
  );
};

export default InputBox;
