import React, { useState } from "react";
import sass from "./HeadNum.module.scss";
import { useDispatch } from "react-redux";
import { changeNumberOfHeads } from "../AddTasksSlice";
import InputBox from "../../../components/InputBox/InputBox";

const HeadNum = () => {
  const [NumberOfHeads, setNumberOfHeads] = useState(0);
  const dispatch = useDispatch();
  return (
    <div className={sass.headNum + " input-box"}>
      <InputBox
        type="number"
        label="number of heads"
        value={NumberOfHeads}
        setValue={setNumberOfHeads}
      />
      <button
        className="start"
        onClick={(e) => {
          dispatch(changeNumberOfHeads(+NumberOfHeads));
        }}
        type="button"
      >
        start
      </button>
    </div>
  );
};

export default HeadNum;
