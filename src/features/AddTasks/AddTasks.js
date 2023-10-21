import React from "react";
import sass from "./AddTasks.module.scss";
import HeadNum from "./HeadNum/HeadNum";
import StatusBar from "./StatusBar/StatusBar";
import { useSelector } from "react-redux";
import { getHeads } from "./AddTasksSlice";
import TaskInputs from "./TaskInputs/TaskInputs";

const AddTasks = () => {
  const numberOfHeads = useSelector(getHeads);
  return (
    <div className={sass.addTasks}>
      <div className={sass.container + " container"}>
        <h2 className="page-head"> setup your tasks </h2>
        <form className={sass.add} onSubmit={(e) => e.preventDefault()}>
          {numberOfHeads.length <= 0 ? (
            <HeadNum />
          ) : (
            <>
              <StatusBar />
              <TaskInputs />
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddTasks;
