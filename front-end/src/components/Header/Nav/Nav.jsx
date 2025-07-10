import React, { useEffect, useState } from "react";
import { Form, Link, NavLink, useLocation } from "react-router-dom";
import "./Nav.scss";
import classNames from "classnames";
import { Button, Dropdown, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getCurrentToken } from "../../../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

import { FaBars } from "react-icons/fa6";

const Nav = () => {
  const [showTasksToggle, setShowTasksToggle] = useState(false);
  const [runTasksToggle, setRunTasksToggle] = useState(false);
  const [openParent, setOpenParent] = useState(false);
  const showTasksClass = classNames({ active: showTasksToggle }, "show-tasks");
  const runTasksClass = classNames({ active: runTasksToggle }, "run-tasks");
  const showParentClass = classNames({ clicked: openParent }, "parent");
  const mobileButtonActive = classNames({ active: openParent }, "bar-btn");
  const location = useLocation();
  const token = useSelector(getCurrentToken);
  const decoded = token ? jwtDecode(token) : "";

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

  const withAuthNav = (
    <>
      <Dropdown>
        <Dropdown.Toggle
          className="text-capitalize d-flex align-items-center justify-content-center"
          variant="none"
          id="dropdown-basic-button"
        >
          <div className="d-flex justify-content-center align-items-center gap-1">
            <div className="rounded-circle text-capitalize name-circle">
              {decoded?.name?.at(0)}
            </div>
            <span className="d-none d-sm-block">{decoded.name}</span>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Form action="/logout" method="POST">
            <Dropdown.Item as={Button} type="submit">
              logOut
            </Dropdown.Item>
          </Form>
        </Dropdown.Menu>
      </Dropdown>

      <ul className={showParentClass}>
        <li>
          <NavLink to="/" preventScrollReset>
            home
          </NavLink>
        </li>
        <li>
          <NavLink to="/addTasks" preventScrollReset>
            add tasks
          </NavLink>
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
              <NavLink to="/showTasks/heads" preventScrollReset>
                show heads
              </NavLink>
            </li>
            <li data-showed="subjects">
              <NavLink preventScrollReset to="/showTasks/subs">
                show subjects
              </NavLink>
            </li>
            <li data-showed="tasks">
              <NavLink preventScrollReset to="/showTasks/tasks">
                show tasks
              </NavLink>
            </li>
          </ul>
        </li>
        <li className={runTasksClass}>
          <button onClick={(_) => setRunTasksToggle(!runTasksToggle)}>
            runninig tasks
          </button>
          <ul className="runTasks child ">
            <li data-showed="add">
              <NavLink preventScrollReset to="/runningTasks/add">
                set run tasks
              </NavLink>
            </li>
            <li data-showed="day">
              <NavLink preventScrollReset to="/runningTasks/show">
                show run Tasks
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
      <div className="mobile">
        <Link preventScrollReset to={"/"} className="logo">
          time Organiser
        </Link>
        <button
          className={mobileButtonActive}
          onClick={(e) => setOpenParent(!openParent)}
        >
          <FaBars />
        </button>
      </div>
    </>
  );

  const withOutAuthNav = (
    <>
      <Link preventScrollReset to={"/"} className="logo">
        time Organiser
      </Link>
      <ul className={showParentClass}>
        <li>
          <NavLink to={"/login"}>login</NavLink>
        </li>
        <li>
          <NavLink to={"/register"}>register</NavLink>
        </li>
      </ul>
    </>
  );

  const content = token ? withAuthNav : withOutAuthNav;

  return (
    <nav>
      <Container
        fluid
        className="d-flex justify-content-between align-items-center gap-3 nav-cont "
      >
        {content}
      </Container>
    </nav>
  );
};

export default Nav;
