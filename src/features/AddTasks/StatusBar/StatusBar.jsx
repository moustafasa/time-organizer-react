import React from "react";
import sass from "./StatusBar.module.scss";
import { shallowEqual, useSelector } from "react-redux";
import {
  changeCurrentHead,
  changeCurrentSub,
  changeCurrentTask,
  getCurrentHead,
  getCurrentSub,
  getCurrentTask,
  getHeadsEntities,
  getSubsEntitiesOfHead,
  getTasksEntitiesOfSub,
} from "../AddTasksSlice";
import StatusSelect from "./StatusSelect";

const StatusBar = () => {
  const heads = useSelector(getHeadsEntities);
  const currentHead = useSelector(getCurrentHead, shallowEqual);
  const subs = useSelector(
    (state) => getSubsEntitiesOfHead(state, currentHead),
    shallowEqual
  );
  const currentSub = useSelector(getCurrentSub);
  const tasks = useSelector(
    (state) => getTasksEntitiesOfSub(state, currentSub),
    shallowEqual
  );
  const currentTask = useSelector(getCurrentTask);

  return (
    <div className={sass.statusBar}>
      <ul className={sass.map}>
        <StatusSelect
          entities={heads}
          currentEntity={currentHead}
          changeEntity={changeCurrentHead}
          label="head"
          sass={sass}
        />
        <StatusSelect
          entities={subs}
          currentEntity={currentSub}
          changeEntity={changeCurrentSub}
          label="sub"
          sass={sass}
        />
        <StatusSelect
          entities={tasks}
          currentEntity={currentTask}
          changeEntity={changeCurrentTask}
          label="task"
          sass={sass}
        />
      </ul>
    </div>
  );
};

export default StatusBar;
