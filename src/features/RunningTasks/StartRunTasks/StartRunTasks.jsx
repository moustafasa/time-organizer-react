import React from "react";
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
  useGetRunningTasksQuery,
} from "../RunningTasksSlice";
import { useDispatch, useSelector } from "react-redux";
import useStartTask from "../../../customHooks/useStartTask/useStartTask";
import InputBox from "../../../components/InputBox/InputBox";

const StartRunTasks = () => {
  const [searchParams] = useSearchParams();

  const pomodorosNum = useSelector(getPomodorosNum);
  const pomodoroTime = useSelector(getPomodoroTime);
  const breakTime = useSelector(getBreakTime);

  const taskId = searchParams.get("taskId") || "";
  const currentDay = new Date().toDateString();

  const dispatch = useDispatch();

  const { currentTask = {} } = useGetRunningTasksQuery(currentDay, {
    selectFromResult: ({ data, ...rest }) => ({
      currentTask: getRunTaskById(data, taskId),
      ...rest,
    }),
  });

  const startTask = useStartTask(currentTask);

  return (
    <section className={sass.startRunTasks}>
      <div className="container">
        <h2 className="page-head">start {currentTask.name} task</h2>
        <div className="m-auto" style={{ maxWidth: "600px" }}>
          <InputBox
            label={"number of pomodoros :"}
            className={"align-items-start mt-5 px-3"}
            type="number"
            min={0}
            value={pomodorosNum}
            onChange={(e) => dispatch(changePomodorosNum(e.target.value))}
            controlId={"pomNum"}
          />
          <InputBox
            label={"duration of pomodoro ( in minutes ) :"}
            className={"align-items-start mt-4 px-3 "}
            type="number"
            min={0}
            value={pomodoroTime}
            onChange={(e) => dispatch(changePomodoroTime(e.target.value))}
            controlId={"durOfPum"}
          />

          <InputBox
            label={"duration of break ( in minutes ) :"}
            className={"align-items-start mt-4 px-3"}
            type="number"
            min={0}
            value={breakTime}
            onChange={(e) => dispatch(changeBreakTime(e.target.value))}
            controlId={"durOfBreak"}
          />

          <button
            className="btn btn-primary mt-5 d-block mx-auto text-capitalize w-50"
            onClick={startTask}
            disabled={!taskId}
          >
            start
          </button>
        </div>
      </div>
    </section>
  );
};

export default StartRunTasks;
