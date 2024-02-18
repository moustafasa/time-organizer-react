import { useFetcher } from "react-router-dom";
import { show } from "../components/PopUp/PopUp";

const useDeleteConfirm = (page) => {
  const fetcher = useFetcher();
  const deleteConfirm = (type, ids) => {
    show({
      title: `delete ${type === "multi" || type === "all" ? "heads" : "head"}`,
      body: (
        <p className="text-capitalize">
          are you sure you want to delete{" "}
          {type === "multi"
            ? `selected heads`
            : type === "all"
            ? `all heads`
            : `this head`}
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
