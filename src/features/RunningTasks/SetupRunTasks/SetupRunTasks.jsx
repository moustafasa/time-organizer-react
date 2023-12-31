import React, { useState } from "react";
import SelectBox from "../../../components/SelectBox/SelectBox";
import axios from "axios";
import {
  Form,
  redirect,
  useLoaderData,
  useRouteLoaderData,
  useSearchParams,
} from "react-router-dom";
import {
  getAllHeadsEntities,
  getAllSubsEntities,
  getAllTasksEntities,
  getNotDoneTasks,
  useGetDataQuery,
} from "../../ShowTasks/ShowTasksSlice";
import { useAddRunTasksMutation } from "../RunningTasksSlice";

export const loader = async ({ request, params }) => {
  const url = new URL(request.url);
  const head = url.searchParams.get("headId");
  const sub = url.searchParams.get("subId");
  const args = {};

  if (head) {
    args["headId"] = head;
  }

  if (sub) {
    args["subId"] = sub;
  }

  return {
    args,
  };
};

export const action = async ({ request, params }) => {
  return redirect("/runningTasks/show");
};

const SetupRunTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { args } = useLoaderData();
  const { weekDays } = useRouteLoaderData("runningTasks");
  const day = searchParams.get("day") || weekDays[0].value;
  const setDay = (value) => setSearchParams({ day: value });

  const { data: heads = {} } = useGetDataQuery(
    { page: "heads" },
    {
      selectFromResult: ({ data, ...rest }) => ({
        data: getAllHeadsEntities(data),
        ...rest,
      }),
    }
  );

  const { data: subs = {} } = useGetDataQuery(
    { page: "subs", args },
    {
      selectFromResult: ({ data, ...rest }) => ({
        data: getAllSubsEntities(data),
        ...rest,
      }),
    }
  );

  const { data: tasks = {} } = useGetDataQuery(
    { page: "tasks", args },
    {
      selectFromResult: ({ data, ...rest }) => {
        return {
          data: getNotDoneTasks(data),
          ...rest,
        };
      },
    }
  );

  const [setRunTasks] = useAddRunTasksMutation();

  // convert data to options
  const convertToOptions = (elements) => [
    { text: "choose", value: "" },
    ...Object.keys(elements).map((id) => ({
      text: elements[id].name,
      value: id,
    })),
  ];

  const selectValue = (type) => searchParams.get(`${type}Id`) || "";
  const setSelectValue = (type) => (value) => {
    if (!value)
      setSearchParams((prev) => {
        prev.delete(`${type}Id`);
        return prev;
      });
    else {
      setSearchParams((prev) => {
        if (type === "head") prev.delete("subId");
        if (type === "sub") prev.delete("taskId");
        return { ...Object.fromEntries(prev), [`${type}Id`]: value };
      });
    }
  };

  const valueState = (type) => [selectValue(type), setSelectValue(type)];

  // const addHandler = () => {
  //   if (!tasksList.find((task) => task.id === searchParams.get("taskId")))
  //     setTasksList([
  //       ...tasksList,
  //       {
  //         id: searchParams.get("taskId"),
  //         task: tasks.find((task) => task.value === searchParams.get("taskId"))
  //           .text,
  //         sub: subs.find((sub) => sub.value === searchParams.get("subId")).text,
  //         head: heads.find((head) => head.value === searchParams.get("headId"))
  //           .text,
  //         day: day[0],
  //       },
  //     ]);
  //   setSelectValue("task")("");
  // };

  // const tasks = [];
  // const subs = [];

  return (
    <section>
      <div className="container">
        <h2 className="page-head mb-5">setup runTasks</h2>
        <Form
          method="post"
          onSubmit={(e) => {
            setRunTasks({
              ...Object.fromEntries(searchParams),
              day,
            });
          }}
        >
          <div className="d-flex justify-content-center  gap-3 flex-column ">
            <fieldset className="row gap-1 align-items-center text-capitalize  ">
              <label className="col-md-1 col-12 text-center text-md-start  mb-2 mb-md-0 ">
                heads
              </label>
              <SelectBox
                valueState={valueState("head")}
                className="col"
                options={convertToOptions(heads)}
                name="head"
              />
            </fieldset>
            <fieldset className="row gap-1 align-items-center text-capitalize ">
              <label className="col-md-1 col-12 text-center text-md-start  mb-2 mb-md-0 ">
                subs
              </label>
              <SelectBox
                className="col"
                valueState={valueState("sub")}
                options={convertToOptions(subs)}
                name="sub"
              />
            </fieldset>
            <fieldset className="row gap-1 align-items-center text-capitalize ">
              <label className="col-md-1 col-12 text-center text-md-start  mb-2 mb-md-0 ">
                tasks
              </label>
              <SelectBox
                className="col"
                valueState={valueState("task")}
                options={convertToOptions(tasks)}
                name="task"
              />
            </fieldset>
            <fieldset className="row gap-1 align-items-center text-capitalize ">
              <label className="col-md-1 col-12 text-center text-md-start  mb-2 mb-md-0 ">
                day
              </label>
              <SelectBox
                className="col"
                valueState={[day, setDay]}
                options={weekDays}
                name="day"
              />
            </fieldset>
          </div>
          <button
            className="btn btn-primary d-block mx-auto mt-5 text-capitalize w-50"
            // onClick={addHandler}
            disabled={!searchParams.get("taskId") || !day}
          >
            add
          </button>
          {/* <div>
            <h3 className="text-capitalize text-center mt-5">added tasks</h3>
            <table
              className="table mt-3 text-center align-middle text-capitalize"
              data-bs-theme="dark"
            >
              <thead>
                <tr>
                  <th>taskName</th>
                  <th>subName</th>
                  <th>headName</th>
                  <th>day</th>
                  <th>options</th>
                </tr>
              </thead>
              <tbody>
                {tasksList.map((task) => (
                  <tr key={task.id}>
                    <td>{task.task}</td>
                    <td>{task.sub}</td>
                    <td>{task.head}</td>
                    <td>{task.day}</td>
                    <td>
                      <button className="btn btn-danger">delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-success d-block mt-5 w-50 mx-auto">
            confirm
          </button> */}
        </Form>
      </div>
    </section>
  );
};

export default SetupRunTasks;
