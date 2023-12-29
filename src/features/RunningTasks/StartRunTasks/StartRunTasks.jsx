import React from "react";
import { show } from "../../../components/PopUp/PopUp";
import RunTasksTimer from "./RunTasksTimer/RunTasksTimer";
import FinishTask from "./FinishTask/FinishTask";
import SelectBox from "../../../components/SelectBox/SelectBox";
import sass from "./StartRunTasks.module.scss";
import { useSearchParams } from "react-router-dom";
import {
  changeBreakTime,
  changePomodoroTime,
  changePomodorosNum,
  getBreakTime,
  getPomodoroTime,
  getPomodorosNum,
  getRunTaskById,
  getRunTasksIds,
  getRunTasksOptions,
  useGetRunningTasksQuery,
} from "../RunningTasksSlice";
import { useDispatch, useSelector } from "react-redux";
import useStartTask from "../../../customHooks/useStartTask/useStartTask";

const StartRunTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pomodorosNum = useSelector(getPomodorosNum);
  const pomodoroTime = useSelector(getPomodoroTime);
  const breakTime = useSelector(getBreakTime);

  const taskId = searchParams.get("taskId") || "";
  const setTaskId = (taskId) => setSearchParams({ taskId });
  const currentDay = new Date().toDateString();

  const dispatch = useDispatch();

  const { tasks, currentTask } = useGetRunningTasksQuery(currentDay, {
    selectFromResult: ({ data, ...rest }) => ({
      tasks: getRunTasksOptions(data),
      currentTask: getRunTaskById(data, taskId),
      ...rest,
    }),
  });

  const startTask = useStartTask(currentTask);

  return (
    <section className={sass.startRunTasks}>
      <div className="container">
        <h2 className="page-head">start task</h2>
        <div className="mt-5 px-3">
          <label className="text-nowrap form-label text-capitalize">
            task :
          </label>
          <SelectBox options={tasks} valueState={[taskId, setTaskId]} />
        </div>
        <div className="mt-4 px-3">
          <label className="text-nowrap form-label text-capitalize">
            number of pomodoros :
          </label>
          <input
            type="number"
            data-bs-theme={"dark"}
            className="w-100 text-left"
            min={0}
            value={pomodorosNum}
            onChange={(e) => dispatch(changePomodorosNum(e.target.value))}
          />
        </div>
        <div className="mt-4 px-3">
          <label className="text-nowrap form-label text-capitalize">
            duration of pomodoro ( in minutes ) :
          </label>
          <input
            type="number"
            data-bs-theme={"dark"}
            className="w-100 text-left"
            min={0}
            value={pomodoroTime}
            onChange={(e) => dispatch(changePomodoroTime(e.target.value))}
          />
        </div>
        <div className="mt-4 px-3">
          <label className="text-nowrap form-label text-capitalize">
            duration of break ( in minutes ) :
          </label>
          <input
            type="number"
            data-bs-theme={"dark"}
            className="w-100 text-left"
            min={0}
            value={breakTime}
            onChange={(e) => dispatch(changeBreakTime(e.target.value))}
          />
        </div>
        <button
          className="btn btn-primary mt-5 d-block mx-auto text-capitalize w-50"
          onClick={startTask}
        >
          start
        </button>
      </div>
    </section>
  );
};

export default StartRunTasks;
