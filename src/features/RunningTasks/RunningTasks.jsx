import React, { useEffect, useState } from "react";
import {
  changeCurrentDay,
  getCurrentDay,
  getRunTasksIds,
  useGetRunningTasksQuery,
} from "./RunningTasksSlice";
import Task from "./Task/Task";
import {
  useLoaderData,
  useParams,
  useRouteLoaderData,
  useSearchParams,
} from "react-router-dom";
import { getOptionsOfWeekDays } from "./functions";
import SelectBox from "../../components/SelectBox/SelectBox";
import { useDispatch, useSelector } from "react-redux";

export const loader = () => {
  return {
    weekDays: getOptionsOfWeekDays(),
  };
};

const RunningTasks = () => {
  const { weekDays } = useRouteLoaderData("runningTasks");
  const [checkedItems, setCheckedItems] = useState([]);
  const dayValue = useSelector(getCurrentDay);
  const dispatch = useDispatch();
  const setDayValue = (value) => dispatch(changeCurrentDay(value));
  const { data: runTasks } = useGetRunningTasksQuery(dayValue, {
    selectFromResult: ({ data, ...rest }) => ({
      data: getRunTasksIds(data),
      ...rest,
    }),
  });

  useEffect(() => {
    const unCheckOnBlurHandler = (e) => {
      if (!e.target.closest("table") && !e.target.closest("button")) {
        setCheckedItems([]);
      }
    };
    document.addEventListener("click", unCheckOnBlurHandler);
    return () => {
      document.removeEventListener("click", unCheckOnBlurHandler);
    };
  }, []);

  return (
    <section>
      <div className="container">
        <h2 className="page-head">running tasks</h2>
        <div className="mt-5 d-flex gap-4 align-items-center px-3">
          <label className="text-nowrap">Showed Day : </label>
          <SelectBox
            options={[{ text: "all", value: "" }, ...weekDays]}
            valueState={[dayValue, setDayValue]}
            className="flex-grow-1"
          />
        </div>
        <div className="table-cont">
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>id</th>
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
                <Task
                  key={task}
                  id={task}
                  index={ind + 1}
                  checked={[checkedItems, setCheckedItems]}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-4">
          <button className="btn btn-primary">add</button>
        </div>
      </div>
    </section>
  );
};

export default RunningTasks;
