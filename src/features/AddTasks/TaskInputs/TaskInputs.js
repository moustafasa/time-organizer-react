import React, { useState } from "react";
import InputBox from "../../../components/InputBox/InputBox";

const Tasks = () => {
  const [taskName, setTaskName] = useState("");
  const [taskNum, setTaskNum] = useState(0);

  return (
    <div className="task">
      <InputBox
        label="task 1"
        type="text"
        value={taskName}
        setValue={setTaskName}
      />
      <InputBox
        label="subTasksNum"
        type="number"
        value={taskNum}
        setValue={setTaskNum}
      />
    </div>
  );
};

const Sub = () => {
  const [subName, setSubName] = useState("");
  return (
    <div className="sub">
      <InputBox
        label="sub 1"
        type="text"
        value={subName}
        setValue={setSubName}
      />
      <div className="tasks">
        <Tasks />
      </div>
    </div>
  );
};

const Head = () => {
  const [headName, setHeadName] = useState("");

  return (
    <div className="head">
      <InputBox
        label="head 1"
        type="text"
        value={headName}
        setValue={setHeadName}
      />
      <div className="subjects">
        <Sub />
      </div>
    </div>
  );
};

const TaskInputs = () => {
  return <Head />;
};

export default TaskInputs;
