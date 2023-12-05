import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentTask,
  deleteTasks,
  getCurrentTask,
  getTaskById,
  updateTask,
} from "../../AddTasksSlice";
import { useRef } from "react";
import useScrollChangeValue from "../../../../customHooks/useChangeScrollValue/useChangeScrollValue";
import InputBox from "../../../../components/InputBox/InputBox";
import sass from "./TaskInput.module.scss";

const TaskInput = ({ id, index }) => {
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
        label={`task ${index}`}
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
        title={`remove task ${index}`}
        type="button"
      >
        -
      </button>
    </div>
  );
};

export default TaskInput;
