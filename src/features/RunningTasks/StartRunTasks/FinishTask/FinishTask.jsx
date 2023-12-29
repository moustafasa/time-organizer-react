import React, { useEffect, useState } from "react";
import { modify } from "../../../../components/PopUp/PopUp";
import { useDidTaskMutation } from "../../RunningTasksSlice";

const FinishTask = ({ task }) => {
  const [subTasksDone, setSubTasksDone] = useState("0");
  const [, { error, isError }] = useDidTaskMutation({
    fixedCacheKey: "didTask",
  });

  useEffect(() => {
    modify({ args: { subTasksDone: +subTasksDone, task: task.id } });
  }, [subTasksDone]);

  return (
    <div>
      <h3>{task.name}</h3>
      <div>subTasksNum : {task.subTasksNum}</div>
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
