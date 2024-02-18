import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllDataIds,
  getAllHeads,
  getAllHeadsEntities,
  getElementById,
  useGetHeadsQuery,
  useGetSubsQuery,
} from "./ShowTasksSlice";
import { show } from "../../components/PopUp/PopUp";
import ShowBtns from "./ShowBtns";
import CustomTable from "../../components/customTable/CustomTable";
import TableRow from "../../components/customTable/TableRow";
import useDeleteConfirm from "../../customHooks/useDeleteConfirm";

const ShowSubs = () => {
  const [checkedItems, setCheckedItems] = useState([]);
  const deleteConfirm = useDeleteConfirm("subs");

  const navigator = useNavigate();

  const keys = [
    { title: "name", edit: true },
    { title: "progress" },
    { title: "tasksNum" },
    { title: "tasksDone" },
  ];

  const { data } = useGetSubsQuery(window.location.search.slice(1), {
    selectFromResult: ({ data, ...res }) => ({
      data: getAllDataIds(data, "subs"),
      ...res,
    }),
  });

  // btns of show Tasks page
  const showTasksBtns = (args) => <ShowBtns {...args} page={"subs"} />;

  // // go to show tasks of current sub or show subs of current head
  const goToHandler = (elementId) => (e) => {
    if (!e.target.closest("td:last-of-type")) {
      navigator(`/showTasks/tasks${window.location.search}&subId=${elementId}`);
    }
  };

  const selectBoxes = [
    {
      label: "current Head",
      name: "headId",
      useGetData: useGetHeadsQuery,
      getDataSelector: getAllHeads,
    },
  ];

  return (
    <CustomTable
      title={`show subs`}
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
          useGetDataFn={useGetSubsQuery}
          getElementById={(data, elementId) =>
            getElementById(data, "subs", elementId)
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

export default ShowSubs;
