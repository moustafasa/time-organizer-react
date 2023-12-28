import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAnimState,
  changeCurrentPomodoro,
  changeIsBreak,
  getAnimState,
  getPomodoroTime,
  useDidTaskMutation,
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

  const [didTask] = useDidTaskMutation();
  const finishHandler = (args, hideHandler) => {
    didTask({ id: args.task, subTasksDone: args.subTasksDone });
    hideHandler();
  };

  const finishedTaskDialoge = async () => {
    show({
      title: "finished",
      body: <FinishTask task={task} />,
      btn: {
        jsx: (hideHandler, args) => (
          <button
            className="btn btn-primary text-capitalize"
            onClick={() => finishHandler(args, hideHandler)}
            disabled={args.subTasksDone <= 0}
          >
            done
          </button>
        ),
      },
    });
  };

  return runTaskDialoge;
};

export default useStartTask;
