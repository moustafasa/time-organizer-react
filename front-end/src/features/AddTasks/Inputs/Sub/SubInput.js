import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  changeCurrentSub,
  changeNumberOfTasks,
  getCurrentHead,
  getCurrentSub,
  getSubById,
  getTasksLoadingStatus,
  getTasksOfSub,
  removeSub,
  updateSub,
} from "../../AddTasksSlice";
import { memo, useRef } from "react";
import useScrollChangeValue from "../../../../customHooks/useChangeScrollValue/useChangeScrollValue";
import InputBox from "../../../../components/InputBox/InputBox";
import TaskInput from "../Task/TaskInput";
import sass from "./SubInput.module.scss";
import AddFieldButton from "../../../../components/AddFieldButton/AddFieldButton";

const SubInput = ({ id, index, last }) => {
  const sub = useSelector((state) => getSubById(state, id));
  const tasksLoadingState = useSelector((state) =>
    getTasksLoadingStatus(state, id)
  );
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
    last
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
        {tasksLoadingState && <div>loading...</div>}
        {tasks.map((task, index) => (
          <TaskInput
            key={task}
            id={task}
            index={index + 1}
            last={index === tasks.length - 1}
          />
        ))}
        {!tasksLoadingState && (
          <AddFieldButton
            onClick={(e) =>
              dispatch(
                changeNumberOfTasks({ num: 1, subId: id, headId: sub.headId })
              )
            }
            title="add task"
            type="plus"
          />
        )}
      </div>
      {!sub.readOnly && (
        <AddFieldButton
          onClick={(e) => dispatch(removeSub(id))}
          title={`remove sub ${index}`}
          type="minus"
        />
      )}
    </div>
  );
};

export default memo(SubInput);
