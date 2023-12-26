import React, { useEffect, useState } from "react";
import { modify } from "../../../../components/PopUp/PopUp";

const FinishTask = ({ task }) => {
  const [subTasksDone, setSubTasksDone] = useState("0");

  useEffect(() => {
    modify({ args: { subTasksDone: +subTasksDone, task } });
  }, [subTasksDone]);

  return (
    <div>
      <h3>{task.name}</h3>
      <label>subTasksDone</label>
      <input
        className="form-control"
        type="number"
        value={subTasksDone}
        min={0}
        onChange={(e) => setSubTasksDone(e.target.value)}
      />
    </div>
  );
};

export default FinishTask;
