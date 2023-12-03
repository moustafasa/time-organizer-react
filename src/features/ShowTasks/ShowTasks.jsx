import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentPage,
  deleteMultiple,
  fetchData,
  getAllDataIds,
  getAllHeadsEntities,
  getAllSubsEntities,
  getCurrentHead,
  getCurrentSub,
} from "./ShowTasksSlice";
import sass from "./ShowTasks.module.scss";
import ShowData from "./ShowData/ShowData";
import SelectBox from "../../components/SelectBox/SelectBox";
import ShowSelects from "./ShowSelects/ShowSelects";

const ShowTasks = () => {
  const keys = {
    heads: ["subNum", "subDone", "tasksNum", "tasksDone"],
    subs: ["tasksNum", "tasksDone"],
    tasks: ["subTasksNum", "subTasksDone"],
  };

  const data = useSelector(getAllDataIds);
  const currentHead = useSelector(getCurrentHead);
  const currentSub = useSelector(getCurrentSub);
  const navigator = useNavigate();
  const [checkedItems, setCheckedItems] = useState([]);
  const { showed } = useParams();

  const addTasksSParams = `${
    showed !== "heads" ? `?headId=${currentHead}` : ""
  }${showed === "tasks" ? `&subId=${currentSub}` : ""}`;

  const dispatch = useDispatch();

  const addTasksHandler = () => {
    navigator(`/addTasks${addTasksSParams}`);
  };

  useEffect(() => {
    const args = {};
    if (showed !== "heads") {
      args["headId"] = currentHead;
    }
    if (showed === "tasks") {
      args["subId"] = currentSub;
    }
    dispatch(changeCurrentPage(showed));
    dispatch(fetchData({ page: showed, args }));
  }, [showed, currentHead, currentSub, dispatch]);

  useEffect(() => {
    const unCheckOnBlurHandler = (e) => {
      if (!e.target.closest("table") && !e.target.closest("button")) {
        setCheckedItems([]);
      }
    };
    document.addEventListener("click", unCheckOnBlurHandler);
    return () => {
      document.removeEventListener("click", unCheckOnBlurHandler);
    };
  }, []);

  const deleteMultiHandler = () => {
    dispatch(deleteMultiple(checkedItems));
  };

  const deleteAllHandler = () => {
    dispatch(deleteMultiple(data));
  };

  return (
    <section>
      <div className="container">
        <h2 className="page-head"> show {showed} </h2>
        {showed !== "heads" && <ShowSelects />}
        <div className={sass.tableCont}>
          <table className={sass.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>id</th>
                <th>name</th>
                <th>progress</th>
                {keys[showed].map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>options</th>
              </tr>
            </thead>
            <tbody>
              {data.map((id, index) => (
                <ShowData
                  key={id}
                  elementId={id}
                  index={index}
                  check={[checkedItems, setCheckedItems]}
                  keys={keys[showed]}
                  editedKeys={
                    showed === "tasks"
                      ? ["name", "subTasksNum", "subTasksDone"]
                      : ["name"]
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center w-100 mt-5 gap-3">
          <button
            onClick={addTasksHandler}
            className="btn btn-primary text-capitalize"
            disabled={
              (showed !== "heads" && currentHead === "") ||
              (showed === "tasks" && currentSub === "")
            }
          >
            add
          </button>
          <button
            className="btn btn-danger text-capitalize"
            disabled={checkedItems.length === 0}
            onClick={deleteMultiHandler}
          >
            delete
          </button>
          <button
            className="btn btn-danger text-capitalize"
            onClick={deleteAllHandler}
            disabled={data.length === 0}
          >
            delete all
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShowTasks;
