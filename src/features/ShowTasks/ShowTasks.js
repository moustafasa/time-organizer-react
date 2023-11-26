import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ShowHeads from "./ShowHeads/ShowHeads";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMultiple,
  fetchData,
  getAllDataIds,
  getAllHeadsIds,
  getAllSubsIds,
  getAllTasksIds,
} from "./ShowTasksSlice";
import sass from "./ShowTasks.module.scss";
import ShowSubs from "./ShowSubs/ShowSubs";
import ShowTasksE from "./ShowTasksE/ShowTasksE";
import ShowData from "./ShowData/ShowData";

const ShowTasks = () => {
  const keys = {
    heads: ["subNum", "subDone", "tasksNum", "tasksDone"],
    subs: ["tasksNum", "tasksDone"],
    tasks: ["subTasksNum", "subTasksDone"],
  };

  const [checkedItems, setCheckedItems] = useState([]);
  const { showed } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData(showed));
  }, [showed, dispatch]);

  const data = useSelector(getAllDataIds);

  const checkHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems([...checkedItems, e.target.value]);
    } else {
      setCheckedItems(checkedItems.filter((id) => id !== e.target.value));
    }
  };

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
                  checkHandler={checkHandler}
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
          <Link to={"/addTasks"} className="btn btn-primary text-capitalize">
            add
          </Link>
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
          >
            delete all
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShowTasks;
