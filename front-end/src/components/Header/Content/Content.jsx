import React, { useEffect } from "react";
import contentScss from "./Content.module.scss";
import { FaAngleDoubleDown } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
const Content = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      element?.scrollIntoView();
    }
  }, [location]);
  return (
    <div className={contentScss.content}>
      <h1
        className={contentScss.mainHead}
        data-content="hello to time organizer website"
      >
        <span>hello to time organizer website</span>
      </h1>
      <div className={contentScss.goDown}>
        <h2>let's organize our work</h2>
        <button className={contentScss.goDownBtn}>
          <Link to="#body">
            <FaAngleDoubleDown />
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Content;
