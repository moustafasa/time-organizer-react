import React, { useEffect, useState } from "react";
import SelectBox from "../../../components/SelectBox/SelectBox";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentHead,
  changeCurrentSub,
  fetchData,
  getAllHeadsEntities,
  getAllSubsEntities,
  getCurrentHead,
  getCurrentPage,
  getCurrentSub,
} from "../ShowTasksSlice";
import sass from "./ShowSelects.module.scss";

const ShowSelects = () => {
  const page = useSelector(getCurrentPage);
  const heads = useSelector(getAllHeadsEntities);
  const subs = useSelector(getAllSubsEntities);
  const dispatch = useDispatch();

  const headValue = useSelector(getCurrentHead);
  const setHeadValue = (value) => {
    dispatch(changeCurrentHead(value));
  };

  useEffect(() => {
    if (page === "subs") {
      dispatch(fetchData({ page: "heads" }));
    } else if (page === "tasks") {
      dispatch(fetchData({ page: "heads" }));
      dispatch(fetchData({ page: "subs", args: { headId: headValue } }));
    }
  }, [page, dispatch, headValue]);

  const headsOptions = [
    { text: "choose", value: "" },
    ...Object.keys(heads).map((id) => {
      return { text: heads[id].name, value: id };
    }),
  ];
  const subValue = useSelector(getCurrentSub);
  const setSubValue = (value) => {
    dispatch(changeCurrentSub(value));
  };

  const subsOptions = [
    { text: "choose", value: "" },
    ...Object.keys(subs).map((id) => {
      return { text: subs[id].name, value: id };
    }),
  ];

  return (
    <div
      className={`${sass.selects} text-capitalize d-flex gap-3 align-items-center`}
    >
      <div
        className={`${sass.selectCont} d-flex gap-3 px-3 mt-5 align-items-center flex-grow-1`}
      >
        <label>head Name :</label>
        <SelectBox
          className={sass.SelectBox}
          options={headsOptions}
          valueState={[headValue, setHeadValue]}
        />
      </div>
      {page === "tasks" && (
        <div
          className={`${sass.selectCont} d-flex gap-3 px-3 mt-5 align-items-center flex-grow-1`}
        >
          <label>sub Name :</label>
          <SelectBox
            className={sass.SelectBox}
            options={subsOptions}
            valueState={[subValue, setSubValue]}
          />
        </div>
      )}
    </div>
  );
};

export default ShowSelects;
