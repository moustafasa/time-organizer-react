import React, { useState } from "react";
import SelectBox from "../../../components/SelectBox/SelectBox";
import axios from "axios";
import {
  Form,
  redirect,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";

export const loader = async ({ request, params }) => {
  const url = new URL(request.url);
  const head = url.searchParams.get("headId");
  const sub = url.searchParams.get("subId");

  const headRes = await axios.get("http://localhost:3000/heads");
  let subRes, taskRes;
  subRes = taskRes = { data: [] };

  if (head) {
    subRes = await axios.get(`http://localhost:3000/subs?headId=${head}`);
  }

  if (sub) {
    taskRes = await axios.get(
      `http://localhost:3000/tasks?headId=${head}&subId=${sub}`
    );
  }

  const getWeekDays = () => {
    const date = new Date();
    const days = [
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ];

    const nowDay = date.getDay() === 6 ? 0 : date.getDay() + 1;

    if (nowDay < 6) {
      return days.slice(nowDay);
    } else {
      return ["friday", ...days];
    }
  };

  const weekDays = getWeekDays();

  return {
    weekDays: weekDays.map((day, index) => {
      const date = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      );

      if (index !== 0) {
        date.setDate(date.getDate() + index);
      }
      const value = date.toDateString();

      return { text: day, value: value };
    }),
    heads: [
      { text: "choose", value: "" },
      ...headRes.data.map((head) => {
        return { text: head.name, value: head.id };
      }),
    ],
    subs: [
      { text: "choose", value: "" },
      ...subRes.data.map((head) => {
        return { text: head.name, value: head.id };
      }),
    ],
    tasks: [
      { text: "choose", value: "" },
      ...taskRes.data.map((head) => {
        return { text: head.name, value: head.id };
      }),
    ],
  };
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const res = await axios.post(`http://localhost:3000/runningTasks`, { data });

  return redirect("/runningTasks/show/week");
};

const SetupRunTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // const [tasksList, setTasksList] = useState([]);
  const { heads, subs, tasks, weekDays } = useLoaderData();
  const dayValueState = useState(weekDays[0].text);

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
  //         day: dayValueState[0],
  //       },
  //     ]);
  //   setSelectValue("task")("");
  // };

  return (
    <section>
      <div className="container">
        <h2 className="page-head mb-5">setup runTasks</h2>
        <Form method="post">
          <div className="d-flex justify-content-center  gap-3 flex-column ">
            <fieldset className="row gap-1 align-items-center text-capitalize  ">
              <label className="col-md-1 col-12 text-center text-md-start  mb-2 mb-md-0 ">
                heads
              </label>
              <SelectBox
                valueState={valueState("head")}
                className="col"
                options={heads}
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
                options={subs}
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
                options={tasks}
                name="task"
              />
            </fieldset>
            <fieldset className="row gap-1 align-items-center text-capitalize ">
              <label className="col-md-1 col-12 text-center text-md-start  mb-2 mb-md-0 ">
                day
              </label>
              <SelectBox
                className="col"
                valueState={dayValueState}
                options={weekDays}
                name="day"
              />
            </fieldset>
          </div>
          <button
            className="btn btn-primary d-block mx-auto mt-5 text-capitalize w-50"
            // onClick={addHandler}
            disabled={!searchParams.get("taskId") || !dayValueState[0]}
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
