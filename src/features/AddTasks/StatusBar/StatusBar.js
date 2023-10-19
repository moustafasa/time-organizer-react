import React, { useState } from "react";
import SelectBox from "../../../components/SelectBox/SelectBox";
import sass from "./StatusBar.module.scss";

const StatusBar = () => {
  const [selectValue, setSelectValue] = useState("");
  const options = [{ text: "test", value: "" }];
  return (
    <div className={sass.statusBar}>
      <ul className={sass.map}>
        <li className={sass.selectCont}>
          <label>head</label>
          <SelectBox
            options={options}
            valueState={[selectValue, setSelectValue]}
            className={sass.SelectBox}
          />
        </li>
        <li className={sass.selectCont}>
          <label>sub</label>
          <SelectBox
            options={options}
            valueState={[selectValue, setSelectValue]}
            className={sass.SelectBox}
          />
        </li>
        <li className={sass.selectCont}>
          <label>task</label>
          <SelectBox
            options={options}
            valueState={[selectValue, setSelectValue]}
            className={sass.SelectBox}
          />
        </li>
      </ul>
    </div>
  );
};

export default StatusBar;
