import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentSub,
  changeNumberOfTasks,
  getCurrentSub,
  getSubById,
  getTasksOfSub,
  removeSub,
  updateSub,
} from "../../AddTasksSlice";
import { useRef } from "react";
import useScrollChangeValue from "../../../../customHooks/useChangeScrollValue/useChangeScrollValue";
import InputBox from "../../../../components/InputBox/InputBox";
import TaskInput from "../Task/TaskInput";
import sass from "./SubInput.module.scss";

const SubInput = ({ id, index }) => {
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
        label={`sub ${index}`}
        type="text"
        value={subName}
        setValue={setSubName}
      />
      <div className={sass.tasks}>
        {tasks.map((task, index) => (
          <TaskInput key={task} id={task} index={index + 1} />
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

export default SubInput;
