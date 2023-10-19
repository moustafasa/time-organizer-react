import React from "react";
import sass from "./AddTasks.module.scss";
import HeadNum from "./HeadNum/HeadNum";
import StatusBar from "./StatusBar/StatusBar";
import { useSelector } from "react-redux";
import { getNumberOfTasks } from "./AddTasksSlice";
import TaskInputs from "./TaskInputs/TaskInputs";

const AddTasks = () => {
  const numberOfTasks = useSelector(getNumberOfTasks);
  return (
    <div className={sass.addTasks}>
      <div className={sass.container + " container"}>
        <h2 className="page-head"> setup your tasks </h2>
        <form className={sass.add} onSubmit={(e) => e.preventDefault()}>
          {!numberOfTasks || numberOfTasks <= 0 ? (
            <HeadNum />
          ) : (
            <>
              <StatusBar />
              <div className="tasks">
                <TaskInputs />
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddTasks;
