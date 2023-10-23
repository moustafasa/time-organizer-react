import React from "react";

const InputBox = ({ type, label, value, setValue, className }) => {
  return (
    <div className={`input-box ${className}`}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default InputBox;
