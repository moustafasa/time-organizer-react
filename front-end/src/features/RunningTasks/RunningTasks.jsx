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
  const { data: runTasks } = useGetRunningTasksQuery(dayValue, {
    selectFromResult: ({ data, ...rest }) => ({
      data: getRunTasksIds(data),
      ...rest,
    }),
  });

  // const [deleteMulti] = useDeleteMultiRunTasksMutation();

  // const deleteMultiHandler = async () => {
  //   await deleteMulti(checkedItems);
  //   setCheckedItems([]);
  // };

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

  // return (
  //   <div>
  //     <div className="container">
  //       <h2 className="page-head">running tasks</h2>
  //       <div className="mt-5 d-flex gap-4 align-items-center px-3 flex-wrap flex-sm-nowrap">
  //         <label className="text-nowrap">Showed Day : </label>
  //         <SelectBox
  //           options={[{ text: "all", value: "" }, ...weekDays]}
  //           valueState={[dayValue, setDayValue]}
  //           className="flex-grow-1"
  //         />
  //       </div>
  //       <div className="table-cont">
  //         <table className="custom-table">
  //           <thead>
  //             <tr>
  //               <th>#</th>
  //               <th>id</th>
  //               {dayValue === "" && <th>day</th>}
  //               <th>taskName</th>
  //               <th>headName</th>
  //               <th>subName</th>
  //               <th>progress</th>
  //               <th>subTasksNum</th>
  //               <th>subTasksDone</th>
  //               <th>status</th>
  //               <th>options</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {runTasks.map((task, ind) => (
  //               <Task
  //                 key={task}
  //                 id={task}
  //                 index={ind + 1}
  //                 checked={[checkedItems, setCheckedItems]}
  //                 deleteConfirm={deleteConfirm}
  //               />
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //       <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
  //         <Link
  //           to={`/runningTasks/add?${dayValue && `day=${dayValue}`}`}
  //           className="btn btn-primary text-capitalize"
  //         >
  //           add
  //         </Link>
  //         <button
  //           className="btn btn-danger text-capitalize"
  //           disabled={checkedItems.length === 0}
  //           onClick={() => deleteConfirm(deleteMultiHandler, "multi")}
  //         >
  //           delete
  //         </button>
  //         <button
  //           className="btn btn-danger text-capitalize"
  //           onClick={() =>
  //             deleteConfirm(async (_) => await deleteMulti(runTasks), "all")
  //           }
  //         >
  //           delete all
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default RunningTasks;
