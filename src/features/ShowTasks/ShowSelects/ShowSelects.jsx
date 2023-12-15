import React, { useEffect } from "react";
import SelectBox from "../../../components/SelectBox/SelectBox";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchData,
  getAllHeadsEntities,
  getAllSubsEntities,
  useGetDataQuery,
} from "../ShowTasksSlice";
import sass from "./ShowSelects.module.scss";
import { useParams, useSearchParams } from "react-router-dom";

const ShowSelects = () => {
  const { page } = useParams();
  // const heads = useSelector(getAllHeadsEntities);
  // const subs = useSelector(getAllSubsEntities);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const headValue = searchParams.get("headId") || "";
  const subValue = searchParams.get("subId") || "";

  const setHeadValue = (value) => {
    const newParams = { headId: value };
    if (page === "tasks") newParams["subId"] = "";
    setSearchParams(newParams);
  };

  const { data: heads } = useGetDataQuery(
    { page: "heads" },
    {
      selectFromResult: ({ data, ...rest }) => {
        return {
          data: getAllHeadsEntities(data),
          ...rest,
        };
      },
      skip: page === "heads",
    }
  );

  const { data: subs } = useGetDataQuery(
    {
      page: "subs",
      args: { headId: headValue },
    },
    {
      selectFromResult: ({ data, ...rest }) => {
        return {
          data: getAllSubsEntities(data),
          ...rest,
        };
      },
      skip: page !== "tasks",
    }
  );

  const headsOptions = [
    { text: "choose", value: "" },
    ...Object.keys(heads).map((id) => {
      return { text: heads[id].name, value: id };
    }),
  ];
  const setSubValue = async (value) => {
    setSearchParams({ headId: headValue, subId: value });
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
          name="headId"
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
            name="subId"
          />
        </div>
      )}
    </div>
  );
};

export default ShowSelects;
