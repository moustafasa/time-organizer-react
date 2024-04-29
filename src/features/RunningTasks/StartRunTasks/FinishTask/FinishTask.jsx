import React, { useEffect, useState } from "react";
import { modify } from "../../../../components/PopUp/PopUp";
import classNames from "classnames";

const FinishTask = ({ task }) => {
  const [subTasksDone, setSubTasksDone] = useState("0");
  const [valid, setValid] = useState(true);

  useEffect(() => {
    modify({ args: { subTasksDone: +subTasksDone, task: task.id, valid } });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTasksDone]);

  const inputClass = classNames({ "is-invalid": !valid }, "form-control");

  const inputHandler = (e) => {
    if (e.target.value > task.subTasksNum - task.subTasksDone) {
      setValid(false);
    } else {
      setValid(true);
    }
    setSubTasksDone(e.target.value);
  };

  return (
    <div>
      <div className="d-flex pb-3 flex-wrap gap-3 justify-content-around align-items-center border-bottom text-capitalize">
        <div className="text-center w-100 text-secondary-emphasis text-capitalize ">
          task Name: <span className="text-body fw-bold">{task.name}</span>
        </div>
        <div className="d-flex align-items-center gap-2 text-secondary-emphasis">
          subTasksNum :
          <span className="text-body fw-bold ">{task.subTasksNum}</span>
        </div>
        <div className="d-flex align-items-center gap-2 text-secondary-emphasis">
          subTasksDone :
          <span className="text-body fw-bold">{task.subTasksDone}</span>
        </div>
      </div>
      <div className="mt-4 text-capitalize mb-3 px-4">
        <label
          className="form-label text-secondary-emphasis"
          htmlFor="subTasksDone"
        >
          subTasksDone in this pomodoro :
        </label>
        <input
          className={inputClass}
          type="number"
          value={subTasksDone}
          min={0}
          onChange={inputHandler}
          id="subTasksDone"
        />
        <div className="invalid-feedback">
          the provided subTasksDone is more than the remaining subTasks
        </div>
      </div>
    </div>
  );
};

export default FinishTask;
