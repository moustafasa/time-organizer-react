import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteItem, getElementById, updateItem } from "../ShowTasksSlice";
import sass from "./ShowHeads.module.scss";

const ShowHeads = ({ headId, index, checkHandler, checked }) => {
  const head = useSelector((state) => getElementById(state, headId));
  const [editable, setEditable] = useState(false);
  const [headValue, setHeadValue] = useState(head.name);
  const dispatch = useDispatch();
  const editHandler = () => {
    dispatch(updateItem({ id: headId, update: { name: headValue } }));
    setEditable(false);
  };

  const deleteHandler = () => {
    dispatch(deleteItem(headId));
  };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          value={headId}
          checked={checked}
          onChange={checkHandler}
        />
      </td>
      <td>{index + 1}</td>
      <td>
        {!editable ? (
          head.name
        ) : (
          <input
            type="text"
            className="form-control text-center text-capitalize"
            data-bs-theme="dark"
            value={headValue}
            onChange={(e) => setHeadValue(e.target.value)}
          />
        )}
      </td>
      <td>{head.progress}%</td>
      <td>{head.subNum}</td>
      <td>{head.subDone}</td>
      <td>{head.tasksNum}</td>
      <td>{head.tasksDone}</td>
      <td>
        <div
          className={`d-flex gap-3 align-items-center justify-content-center w-100 ${sass.buttonCont}`}
        >
          {!editable ? (
            <>
              <button
                onClick={() => {
                  setHeadValue(head.name);
                  setEditable(true);
                }}
                className="btn btn-success text-capitalize d-block "
              >
                edit
              </button>
              <button
                className="btn btn-danger text-capitalize d-block"
                onClick={deleteHandler}
              >
                delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={editHandler}
                className={`btn btn-primary text-capitalize d-block`}
                disabled={headValue === head.name}
              >
                save
              </button>
              <button
                onClick={() => setEditable(false)}
                className="btn btn-secondary text-capitalize d-block"
              >
                cancel
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ShowHeads;
