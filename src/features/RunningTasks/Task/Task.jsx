import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getCurrentDay,
  getRunTaskById,
  useDeleteFromRunTasksMutation,
  useGetRunningTasksQuery,
} from "../RunningTasksSlice";
import { show } from "../../../components/PopUp/PopUp";
import StartRunTask from "../StartRunTasks/RunTasksTimer/RunTasksTimer";
import FinishTask from "../StartRunTasks/FinishTask/FinishTask";
import RunTasksTimer from "../StartRunTasks/RunTasksTimer/RunTasksTimer";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { format, isSameDay } from "date-fns";

const Task = ({
  id,
  index,
  checked: [checkedItems, setCheckedItems],
  deleteConfirm,
}) => {
  const dayValue = useSelector(getCurrentDay);
  const { data: task } = useGetRunningTasksQuery(dayValue, {
    selectFromResult: ({ data, ...rest }) => ({
      data: getRunTaskById(data, id),
      ...rest,
    }),
  });

  const date = new Date(task.day);

  const [deleteTask] = useDeleteFromRunTasksMutation();

  const checkHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems([...checkedItems, e.target.value]);
    } else {
      setCheckedItems(checkedItems.filter((id) => id !== e.target.value));
    }
  };
  const selectHandler = (e) => {
    if (!e.target.closest("td:last-of-type")) {
      if (checkedItems.includes(id)) {
        setCheckedItems(checkedItems.filter((item) => item !== id));
      } else {
        setCheckedItems([...checkedItems, id]);
      }
    }
  };

  const trClass = classNames({ success: task.done });

  return (
    <tr onClick={selectHandler} className={trClass}>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          value={id}
          checked={checkedItems.includes(id)}
          onChange={checkHandler}
        />
      </td>
      <td>{index}</td>
      {dayValue === "" && <td>{format(date, "eeee")}</td>}
      <td>{task.name}</td>
      <td>{task.headName}</td>
      <td>{task.subName}</td>
      <td>{task.progress}</td>
      <td>{task.subTasksNum}</td>
      <td>{task.subTasksDone}</td>
      <td>{task.done ? "done" : "not done"}</td>
      <td>
        <div className="d-flex gap-2 align-items-center justify-content-center">
          <button
            className="btn btn-danger text-capitalize d-block"
            onClick={() => deleteConfirm(() => deleteTask(id))}
          >
            delete
          </button>
          {isSameDay(date, new Date()) && !task.done && (
            <Link
              className="btn btn-primary text-capitalize d-block"
              to={`/runningTasks/start?taskId=${id}`}
            >
              start
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
};

export default Task;
