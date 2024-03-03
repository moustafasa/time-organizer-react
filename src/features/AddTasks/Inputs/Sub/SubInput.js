import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  changeCurrentSub,
  changeNumberOfTasks,
  getCurrentHead,
  getCurrentSub,
  getSubById,
  getTasksOfSub,
  removeSub,
  updateSub,
} from "../../AddTasksSlice";
import { memo, useRef } from "react";
import useScrollChangeValue from "../../../../customHooks/useChangeScrollValue/useChangeScrollValue";
import InputBox from "../../../../components/InputBox/InputBox";
import TaskInput from "../Task/TaskInput";
import sass from "./SubInput.module.scss";

const SubInput = ({ id, index, last }) => {
  const sub = useSelector((state) => getSubById(state, id));
  const dispatch = useDispatch();
  const setSubName = (value) =>
    dispatch(updateSub({ id, changes: { name: value } }));
  const tasks = useSelector((state) => getTasksOfSub(state, id), shallowEqual);
  const subRef = useRef();
  const currentHead = useSelector(getCurrentHead);

  useScrollChangeValue(
    id,
    changeCurrentSub,
    subRef,
    getCurrentSub,
    sub.headId === currentHead,
    last,
    index
  );
  return (
    <div className={sass.subCont} ref={subRef} id={id}>
      <InputBox
        label={`sub ${index}`}
        type="text"
        value={sub.name}
        setValue={setSubName}
        readOnly={sub.readOnly}
        onFocus={() => {
          subRef.current.scrollIntoView();
        }}
      />
      <div className={sass.tasks}>
        {tasks.map((task, index) => (
          <TaskInput
            key={task}
            id={task}
            index={index + 1}
            last={index === tasks.length - 1}
          />
        ))}
        <button
          className="input-modify-btn plus-btn"
          onClick={(e) => dispatch(changeNumberOfTasks({ num: 1, subId: id }))}
          title="add task"
          type="button"
        >
          +
        </button>
      </div>
      {!sub.readOnly && (
        <button
          className="input-modify-btn minus-btn"
          onClick={(e) => dispatch(removeSub(id))}
          title={`remove sub ${index}`}
          type="button"
        >
          -
        </button>
      )}
    </div>
  );
};

export default memo(SubInput);
