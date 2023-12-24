import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAnimState,
  changeCurrentPomodoro,
  changeIsBreak,
  getAnimState,
  getPomodoroTime,
} from "../../features/RunningTasks/RunningTasksSlice";
import { useGetDataQuery } from "../../features/ShowTasks/ShowTasksSlice";
import { useSearchParams } from "react-router-dom";
import { modify, show } from "../../components/PopUp/PopUp";
import RunTasksTimer from "../../features/RunningTasks/StartRunTasks/RunTasksTimer/RunTasksTimer";
import FinishTask from "../../features/RunningTasks/StartRunTasks/FinishTask/FinishTask";

const useStartTask = (task) => {
  const dispatch = useDispatch();
  const animState = useSelector(getAnimState);

  useEffect(() => {
    modify({ disabled: animState !== "done", black: animState === "played" });
  }, [animState]);

  const runTaskDialoge = () => {
    dispatch(changeAnimState("idle"));
    dispatch(changeCurrentPomodoro(1));
    dispatch(changeIsBreak(false));
    console.log("done");
    show({
      title: `start ${task.name} task`,
      body: <RunTasksTimer />,
      btn: {
        name: "finish",
        className: "btn btn-success text-capitalize",
        handler: finishedTaskDialoge,
        disabled: true,
      },
    });
  };

  const finishedTaskDialoge = async () => {
    console.log(this);
    show({
      title: "finished",
      body: <FinishTask task={task} />,
      btn: {
        name: "done",
        className: "btn btn-primary text-capitalize",
        handler: () => {},
      },
    });
  };

  return runTaskDialoge;
};

export default useStartTask;
