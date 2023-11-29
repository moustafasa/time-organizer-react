import React, { useEffect } from "react";
import sass from "./AddTasks.module.scss";
import HeadNum from "./HeadNum/HeadNum";
import StatusBar from "./StatusBar/StatusBar";
import { useDispatch, useSelector } from "react-redux";
import { addSubToHead, addTaskToSub, clear, getHeads } from "./AddTasksSlice";
import Inputs from "./Inputs/Inputs";
import { useSearchParams } from "react-router-dom";

const AddTasks = () => {
  const numberOfHeads = useSelector(getHeads);
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  const headId = searchParams.get("headId");
  const subId = searchParams.get("subId");

  useEffect(() => {
    dispatch(clear());
    if (headId && !subId) {
      dispatch(addSubToHead(headId));
    } else if (subId && headId) {
      dispatch(addTaskToSub({ headId, subId }));
    }
  }, []);

  return (
    <section className={sass.addTasks}>
      <div className={sass.container + " container"}>
        <h2 className="page-head"> setup your tasks </h2>
        <form className={sass.add} onSubmit={(e) => e.preventDefault()}>
          {numberOfHeads.length <= 0 && !headId ? (
            <HeadNum />
          ) : (
            <>
              <StatusBar />
              <Inputs />
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default AddTasks;
