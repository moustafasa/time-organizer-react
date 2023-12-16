import React from "react";
import { useSelector } from "react-redux";
import {
  fetchRunTasks,
  getRunTasksIds,
  useGetRunningTasksQuery,
} from "./RunningTasksSlice";
import Task from "./Task/Task";
import { useParams } from "react-router-dom";

const RunningTasks = () => {
  const { page } = useParams();
  const { data: runTasks } = useGetRunningTasksQuery(page, {
    selectFromResult: ({ data, ...rest }) => ({
      data: getRunTasksIds(data),
      ...rest,
    }),
  });

  return (
    <section>
      <div className="container">
        <h2 className="page-head">running tasks</h2>
        <div className="table-responsive mt-5 px-3">
          <table
            className="table text-capitalize align-middle text-center"
            data-bs-theme="dark"
          >
            <thead>
              <tr>
                <th>id</th>
                <th>day</th>
                <th>taskName</th>
                <th>headName</th>
                <th>subName</th>
                <th>progress</th>
                <th>subTasksNum</th>
                <th>subTasksDone</th>
                <th>options</th>
              </tr>
            </thead>
            <tbody>
              {runTasks.map((task, ind) => (
                <Task key={task} id={task} index={ind + 1} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default RunningTasks;
