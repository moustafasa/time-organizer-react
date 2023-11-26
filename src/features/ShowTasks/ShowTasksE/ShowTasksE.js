import React from "react";
import { useSelector } from "react-redux";
import { getElementById } from "../ShowTasksSlice";

const ShowTasksE = ({ index, taskId }) => {
  const task = useSelector((state) => getElementById(state, taskId));
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{task.name}</td>
      <td>{task.progress}%</td>
      <td>{task.subTasksNum}</td>
      <td>{task.subTasksDone}</td>
    </tr>
  );
};

export default ShowTasksE;
