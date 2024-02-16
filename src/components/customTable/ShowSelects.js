import React from "react";
import SelectBox from "../SelectBox/SelectBox";

const ShowSelects = ({
  label,
  options,
  handler: [selectValue, setSelectValue],
  name,
}) => {
  return (
    <div
      className={`d-flex gap-3 px-3 mt-5 align-items-center flex-grow-1  flex-sm-nowrap flex-wrap`}
    >
      <label>{label}</label>
      <SelectBox
        options={options}
        valueState={[selectValue, setSelectValue]}
        name={name}
      />
    </div>
  );
};

export default ShowSelects;
