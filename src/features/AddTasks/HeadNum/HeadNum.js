import React from "react";
import sass from "./HeadNum.module.scss";

const HeadNum = () => {
  return (
    <div className={sass.headNum + " input-box"}>
      <label>number of heads</label>
      <input type="number" />
      <button className="start" type="button">
        start
      </button>
    </div>
  );
};

export default HeadNum;
