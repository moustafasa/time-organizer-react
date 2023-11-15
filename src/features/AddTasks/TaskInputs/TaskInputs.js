import React, { useEffect, useRef } from "react";
import InputBox from "../../../components/InputBox/InputBox";
import { useDispatch, useSelector } from "react-redux";
import {
  addTasksToRemote,
  changeCurrentHead,
  changeCurrentSub,
  changeCurrentTask,
  changeNumberOfHeads,
  changeNumberOfSubs,
  changeNumberOfTasks,
  deleteTasks,
  getCurrentHead,
  getCurrentSub,
  getCurrentTask,
  getHeadById,
  getHeads,
  getSubById,
  getSubsOfHead,
  getTaskById,
  getTasksOfSub,
  removeHead,
  removeSub,
  updateHead,
  updateSub,
  updateTask,
} from "../AddTasksSlice";

import sass from "./TaskInputs.module.scss";
import useScrollChangeValue from "../../../customHooks/useChangeScrollValue/useChangeScrollValue";

const Tasks = ({ id, index }) => {
  const task = useSelector((state) => getTaskById(state, id));
  const dispatch = useDispatch();
  const setTaskName = (value) =>
    dispatch(updateTask({ id, changes: { name: value } }));
  const setSubTasksNum = (value) =>
    dispatch(updateTask({ id, changes: { subTasksNum: value } }));
  const setSubTasksDone = (value) =>
    dispatch(updateTask({ id, changes: { subTasksDone: value } }));
  const taskRef = useRef();

  useScrollChangeValue(id, changeCurrentTask, taskRef, getCurrentTask);

  return (
    <div className={sass.task} ref={taskRef} id={id}>
      <InputBox
        className={sass.inputBox}
        label={`task ${index}`}
        type="text"
        value={task.name}
        setValue={setTaskName}
      />
      <InputBox
        className={sass.inputBox}
        label="subTasksNum"
        type="number"
        value={task.subTasksNum}
        setValue={setSubTasksNum}
      />
      <InputBox
        className={sass.inputBox}
        label="subTasksDone"
        type="number"
        value={task.subTasksDone}
        setValue={setSubTasksDone}
      />
      <button
        className="input-modify-btn minus-btn"
        onClick={(e) => dispatch(deleteTasks([id]))}
        title={`remove task ${index}`}
      >
        -
      </button>
    </div>
  );
};

const Sub = ({ id, index }) => {
  const subName = useSelector((state) => getSubById(state, id).name);
  const dispatch = useDispatch();
  const setSubName = (value) =>
    dispatch(updateSub({ id, changes: { name: value } }));
  const tasks = useSelector((state) => getTasksOfSub(state, id));
  const subRef = useRef();
  useScrollChangeValue(id, changeCurrentSub, subRef, getCurrentSub);
  return (
    <div className={sass.subCont} ref={subRef} id={id}>
      <InputBox
        className={sass.inputBox}
        label={`sub ${index}`}
        type="text"
        value={subName}
        setValue={setSubName}
      />
      <div className={sass.tasks}>
        {tasks.map((task, index) => (
          <Tasks key={task} id={task} index={index + 1} />
        ))}
        <button
          className="input-modify-btn plus-btn"
          onClick={(e) => dispatch(changeNumberOfTasks({ num: 1, subId: id }))}
          title="add task"
        >
          +
        </button>
      </div>
      <button
        className="input-modify-btn minus-btn"
        onClick={(e) => dispatch(removeSub(id))}
        title={`remove sub ${index}`}
      >
        -
      </button>
    </div>
  );
};

const Head = ({ id, index }) => {
  const headName = useSelector((state) => getHeadById(state, id).name);
  const subs = useSelector((state) => getSubsOfHead(state, id));
  const dispatch = useDispatch();
  const setHeadName = (value) =>
    dispatch(updateHead({ id, changes: { name: value } }));
  const headRef = useRef();

  useScrollChangeValue(id, changeCurrentHead, headRef, getCurrentHead);

  return (
    <div className={sass.headCont} ref={headRef} id={id}>
      <InputBox
        className={sass.inputBox}
        label={`head ${index}`}
        type="text"
        value={headName}
        setValue={setHeadName}
      />
      <div className={sass.subjects}>
        {subs.map((sub, index) => (
          <Sub key={sub} id={sub} index={index + 1} />
        ))}
        <button
          className="input-modify-btn plus-btn"
          onClick={(e) => dispatch(changeNumberOfSubs({ num: 1, headId: id }))}
          title="add Sub"
        >
          +
        </button>
      </div>
      <button
        className="input-modify-btn minus-btn"
        title={`remove head ${index}`}
        onClick={(e) => dispatch(removeHead(id))}
      >
        -
      </button>
    </div>
  );
};

const TaskInputs = () => {
  const heads = useSelector(getHeads);
  const dispatch = useDispatch();
  return (
    <div className={sass.inputs}>
      {heads.map((headId, index) => (
        <Head key={headId} id={headId} index={index + 1} />
      ))}
      <button
        className="input-modify-btn plus-btn"
        onClick={(e) => dispatch(changeNumberOfHeads(1))}
        style={{ marginTop: "50px" }}
      >
        +
      </button>

      <button
        className="submit-button"
        onClick={(e) => dispatch(addTasksToRemote())}
      >
        {" "}
        add
      </button>
    </div>
  );
};

export default TaskInputs;
