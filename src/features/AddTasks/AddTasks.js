import React from "react";
import sass from "./AddTasks.module.scss";
import HeadNum from "./HeadNum/HeadNum";
import StatusBar from "./StatusBar/StatusBar";

const AddTasks = () => {
  return (
    <div className={sass.addTasks}>
      <div className={sass.container + " container"}>
        <h2 className="page-head"> setup your tasks </h2>
        <form className={sass.add}>
          {/* <HeadNum /> */}
          <StatusBar />
        </form>
      </div>
    </div>
  );
};

export default AddTasks;
