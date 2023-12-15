import React from "react";
import { useSelector } from "react-redux";
import {
  getRunTaskById,
  getRunTasksIds,
  useDeleteFromRunTasksMutation,
  useGetRunningTasksQuery,
} from "../RunningTasksSlice";
import { useParams } from "react-router-dom";

const Task = ({ id, index }) => {
  const { page } = useParams();
  const { data: task } = useGetRunningTasksQuery(page, {
    selectFromResult: ({ data, ...rest }) => ({
      data: getRunTaskById(data, id),
      ...rest,
    }),
  });

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const date = new Date(task.day);

  const [deleteTask] = useDeleteFromRunTasksMutation();

  return (
    <tr>
      <td>{index}</td>
      <td>{days[date.getDay()]}</td>
      <td>{task.name}</td>
      <td>{task.headName}</td>
      <td>{task.subName}</td>
      <td>{task.progress}</td>
      <td>{task.subTasksNum}</td>
      <td>{task.subTasksDone}</td>
      <td>
        <div className="d-flex gap-2 align-items-center justify-content-center">
          <button
            className="btn btn-danger text-capitalize d-block"
            onClick={(e) => deleteTask(id)}
          >
            delete
          </button>
          {date.getDay() === new Date().getDay() && (
            <button className="btn btn-primary text-capitalize d-block">
              start
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default Task;
