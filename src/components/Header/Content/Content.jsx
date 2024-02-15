import React from "react";
import contentScss from "./Content.module.scss";
import { FaAngleDoubleDown } from "react-icons/fa";
const Content = () => {
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
          <a href="#body">
            <FaAngleDoubleDown />
          </a>
        </button>
      </div>
    </div>
  );
};

export default Content;
