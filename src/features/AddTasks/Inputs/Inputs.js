import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTasksToRemote,
  changeNumberOfHeads,
  getHeads,
} from "../AddTasksSlice";

import "./Inputs.scss";

import HeadInput from "./Head/HeadInput";

const Inputs = () => {
  const heads = useSelector(getHeads);
  const dispatch = useDispatch();
  return (
    <div className={"inputs"}>
      {heads.map((headId, index) => (
        <HeadInput key={headId} id={headId} index={index + 1} />
      ))}
      <button
        className="input-modify-btn plus-btn"
        onClick={(e) => dispatch(changeNumberOfHeads(1))}
        style={{ marginTop: "50px" }}
      >
        +
      </button>

      <button
        className="submit-button"
        onClick={(e) => {
          console.log("sdlkds");
          dispatch(addTasksToRemote());
        }}
      >
        add
      </button>
    </div>
  );
};

export default Inputs;
