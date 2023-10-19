import React, { useState } from "react";
import sass from "./HeadNum.module.scss";
import { useDispatch } from "react-redux";
import { changeNumberOfTasks } from "../AddTasksSlice";
import InputBox from "../../../components/InputBox/InputBox";

const HeadNum = () => {
  const [numberOfTasks, setNumberOfTasks] = useState(0);
  const dispatch = useDispatch();
  return (
    <div className={sass.headNum + " input-box"}>
      <InputBox
        type="number"
        label="number of heads"
        value={numberOfTasks}
        setValue={setNumberOfTasks}
      />
      <button
        className="start"
        onClick={(e) => {
          dispatch(changeNumberOfTasks(numberOfTasks));
        }}
        type="button"
      >
        start
      </button>
    </div>
  );
};

export default HeadNum;
