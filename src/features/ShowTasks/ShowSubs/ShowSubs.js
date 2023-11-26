import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getElementById } from "../ShowTasksSlice";

const ShowSubs = ({ index, subId }) => {
  const sub = useSelector((state) => getElementById(state, subId));
  const [editable, setEditable] = useState(false);
  const [subValue, setSubValue] = useState(sub.name);
  const deleteHandler = () => {};
  const editHandler = () => {};
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{sub.name}</td>
      <td>{sub.progress}%</td>
      <td>{sub.tasksNum}</td>
      <td>{sub.tasksDone}</td>
      <td>
        <div
          className={`d-flex gap-3 align-items-center justify-content-center w-100 `}
        >
          {!editable ? (
            <>
              <button
                onClick={() => {
                  setSubValue(sub.name);
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
                disabled={subValue === sub.name}
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

export default ShowSubs;
