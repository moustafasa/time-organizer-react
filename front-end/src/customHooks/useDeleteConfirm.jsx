import { useFetcher } from "react-router-dom";
import { show } from "../components/PopUp/PopUp";

const useDeleteConfirm = (page) => {
  const fetcher = useFetcher();
  const elementLabel = page === "rTasks" ? "tasks" : page;
  const deleteConfirm = (type, ids) => {
    show({
      title: `delete ${
        type === "multi" || type === "all"
          ? elementLabel
          : elementLabel.slice(0, -1)
      }`,
      body: (
        <p className="text-capitalize">
          are you sure you want to delete{" "}
          {type === "multi"
            ? `selected ${elementLabel}`
            : type === "all"
            ? `all ${page === "rTasks" ? "showed " : ""}${elementLabel}`
            : `this ${elementLabel.slice(0, -1)}${
                page === "rTasks" ? " from running tasks" : ""
              }`}
          ?
        </p>
      ),
      btn: {
        name: "delete",
        className: "btn btn-danger text-capitalize",
        handler: () => {
          fetcher.submit(
            { ids },
            { action: `/delete/${page}`, method: "POST" }
          );
        },
      },
    });
  };
  return deleteConfirm;
};

export default useDeleteConfirm;
