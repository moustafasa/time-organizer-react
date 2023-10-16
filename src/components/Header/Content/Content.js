import React from "react";
import contentScss from "./Content.module.scss";
const Content = () => {
  return (
    <div class={contentScss.content}>
      <h1
        class={contentScss.mainHead}
        data-content="hello to time organizer website"
      >
        <span>hello to time organizer website</span>
      </h1>
      <div class={contentScss.goDown}>
        <h2>let's organize our work</h2>
        <button class={contentScss.goDownBtn}>
          <a href="#body">
            <i class="fa-solid fa-angles-down"></i>
          </a>
        </button>
      </div>
    </div>
  );
};

export default Content;
