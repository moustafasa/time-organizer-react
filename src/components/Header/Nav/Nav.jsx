import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Nav.scss";
import classNames from "classnames";

const Nav = () => {
  const [showTasksToggle, setShowTasksToggle] = useState(false);
  const [runTasksToggle, setRunTasksToggle] = useState(false);
  const [openParent, setOpenParent] = useState(false);
  const showTasksClass = classNames({ active: showTasksToggle }, "show-tasks");
  const runTasksClass = classNames({ active: runTasksToggle }, "run-tasks");
  const showParentClass = classNames({ clicked: openParent }, "parent");
  const mobileButtonActive = classNames({ active: openParent }, "bar-btn");
  const location = useLocation();

  useEffect(() => {
    setShowTasksToggle(false);
    setRunTasksToggle(false);
    setOpenParent(false);
  }, [location.pathname]);

  useEffect(() => {
    const blurHandler = (e) => {
      if (!e.target.closest("nav .show-tasks")) {
        setShowTasksToggle(false);
      }
      if (!e.target.closest("nav .run-tasks")) {
        setRunTasksToggle(false);
      }
      if (
        !e.target.closest("nav .parent") &&
        !e.target.closest("nav .bar-btn")
      ) {
        setOpenParent(false);
      }
    };

    document.addEventListener("click", blurHandler);
    return () => {
      document.removeEventListener("click", blurHandler);
    };
  }, []);

  return (
    <nav>
      <ul className={showParentClass}>
        <li>
          <Link to="/addTasks">add tasks </Link>
        </li>
        <li className={showTasksClass}>
          <button
            onClick={(_) => {
              setShowTasksToggle(!showTasksToggle);
            }}
          >
            show tasks
          </button>
          <ul className="showTasks child">
            <li data-showed="heads">
              <Link to="/showTasks/heads">show heads</Link>
            </li>
            <li data-showed="subjects">
              <Link to="/showTasks/subs">show subjects</Link>
            </li>
            <li data-showed="tasks">
              <Link to="/showTasks/tasks">show tasks</Link>
            </li>
          </ul>
        </li>
        <li className={runTasksClass}>
          <button onClick={(_) => setRunTasksToggle(!runTasksToggle)}>
            runninig tasks
          </button>
          <ul className="runTasks child ">
            <li data-showed="add">
              <Link to="/runningTasks/add">set run tasks</Link>
            </li>
            <li data-showed="day">
              <Link to="/runningTasks/show">show run Tasks</Link>
            </li>
          </ul>
        </li>
      </ul>
      <div className="mobile">
        <div className="container">
          <div className="logo">time Organiser</div>
          <button
            className={mobileButtonActive}
            onClick={(e) => setOpenParent(!openParent)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
