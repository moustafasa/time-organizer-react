import React, { useState } from "react";
import InputBox from "../../../components/InputBox/InputBox";
import { useDispatch, useSelector } from "react-redux";
import {
  changeNumberOfHeads,
  changeNumberOfSubs,
  changeNumberOfTasks,
  deleteTasks,
  getHeadById,
  getHeads,
  getNumberOfTasks,
  getSubById,
  getSubs,
  getSubsOfHead,
  getTaskById,
  getTasks,
  getTasksOfSub,
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
    <div className={sass.task}>
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
      <button
        className="input-modify-btn minus-btn"
        onClick={(e) => dispatch(deleteTasks([id]))}
      >
        -
      </button>
    </div>
  );
};

const Sub = ({ id }) => {
  const subName = useSelector((state) => getSubById(state, id).name);
  const dispatch = useDispatch();
  const setSubName = (value) =>
    dispatch(updateSub({ id, changes: { name: value } }));
  const tasks = useSelector((state) => getTasksOfSub(state, id));
  return (
    <div className={sass.subCont}>
      <InputBox
        label="sub 1"
        type="text"
        value={subName}
        setValue={setSubName}
      />
      <div className={sass.tasks}>
        {tasks.map((task) => (
          <Tasks key={task} id={task} />
        ))}
        <button
          className="input-modify-btn plus-btn"
          onClick={(e) => dispatch(changeNumberOfTasks({ num: 1, subId: id }))}
        >
          +
        </button>
      </div>
    </div>
  );
};

const Head = ({ id }) => {
  const headName = useSelector((state) => getHeadById(state, id).name);
  const subs = useSelector((state) => getSubsOfHead(state, id));
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
        <button
          className="input-modify-btn plus-btn"
          onClick={(e) => dispatch(changeNumberOfSubs({ num: 1, headId: id }))}
        >
          +
        </button>
      </div>
    </div>
  );
};

const TaskInputs = () => {
  const heads = useSelector(getHeads);
  const dispatch = useDispatch();
  return (
    <div className={sass.inputs}>
      {heads.map((headId) => (
        <Head key={headId} id={headId} />
      ))}
      <button
        className="input-modify-btn plus-btn"
        onClick={(e) => dispatch(changeNumberOfHeads(1))}
      >
        +
      </button>
    </div>
  );
};

export default TaskInputs;
