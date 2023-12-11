import React from "react";
import { useSelector } from "react-redux";
import { getRunTaskById } from "../RunningTasksSlice";

const Task = ({ id, index }) => {
  const task = useSelector((state) => getRunTaskById(state, id));
  console.log(task);
  return (
    <tr>
      <td>{index}</td>
      <td>{task.day}</td>
      <td>{task.name}</td>
      <td>{task.headName}</td>
      <td>{task.subName}</td>
      <td>{task.progress}</td>
      <td>{task.subTasksNum}</td>
      <td>{task.subTasksDone}</td>
      <td>
        <div className="d-flex gap-2 align-items-center justify-content-center">
          <button className="btn btn-danger text-capitalize d-block">
            delete
          </button>
          <button className="btn btn-primary text-capitalize d-block">
            start
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Task;
