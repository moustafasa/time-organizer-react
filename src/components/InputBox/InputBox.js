import React from "react";

const InputBox = ({ type, label, value, setValue }) => {
  return (
    <div className="input-box">
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
