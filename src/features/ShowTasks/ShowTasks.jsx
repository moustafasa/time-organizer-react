import React, { useEffect, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  getAllDataIds,
  useDeleteMultipleMutation,
  useGetDataQuery,
} from "./ShowTasksSlice";
import ShowData from "./ShowData/ShowData";
import ShowSelects from "./ShowSelects/ShowSelects";
import PopUp, { show } from "../../components/PopUp/PopUp";
import { toast } from "react-toastify";

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

  const { data } = useGetDataQuery(
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
  const deleteConfirm = (type, handler) => {
    show({
      title: `delete ${
        type === "multi" || type === "all" ? page : page.slice(0, -1)
      }`,
      body: (
        <p className="text-capitalize">
          are you sure you want to delete{" "}
          {type === "multi"
            ? `selected ${page}`
            : type === "all"
            ? `all ${page}`
            : `this ${page.slice(0, -1)}`}
          ?
        </p>
      ),
      btn: {
        name: "delete",
        className: "btn btn-danger text-capitalize",
        handler,
      },
    });
  };

  const [deleteMulti, { isSuccess: isDeleted }] = useDeleteMultipleMutation();

  // useEffect(() => {
  //   if (isDeleted) {
  //     toast.success("the element is deleted successfully");
  //   }
  // }, [isDeleted]);

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
      <div className="container">
        <h2 className="page-head"> show {page} </h2>
        {page !== "heads" && <ShowSelects />}
        <div className="table-cont">
          <table className="custom-table">
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
                  deleteConfirm={deleteConfirm}
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
            onClick={() => deleteConfirm("multi", deleteMultiHandler)}
          >
            delete
          </button>
          <button
            className="btn btn-danger text-capitalize"
            onClick={() => deleteConfirm("all", deleteAllHandler)}
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
