import { startTransition, useCallback, useEffect, useState } from "react";
import sass from "./RunTaskTimer.module.scss";
import classNames from "classnames";
import { formatTime } from "../../functions";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAnimState,
  changeCurrentPomodoro,
  changeIsBreak,
  getAnimState,
  getBreakTime,
  getCurrentPomodoro,
  getIsBreak,
  getPomodoroTime,
  getPomodorosNum,
} from "../../RunningTasksSlice";

const RunTasksTimer = () => {
  const desktopNotify = useCallback(async (text) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(text);
      }
    }
  }, []);

  // idle - played - paused - done
  const animState = useSelector(getAnimState);
  const pomodoroTime = useSelector((state) => getPomodoroTime(state) * 60);
  const currentPomodoro = useSelector(getCurrentPomodoro);
  const pomodorosNum = +useSelector(getPomodorosNum);
  const breakTime = useSelector((state) => getBreakTime(state) * 60);

  const [duration, setDuration] = useState(pomodoroTime);
  const [timer, setTimer] = useState(duration);
  const isBreak = useSelector(getIsBreak);
  const dispatch = useDispatch();
  const setAnimState = (value) => dispatch(changeAnimState(value));

  const svgClass = classNames(
    {
      [sass.start]: animState !== "idle",
    },
    { [sass.paused]: animState === "paused" },
    { [sass.done]: animState === "done" }
  );

  useEffect(() => {
    startTransition(() => Notification.requestPermission());
  }, []);

  useEffect(() => {
    let timeInterval;
    if (animState === "played") {
      timeInterval = window.setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else {
      clearInterval(timeInterval);
    }

    return () => {
      clearInterval(timeInterval);
    };
  }, [animState, timer]);

  useEffect(() => {
    setTimer(duration);
  }, [duration]);

  useEffect(() => {
    if (timer < 0) {
      if (currentPomodoro === pomodorosNum) {
        setAnimState("done");
        desktopNotify(
          `congratulations! you done all of pomodoros for this task`
        );
      } else {
        setAnimState("idle");
        if (isBreak) {
          const remainingPomodors = pomodorosNum - (currentPomodoro + 1);
          desktopNotify(
            `the break is finished let's start pomdoro number ${
              currentPomodoro + 1
            } ${
              remainingPomodors !== 0
                ? `only ${remainingPomodors} pomdoro is remaining`
                : `this is the last pomodoro`
            }`
          );
          dispatch(changeCurrentPomodoro(currentPomodoro + 1));
          setDuration(pomodoroTime);
        } else {
          desktopNotify(
            `you done ${currentPomodoro} / ${pomodorosNum} pomodoros let's take a break`
          );
          console.log("done");
          setDuration(breakTime);
        }
        dispatch(changeIsBreak(!isBreak));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  return (
    <div className="d-flex justify-content-center align-items-center flex-column gap-3">
      <div className="text-capitalize">
        <span>
          {isBreak
            ? `break ${currentPomodoro}`
            : `pomodoro ${currentPomodoro} / ${pomodorosNum}`}
        </span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={svgClass}
        width={200}
        height={200}
        style={{ "--duration": duration + "s" }}
      >
        <circle className={sass.progressBack} cx={100} cy={100} r={100} />
        <circle className={sass.progress} cx={100} cy={100} r={100} />
        <circle className={sass.flash} cx={100} cy={100} r={100} />
        <text
          className={sass.text}
          x={100}
          y={100}
          textAnchor="middle"
          dominantBaseline={"central"}
        >
          {animState === "done" ? "Congratulation !" : formatTime(timer)}
        </text>
      </svg>
      {animState === "idle" ? (
        <button
          className="btn btn-primary text-capitalize"
          onClick={(_) => setAnimState("played")}
        >
          start
        </button>
      ) : animState === "played" ? (
        <button
          className="btn btn-warning text-capitalize"
          onClick={(_) => setAnimState("paused")}
        >
          pause
        </button>
      ) : animState === "paused" ? (
        <button
          className="btn btn-info text-capitalize"
          onClick={(_) => setAnimState("played")}
        >
          resume
        </button>
      ) : null}
    </div>
  );
};

export default RunTasksTimer;
