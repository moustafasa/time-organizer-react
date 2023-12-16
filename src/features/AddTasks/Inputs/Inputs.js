import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeNumberOfHeads,
  getHeads,
  useAddAllMutation,
} from "../AddTasksSlice";

import "./Inputs.scss";

import HeadInput from "./Head/HeadInput";
import { Form, useLoaderData } from "react-router-dom";

const Inputs = () => {
  const headsIds = useSelector(getHeads);
  const { headId } = useLoaderData();
  const [addAll, { isLoading, isError, error }] = useAddAllMutation();
  const dispatch = useDispatch();

  return (
    <Form onSubmit={addAll} method="post" className={"inputs"}>
      {headsIds.map((headId, index) => (
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
