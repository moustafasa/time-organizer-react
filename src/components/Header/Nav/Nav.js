import React from "react";
import { Link } from "react-router-dom";
import "./Nav.scss";

const Nav = () => {
  return (
    <nav>
      <ul class="parent">
        <li>
          <Link to="/">add tasks </Link>
        </li>
        <li>
          <Link to="/showTasks">show tasks </Link>
          <ul class="showTasks child ">
            <li data-showed="heads">
              <Link to="/showTasks/heads">show heads</Link>
            </li>
            <li data-showed="subjects">
              <Link to="/showTasks/subjects">show subjects</Link>
            </li>
            <li data-showed="tasks">
              <Link to="/showTasks/tasks">show tasks</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/runningTasks">runninig tasks </Link>
          <ul class="runTasks child ">
            <li data-showed="day">
              <Link to="/runningTasks/day">show day Tasks</Link>
            </li>
            <li data-showed="week">
              <Link to="/runningTasks/week">show week Tasks</Link>
            </li>
          </ul>
        </li>
      </ul>
      <div class="mobile">
        <div class="container">
          <div class="logo">time Organiser</div>
          <button class="bar-btn">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
