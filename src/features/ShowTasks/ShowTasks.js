import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllDataIds,
  getAllHeads,
  getAllSubs,
  getElementById,
  useGetHeadsQuery,
  useGetSubsQuery,
  useGetTasksQuery,
} from "./ShowTasksSlice";
import { show } from "../../components/PopUp/PopUp";
import ShowBtns from "./ShowBtns";
import CustomTable from "../../components/customTable/CustomTable";
import TableRow from "../../components/customTable/TableRow";
import useDeleteConfirm from "../../customHooks/useDeleteConfirm";
import useGetOptionsFromData from "../../customHooks/useGetOptionsFromData";

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

  const { data } = useGetTasksQuery(searchParams.toString(), {
    selectFromResult: ({ data }) => ({
      data: getAllDataIds(data, "tasks"),
    }),
  });

  // btns of show Tasks page
  const showTasksBtns = (args) => <ShowBtns {...args} page={"tasks"} />;

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
          index={ind + 1}
          keys={keys}
          btns={showTasksBtns}
        />
      ))}
    </CustomTable>
  );
};

export default ShowTasks;
