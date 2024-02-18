import _ from "lodash";
import React from "react";
import { show } from "../../components/PopUp/PopUp";
import { useEditDataMutation } from "./ShowTasksSlice";
import { Link } from "react-router-dom";

const ShowBtns = ({
  editable,
  setEditable,
  elementValue,
  setElementValue,
  editedObject,
  id,
  page,
  element,
}) => {
  const [updateElement] = useEditDataMutation();

  // // show edit confirm modal
  const editConfirm = (handler) => {
    show({
      title: `edit heads`,
      body: <p className="text-capitalize">are you sure to save changes?</p>,
      btn: {
        name: "save",
        handler: handler,
        className: "btn btn-success text-capitalize",
      },
    });
  };

  // event handlers
  const editHandler = async (id, elementValue, setEditable) => {
    await updateElement({ id, page, update: elementValue });
    setEditable(false);
  };

  return !editable ? (
    <>
      <button
        onClick={() => {
          setElementValue(editedObject);
          setEditable(true);
        }}
        className="btn btn-success text-capitalize d-block "
      >
        edit
      </button>
      <button
        className="btn btn-danger text-capitalize d-block"
        // onClick={deleteHandler}
      >
        delete
      </button>
      {page === "tasks" && element?.progress < 100 && (
        <Link
          to={`/runningTasks/add${window.location.search}&taskId=${id}`}
          className="btn btn-primary text-capitalize d-block"
        >
          addToRun
        </Link>
      )}
    </>
  ) : (
    <>
      <button
        onClick={(e) =>
          editConfirm(() => editHandler(id, elementValue, setEditable))
        }
        className={`btn btn-primary text-capitalize d-block`}
        disabled={_.isEqual(elementValue, editedObject)}
      >
        save
      </button>
      <button
        onClick={() => setEditable(false)}
        className="btn btn-secondary text-capitalize d-block"
      >
        cancel
      </button>
    </>
  );
};

export default ShowBtns;
