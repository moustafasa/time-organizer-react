import React, { memo, useRef } from "react";
import sass from "./StatusBar.module.scss";
import { shallowEqual, useSelector } from "react-redux";
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
import StatusSelect from "./StatusSelect";
import { Accordion } from "react-bootstrap";

const AccordionHeaderToggleMemo = memo(Accordion.Header, () => true);

const StatusBar = () => {
  const btnRef = useRef();
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

  return (
    <Accordion className={sass.statusBar} defaultActiveKey="0">
      <Accordion.Item eventKey="0" className={sass.item}>
        <Accordion.Body className={sass.body}>
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
        </Accordion.Body>
        <AccordionHeaderToggleMemo ref={btnRef} className={sass.icon}>
          statusBar
        </AccordionHeaderToggleMemo>
      </Accordion.Item>
    </Accordion>
  );
};

export default StatusBar;
