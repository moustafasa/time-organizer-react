import React from "react";
import SelectBox from "../../../components/SelectBox/SelectBox";
import sass from "./StatusBar.module.scss";
import { useDispatch, useSelector } from "react-redux";
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
import { useNavigate } from "react-router-dom";

const StatusBar = () => {
  const dispatch = useDispatch();
  const heads = useSelector(getHeadsEntities);
  const currentHead = useSelector(getCurrentHead);
  const subs = useSelector((state) =>
    getSubsEntitiesOfHead(state, currentHead)
  );
  const currentSub = useSelector(getCurrentSub);
  const tasks = useSelector((state) =>
    getTasksEntitiesOfSub(state, currentSub)
  );
  const currentTask = useSelector(getCurrentTask);

  const headOptions = [
    { text: "choose", value: "" },
    ...heads.map((head, index) => {
      return {
        text: head.name !== "" ? head.name : `head ${index + 1}`,
        value: head.id,
      };
    }),
  ];

  const subOptions = [
    { text: "choose", value: "" },
    ...subs.map((sub, index) => {
      return {
        text: sub.name !== "" ? sub.name : `sub ${index + 1}`,
        value: sub.id,
      };
    }),
  ];

  const taskOptions = [
    { text: "choose", value: "" },
    ...tasks.map((task, index) => {
      return {
        text: task.name !== "" ? task.name : `task ${index + 1}`,
        value: task.id,
      };
    }),
  ];

  return (
    <div className={sass.statusBar}>
      <ul className={sass.map}>
        <li className={sass.selectCont}>
          <label>head</label>
          <SelectBox
            options={headOptions}
            valueState={[
              currentHead,
              (value) => {
                dispatch(changeCurrentHead(value));
                window.location.hash = `#${value}`;
              },
            ]}
            className={sass.SelectBox}
          />
        </li>
        <li className={sass.selectCont}>
          <label>sub</label>
          <SelectBox
            options={subOptions}
            valueState={[
              currentSub,
              (value) => {
                dispatch(changeCurrentSub(value));
                window.location.hash = `#${value}`;
              },
            ]}
            className={sass.SelectBox}
          />
        </li>
        <li className={sass.selectCont}>
          <label>task</label>
          <SelectBox
            options={taskOptions}
            valueState={[
              currentTask,
              (value) => {
                dispatch(changeCurrentTask(value));
                window.location.hash = `#${value}`;
              },
            ]}
            className={sass.SelectBox}
          />
        </li>
      </ul>
    </div>
  );
};

export default StatusBar;
