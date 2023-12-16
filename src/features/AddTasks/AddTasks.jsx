import React, { useEffect } from "react";
import sass from "./AddTasks.module.scss";
import HeadNum from "./HeadNum/HeadNum";
import StatusBar from "./StatusBar/StatusBar";
import { useDispatch, useSelector } from "react-redux";
import {
  addSubToHead,
  addTaskToSub,
  changeNumberOfHeads,
  clear,
  getHeads,
} from "./AddTasksSlice";
import Inputs from "./Inputs/Inputs";
import {
  Form,
  redirect,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";

export const loader =
  (dispatch) =>
  async ({ request, params }) => {
    const url = new URL(request.url);
    const headId = url.searchParams.get("headId");
    const subId = url.searchParams.get("subId");
    dispatch(clear());
    if (headId && !subId) {
      dispatch(addSubToHead(headId));
    } else if (subId && headId) {
      dispatch(addTaskToSub({ headId, subId }));
    }
    return { headId, subId };
  };

export const action =
  (dispatch) =>
  async ({ request, params }) => {
    const formData = await request.formData();
    const { headNum } = Object.fromEntries(formData);
    if (headNum) return dispatch(changeNumberOfHeads(+headNum));
    else {
      const url = new URL(request.url);
      const headId = url.searchParams.get("headId");
      const subId = url.searchParams.get("subId");

      return subId
        ? redirect(`/showTasks/tasks?headId=${headId}&subId=${subId}`)
        : headId
        ? redirect(`/showTasks/subs?headId=${headId}`)
        : redirect("/showTasks/heads");
    }
  };

const AddTasks = () => {
  const numberOfHeads = useSelector(getHeads);
  const { headId } = useLoaderData();
  return (
    <section className={sass.addTasks}>
      <div className={sass.container + " container"}>
        <h2 className="page-head"> setup your tasks </h2>
        <div className={sass.add}>
          {numberOfHeads.length <= 0 && !headId ? (
            <HeadNum />
          ) : (
            <>
              <StatusBar />
              <Inputs />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AddTasks;
