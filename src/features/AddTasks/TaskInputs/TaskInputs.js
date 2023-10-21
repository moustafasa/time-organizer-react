import React, { useState } from "react";
import InputBox from "../../../components/InputBox/InputBox";
import { useDispatch, useSelector } from "react-redux";
import {
  changeNumberOfHeads,
  getHeadById,
  getHeads,
  getNumberOfTasks,
  getSubById,
  getSubs,
  getTaskById,
  getTasks,
  updateHead,
  updateSub,
  updateTask,
} from "../AddTasksSlice";

import sass from "./TaskInputs.module.scss";

const Tasks = ({ id }) => {
  const task = useSelector((state) => getTaskById(state, id));
  const dispatch = useDispatch();
  const setTaskName = (value) =>
    dispatch(updateTask({ id, changes: { name: value } }));
  const setSubTasksNum = (value) =>
    dispatch(updateTask({ id, changes: { subTasksNum: value } }));
  const setSubTasksDone = (value) =>
    dispatch(updateTask({ id, changes: { subTasksDone: value } }));

  return (
    <div className="task">
      <InputBox
        label="task 1"
        type="text"
        value={task.name}
        setValue={setTaskName}
      />
      <InputBox
        label="subTasksNum"
        type="number"
        value={task.subTasksNum}
        setValue={setSubTasksNum}
      />
      <InputBox
        label="subTasksDone"
        type="number"
        value={task.subTasksDone}
        setValue={setSubTasksDone}
      />
    </div>
  );
};

const Sub = ({ id }) => {
  const subName = useSelector((state) => getSubById(state, id).name);
  const dispatch = useDispatch();
  const setSubName = (value) =>
    dispatch(updateSub({ id, changes: { name: value } }));

  const allTasks = useSelector(getTasks);
  const tasks = allTasks.filter(
    (task) => task.split(":")[0] + ":" + task.split(":")[1] === id
  );

  return (
    <div className={sass.subCont}>
      <InputBox
        label="sub 1"
        type="text"
        value={subName}
        setValue={setSubName}
      />
      <div className="tasks">
        {tasks.map((task) => (
          <Tasks key={task} id={task} />
        ))}
      </div>
    </div>
  );
};

const Head = ({ id }) => {
  const headName = useSelector((state) => getHeadById(state, id).name);
  const allSubs = useSelector(getSubs);
  const subs = allSubs.filter((sub) => sub.split(":")[0] === id);
  const dispatch = useDispatch();
  const setHeadName = (value) =>
    dispatch(updateHead({ id, changes: { name: value } }));
  return (
    <div className={sass.headCont}>
      <InputBox
        label="head 1"
        type="text"
        value={headName}
        setValue={setHeadName}
      />
      <div className="subjects">
        {subs.map((sub) => (
          <Sub key={sub} id={sub} />
        ))}
      </div>
    </div>
  );
};

const TaskInputs = () => {
  const heads = useSelector(getHeads);
  return (
    <div className={sass.inputs}>
      {heads.map((headId) => (
        <Head key={headId} id={headId} />
      ))}
    </div>
  );
};

export default TaskInputs;
