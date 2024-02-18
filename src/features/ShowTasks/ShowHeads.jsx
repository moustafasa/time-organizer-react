import React, { useState } from "react";
import CustomTable from "../../components/customTable/CustomTable";
import {
  getAllDataIds,
  getElementById,
  useGetHeadsQuery,
} from "./ShowTasksSlice";
import TableRow from "../../components/customTable/TableRow";
import ShowBtns from "./ShowBtns";
import { useNavigate } from "react-router-dom";
import useDeleteConfirm from "../../customHooks/useDeleteConfirm";

const ShowHeads = () => {
  const [checkedItems, setCheckedItems] = useState([]);
  const deleteConfirm = useDeleteConfirm("heads");

  const navigator = useNavigate();

  const keys = [
    { title: "name", edit: true },
    { title: "progress" },
    { title: "subNum" },
    { title: "subDone" },
    { title: "tasksNum" },
    { title: "tasksDone" },
  ];

  const { data } = useGetHeadsQuery(undefined, {
    selectFromResult: ({ data, ...res }) => ({
      data: getAllDataIds(data, "heads"),
      ...res,
    }),
  });

  // btns of show Tasks page
  const showTasksBtns = (args) => (
    <ShowBtns {...args} deleteConfirm={deleteConfirm} page={"heads"} />
  );

  // // go to show tasks of current sub or show subs of current head
  const goToHandler = (elementId) => (e) => {
    if (!e.target.closest("td:last-of-type")) {
      navigator(`/showTasks/subs?headId=${elementId}`);
    }
  };

  return (
    <CustomTable
      title={`show heads`}
      keys={keys}
      addPage="/addTasks"
      checked={[checkedItems, setCheckedItems]}
      deleteConfirm={(type) =>
        deleteConfirm(type, type === "multi" ? checkedItems : data)
      }
    >
      {data.map((head, ind) => (
        <TableRow
          key={head}
          checked={[checkedItems, setCheckedItems]}
          elementId={head}
          useGetDataFn={useGetHeadsQuery}
          getElementById={(data, elementId) =>
            getElementById(data, "heads", elementId)
          }
          index={ind + 1}
          keys={keys}
          btns={showTasksBtns}
          goToHandler={goToHandler(head)}
        />
      ))}
    </CustomTable>
  );
};

export default ShowHeads;
