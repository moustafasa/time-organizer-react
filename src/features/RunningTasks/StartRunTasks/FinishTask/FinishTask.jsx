import React from "react";

const FinishTask = ({ task }) => {
  return (
    <div>
      <h3>{task.name}</h3>
      <label>subTasksDone</label>
      <input className="form-control" type="number" />
    </div>
  );
};

export default FinishTask;
