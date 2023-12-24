import React, { useEffect, useState } from "react";
import sass from "./RunTaskTimer.module.scss";
import classNames from "classnames";
import { formatTime } from "../../functions";

const RunTasksTimer = () => {
  // idle - played - paused - done
  const [animState, setAnimState] = useState("idle");
  const dur = 100;
  const [timer, setTimer] = useState(dur);

  const svgClass = classNames(
    {
      [sass.start]: animState !== "idle",
    },
    { [sass.paused]: animState === "paused" },
    { [sass.done]: animState === "done" }
  );

  useEffect(() => {
    let timeInterval;
    if (animState === "played") {
      timeInterval = window.setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else {
      clearInterval(timeInterval);
    }

    if (timer === 0) {
      setAnimState("done");
    }

    return () => {
      clearInterval(timeInterval);
    };
  }, [animState, timer]);

  return (
    <div className="d-flex justify-content-center align-items-center flex-column gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={svgClass}
        width={200}
        height={200}
        style={{ "--duration": dur + "s" }}
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
