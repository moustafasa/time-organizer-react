import React, { useState } from "react";
import {
  changeCurrentDay,
  getCurrentDay,
  getRunTaskById,
  getRunTasksIds,
  useGetRunningTasksQuery,
} from "./RunningTasksSlice";
import { useRouteLoaderData } from "react-router-dom";
import { getOptionsOfWeekDays } from "./functions";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../components/customTable/CustomTable";
import TableRow from "../../components/customTable/TableRow";
import { format } from "date-fns";
import RunBtns from "./RunBtns";
import useDeleteConfirm from "../../customHooks/useDeleteConfirm";

export const loader = () => {
  return {
    weekDays: getOptionsOfWeekDays(),
  };
};

const RunningTasks = () => {
  const { weekDays } = useRouteLoaderData("runningTasks");
  const [checkedItems, setCheckedItems] = useState([]);
  const dayValue = useSelector(getCurrentDay);
  const dispatch = useDispatch();
  const setDayValue = (value) => dispatch(changeCurrentDay(value));
  const { data: runTasks, isLoading } = useGetRunningTasksQuery(dayValue, {
    selectFromResult: ({ data, ...rest }) => ({
      data: getRunTasksIds(data),
      ...rest,
    }),
  });

  const deleteConfirm = useDeleteConfirm("rTasks");

  const keys = [
    { title: "taskName", name: "name" },
    { title: "headName" },
    { title: "subName" },
    { title: "progress" },
    { title: "subTasksNum" },
    { title: "subTasksDone" },
    {
      title: "status",
      name: "done",
      func: (value) => (value ? "done" : "not done"),
    },
  ];

  if (!dayValue) {
    keys.unshift({
      title: "day",
      func: (value) => {
        if (value) return format(new Date(value), "eeee");
      },
    });
  }

  const selectBoxes = [
    {
      label: "showed day : ",
      options: [{ text: "all", value: "" }, ...weekDays],
      name: "day",
      customControl: [dayValue, setDayValue],
    },
  ];

  const showRunBtns = (args) => (
    <RunBtns {...args} deleteConfirm={deleteConfirm} />
  );

  return (
    <CustomTable
      title={`running tasks`}
      keys={keys}
      addPage={`/runningTasks/add?day=${dayValue}`}
      checked={[checkedItems, setCheckedItems]}
      deleteConfirm={(type) =>
        deleteConfirm(type, type === "multi" ? checkedItems : runTasks)
      }
      selectBoxes={selectBoxes}
      empty={runTasks.length <= 0}
      isLoading={isLoading}
    >
      {runTasks.map((task, ind) => (
        <TableRow
          key={task}
          checked={[checkedItems, setCheckedItems]}
          elementId={task}
          useGetDataFn={useGetRunningTasksQuery}
          getElementById={getRunTaskById}
          index={ind}
          keys={keys}
          btns={showRunBtns}
          args={dayValue}
        />
      ))}
    </CustomTable>
  );
};

export default RunningTasks;
