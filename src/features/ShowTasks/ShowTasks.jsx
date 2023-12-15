import React, { useEffect, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMultiple,
  fetchData,
  getAll,
  getAllDataIds,
  getAllHeadsIds,
  getAllSubsIds,
  getAllTasksIds,
  useDeleteMultipleMutation,
  useGetDataQuery,
  useGetHeadsQuery,
  useGetSubsQuery,
  useGetTasksQuery,
} from "./ShowTasksSlice";
import sass from "./ShowTasks.module.scss";
import ShowData from "./ShowData/ShowData";
import ShowSelects from "./ShowSelects/ShowSelects";
import PopUp from "../../components/PopUp/PopUp";

export const loader =
  (dispatch) =>
  async ({ request, params }) => {
    // init variables
    const { page } = params;
    const url = new URL(request.url);
    const headId = url.searchParams.get("headId");
    const subId = url.searchParams.get("subId");
    const keys = {
      heads: ["subNum", "subDone", "tasksNum", "tasksDone"],
      subs: ["tasksNum", "tasksDone"],
      tasks: ["subTasksNum", "subTasksDone"],
    };

    // fetch page depending on searchParams
    const args = {};
    if (page !== "heads") {
      args["headId"] = headId;
    }
    if (page === "tasks") {
      args["subId"] = subId;
    }

    return {
      keys: keys[page],
      args,
      // useGetDataQuery,
    };
  };

const ShowTasks = () => {
  const { keys, args } = useLoaderData();
  const { page } = useParams();
  const [searchParams] = useSearchParams();
  const currentHead = searchParams.get("headId");
  const currentSub = searchParams.get("subId");
  const navigator = useNavigate();
  const [checkedItems, setCheckedItems] = useState([]);

  const { data, isError, isFetching, isLoading, isSuccess, refetch } =
    useGetDataQuery(
      { page, args },
      {
        selectFromResult: ({ data, ...rest }) => {
          return {
            data: getAllDataIds(data, page),
            ...rest,
          };
        },
      }
    );

  const [deleteMulti] = useDeleteMultipleMutation();

  const addTasksHandler = () => {
    navigator(`/addTasks${window.location.search}`);
  };

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
    const args = { ids: checkedItems, page };
    if (page !== "heads") {
      args["headId"] = currentHead;
    }
    if (page === "subs") {
      args["subId"] = currentSub;
    }
    deleteMulti(args);
  };

  const deleteAllHandler = () => {
    const args = { ids: data, page };
    if (page !== "heads") {
      args["headId"] = currentHead;
    }
    if (page === "subs") {
      args["subId"] = currentSub;
    }
    deleteMulti(args);
  };

  return (
    <section>
      <PopUp>
        <div>content</div>
      </PopUp>
      <div className="container">
        <h2 className="page-head"> show {page} </h2>
        {page !== "heads" && <ShowSelects />}
        <div className={sass.tableCont}>
          <table className={sass.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>id</th>
                <th>name</th>
                <th>progress</th>
                {keys.map((key) => (
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
                  keys={keys}
                  editedKeys={
                    page === "tasks"
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
              (page !== "heads" && currentHead === "") ||
              (page === "tasks" && currentSub === "")
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
