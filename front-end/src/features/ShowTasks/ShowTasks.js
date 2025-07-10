import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getAllDataIds,
  getAllHeads,
  getAllSubs,
  getElementById,
  useGetHeadsQuery,
  useGetSubsQuery,
  useGetTasksQuery,
} from "./ShowTasksSlice";
import ShowBtns from "./ShowBtns";
import CustomTable from "../../components/customTable/CustomTable";
import TableRow from "../../components/customTable/TableRow";
import useDeleteConfirm from "../../customHooks/useDeleteConfirm";

const ShowTasks = () => {
  const [searchParams] = useSearchParams();
  const keys = [
    { title: "name", edit: true },
    { title: "progress" },
    { title: "subTasksNum", edit: true, editType: "number" },
    { title: "subTasksDone", edit: true, editType: "number" },
  ];
  const [checkedItems, setCheckedItems] = useState([]);
  const deleteConfirm = useDeleteConfirm("tasks");

  const { data } = useGetTasksQuery(Object.fromEntries(searchParams), {
    selectFromResult: ({ data }) => ({
      data: getAllDataIds(data, "tasks"),
    }),
  });

  // btns of show Tasks page
  const showTasksBtns = (args) => (
    <ShowBtns {...args} page={"tasks"} deleteConfirm={deleteConfirm} />
  );

  const selectBoxes = [
    {
      label: "current head",
      name: "headId",
      useGetData: useGetHeadsQuery,
      getDataSelector: getAllHeads,
      extraChangedValue: { subId: "" },
    },
    {
      label: "current sub",
      name: "subId",
      useGetData: useGetSubsQuery,
      getDataSelector: getAllSubs,
      dependencyNames: ["headId"],
    },
  ];

  return (
    <CustomTable
      title={`show tasks`}
      keys={keys}
      addPage="/addTasks"
      checked={[checkedItems, setCheckedItems]}
      deleteConfirm={(type) =>
        deleteConfirm(type, type === "multi" ? checkedItems : data)
      }
      selectBoxes={selectBoxes}
    >
      {data.map((head, ind) => (
        <TableRow
          key={head}
          checked={[checkedItems, setCheckedItems]}
          elementId={head}
          useGetDataFn={useGetTasksQuery}
          getElementById={(data, elementId) =>
            getElementById(data, "tasks", elementId)
          }
          index={ind}
          keys={keys}
          btns={showTasksBtns}
          args={Object.fromEntries(searchParams)}
        />
      ))}
    </CustomTable>
  );
};

export default ShowTasks;
