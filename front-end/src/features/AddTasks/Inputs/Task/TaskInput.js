import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentTask,
  deleteTasks,
  getCurrentSub,
  getCurrentTask,
  getTaskById,
  updateTask,
} from "../../AddTasksSlice";
import { memo, useRef } from "react";
import useScrollChangeValue from "../../../../customHooks/useChangeScrollValue/useChangeScrollValue";
import InputBox from "../../../../components/InputBox/InputBox";
import sass from "./TaskInput.module.scss";
import AddFieldButton from "../../../../components/AddFieldButton/AddFieldButton";

const TaskInput = ({ id, index, last }) => {
  const task = useSelector((state) => getTaskById(state, id));
  const dispatch = useDispatch();
  const setTaskName = (value) =>
    dispatch(updateTask({ id, changes: { name: value } }));
  const setSubTasksNum = (value) =>
    dispatch(updateTask({ id, changes: { subTasksNum: value } }));
  const setSubTasksDone = (value) =>
    dispatch(updateTask({ id, changes: { subTasksDone: value } }));
  const taskRef = useRef();
  const currentSub = useSelector(getCurrentSub);

  useScrollChangeValue(
    id,
    changeCurrentTask,
    taskRef,
    getCurrentTask,
    currentSub === task.subId,
    last
  );

  const onFocusHandler = () => taskRef.current.scrollIntoView();

  return (
    <div className={sass.task} ref={taskRef} id={id}>
      <InputBox
        label={`task ${index}`}
        type="text"
        value={task.name}
        setValue={setTaskName}
        onFocus={onFocusHandler}
      />
      <InputBox
        label="subTasksNum"
        type="number"
        value={task.subTasksNum}
        setValue={setSubTasksNum}
        onFocus={onFocusHandler}
      />
      <InputBox
        label="subTasksDone"
        type="number"
        value={task.subTasksDone}
        setValue={setSubTasksDone}
        onFocus={onFocusHandler}
      />
      <AddFieldButton
        onClick={(e) => dispatch(deleteTasks([id]))}
        title={`remove task ${index}`}
        type="minus"
      />
    </div>
  );
};

export default memo(TaskInput);
