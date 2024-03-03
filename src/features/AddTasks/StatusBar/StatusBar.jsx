import React, { useEffect } from "react";
import SelectBox from "../../../components/SelectBox/SelectBox";
import sass from "./StatusBar.module.scss";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
import StatusSelect from "./StatusSelect";

// const StatusBar = () => {
//   const dispatch = useDispatch();
//   const heads = useSelector(getHeadsEntities);
//   const currentHead = useSelector(getCurrentHead, shallowEqual);
//   const subs = useSelector((state) =>
//     getSubsEntitiesOfHead(state, currentHead)
//   );
//   const currentSub = useSelector(getCurrentSub);
//   const tasks = useSelector((state) =>
//     getTasksEntitiesOfSub(state, currentSub)
//   );
//   const currentTask = useSelector(getCurrentTask);

//   const headOptions = [
//     { text: "choose", value: "" },
//     ...heads.map((head, index) => {
//       return {
//         text: head.name !== "" ? head.name : `head ${index + 1}`,
//         value: head.id,
//       };
//     }),
//   ];

//   const subOptions = [
//     { text: "choose", value: "" },
//     ...subs.map((sub, index) => {
//       return {
//         text: sub.name !== "" ? sub.name : `sub ${index + 1}`,
//         value: sub.id,
//       };
//     }),
//   ];
//   console.log(currentHead);

//   const taskOptions = [
//     { text: "choose", value: "" },
//     ...tasks.map((task, index) => {
//       return {
//         text: task.name !== "" ? task.name : `task ${index + 1}`,
//         value: task.id,
//       };
//     }),
//   ];

//   return (
//     <div className={sass.statusBar}>
//       <ul className={sass.map}>
//         <li className={sass.selectCont}>
//           <label>head</label>
//           <SelectBox
//             options={headOptions}
//             valueState={[
//               currentHead,
//               (value) => {
//                 dispatch(changeCurrentHead(value));
//               },
//             ]}
//             className={sass.SelectBox}
//             to={`#${currentHead}`}
//           />
//         </li>
//         <li className={sass.selectCont}>
//           <label>sub</label>
//           <SelectBox
//             options={subOptions}
//             valueState={[
//               currentSub,
//               (value) => {
//                 dispatch(changeCurrentSub(value));
//                 window.location.hash = `#${value}`;
//               },
//             ]}
//             className={sass.SelectBox}
//           />
//         </li>
//         <li className={sass.selectCont}>
//           <label>task</label>
//           <SelectBox
//             options={taskOptions}
//             valueState={[
//               currentTask,
//               (value) => {
//                 dispatch(changeCurrentTask(value));
//                 window.location.hash = `#${value}`;
//               },
//             ]}
//             className={sass.SelectBox}
//           />
//         </li>
//       </ul>
//     </div>
//   );
// };

const StatusBar = () => {
  const heads = useSelector(getHeadsEntities);
  const currentHead = useSelector(getCurrentHead, shallowEqual);
  const subs = useSelector(
    (state) => getSubsEntitiesOfHead(state, currentHead),
    shallowEqual
  );
  const currentSub = useSelector(getCurrentSub);
  const tasks = useSelector(
    (state) => getTasksEntitiesOfSub(state, currentSub),
    shallowEqual
  );
  const currentTask = useSelector(getCurrentTask);

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentHead) dispatch(changeCurrentSub(subs[0].id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHead, dispatch]);
  useEffect(() => {
    if (currentSub) dispatch(changeCurrentTask(tasks[0].id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSub, dispatch]);

  return (
    <div className={sass.statusBar}>
      <ul className={sass.map}>
        <StatusSelect
          entities={heads}
          currentEntity={currentHead}
          changeEntity={changeCurrentHead}
          label="head"
          sass={sass}
        />
        <StatusSelect
          entities={subs}
          currentEntity={currentSub}
          changeEntity={changeCurrentSub}
          label="sub"
          sass={sass}
        />
        <StatusSelect
          entities={tasks}
          currentEntity={currentTask}
          changeEntity={changeCurrentTask}
          label="task"
          sass={sass}
        />
      </ul>
    </div>
  );
};

export default StatusBar;
