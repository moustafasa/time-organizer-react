import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTasksToRemote,
  changeNumberOfHeads,
  getHeads,
} from "../AddTasksSlice";

import "./Inputs.scss";

import HeadInput from "./Head/HeadInput";
import { Form, useLoaderData, useSearchParams } from "react-router-dom";

const Inputs = () => {
  const heads = useSelector(getHeads);
  const { headId } = useLoaderData();
  const dispatch = useDispatch();
  return (
    <Form method="post" className={"inputs"}>
      {heads.map((headId, index) => (
        <HeadInput key={headId} id={headId} index={index + 1} />
      ))}

      {!headId && (
        <button
          className="input-modify-btn plus-btn"
          onClick={(e) => dispatch(changeNumberOfHeads(1))}
          style={{ marginTop: "50px" }}
          type="button"
        >
          +
        </button>
      )}

      <button className="submit-button" type="submit">
        add
      </button>
    </Form>
  );
};

export default Inputs;
