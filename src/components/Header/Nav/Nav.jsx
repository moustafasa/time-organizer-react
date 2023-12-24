import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Nav.scss";

const Nav = () => {
  const [showTasksToggle, setShowTasksToggle] = useState(false);
  const [runTasksToggle, setRunTasksToggle] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setShowTasksToggle(false);
    setRunTasksToggle(false);
  }, [location.pathname]);

  return (
    <nav>
      <ul className="parent">
        <li>
          <Link to="/addTasks">add tasks </Link>
        </li>
        <li className={showTasksToggle ? "active" : ""}>
          <button onClick={(_) => setShowTasksToggle(!showTasksToggle)}>
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
        <li className={runTasksToggle ? "active" : ""}>
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
            <li data-showed="day">
              <Link to="/runningTasks/start">start run Tasks</Link>
            </li>
          </ul>
        </li>
      </ul>
      <div className="mobile">
        <div className="container">
          <div className="logo">time Organiser</div>
          <button className="bar-btn">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
