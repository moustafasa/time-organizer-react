import React, { useState } from "react";
import SelectBox from "../../../components/SelectBox/SelectBox";

const StatusBar = () => {
  const [selectValue, setSelectValue] = useState("");
  const options = [{ text: "test", value: "" }];
  return (
    <div className="status-bar">
      <ul className="map">
        <li className="select-box">
          <label>head</label>
          <SelectBox
            options={options}
            valueState={[selectValue, setSelectValue]}
          />
        </li>
        <li className="select-box">
          <label>sub</label>
          <SelectBox
            options={options}
            valueState={[selectValue, setSelectValue]}
          />
        </li>
        <li className="select-box">
          <label>task</label>
          <SelectBox
            options={options}
            valueState={[selectValue, setSelectValue]}
          />
        </li>
      </ul>
    </div>
  );
};

export default StatusBar;
