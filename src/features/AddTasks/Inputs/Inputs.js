import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTasksToRemote,
  changeNumberOfHeads,
  getHeads,
  getHeadsEntities,
  getSubsEntities,
  getTasksEntities,
} from "../AddTasksSlice";

import "./Inputs.scss";

import HeadInput from "./Head/HeadInput";
import { Form, useLoaderData, useSearchParams } from "react-router-dom";
import { useAddAllMutation } from "../../api/apiSlice";

const Inputs = () => {
  const headsIds = useSelector(getHeads);
  const { headId } = useLoaderData();
  // const heads = useSelector(getHeadsEntities);
  // const subs = useSelector(getSubsEntities);
  // const tasks = useSelector(getTasksEntities);
  // const [addAll, { isLoading }] = useAddAllMutation();
  const dispatch = useDispatch();

  return (
    <Form method="post" className={"inputs"}>
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
