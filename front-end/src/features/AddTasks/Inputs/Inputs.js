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
import AddFieldButton from "../../../components/AddFieldButton/AddFieldButton";

const Inputs = () => {
  const headsIds = useSelector(getHeads);
  const { headId } = useLoaderData();
  const [addAll] = useAddAllMutation();
  const dispatch = useDispatch();

  return (
    <Form onSubmit={addAll} method="post" className={"inputs"}>
      {headsIds.map((headId, index) => (
        <HeadInput key={headId} id={headId} index={index + 1} />
      ))}

      {!headId && (
        <div style={{ marginTop: "50px" }}>
          <AddFieldButton
            onClick={(e) => dispatch(changeNumberOfHeads(1))}
            type="plus"
          />
        </div>
      )}

      <button className="submit-button" type="submit">
        add
      </button>
    </Form>
  );
};

export default Inputs;
