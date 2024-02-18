import React, { useEffect, useState } from "react";
import {
  getElementById,
  useDeleteElementMutation,
  useEditDataMutation,
  useGetHeadsQuery,
} from "../ShowTasksSlice";
import sass from "./ShowData.module.scss";
import _ from "lodash";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { show } from "../../../components/PopUp/PopUp";
import { toast } from "react-toastify";

const ShowData = ({
  elementId,
  index,
  check: [checkedItems, setCheckedItems],
  keys,
  editedKeys,
  deleteConfirm,
}) => {
  // route data
  const { page } = useParams();
  const { args } = useLoaderData();
  const navigator = useNavigate();

  // queries and mutations

  // // edit mutation
  const [updateElement] = useEditDataMutation();

  // // delete mutation
  const [deleteItem] = useDeleteElementMutation();

  // // get data query
  const { data: element = [] } = useGetHeadsQuery(
    { page, args },
    {
      selectFromResult: ({ data, ...rest }) => {
        return {
          data: getElementById(data, page, elementId),
          ...rest,
        };
      },
    }
  );

  // edited objects with {edited key : value of this edited key}
  const editedObject = editedKeys.reduce((obj, curr) => {
    obj[curr] = element[curr];
    return obj;
  }, {});

  // states
  // // is this element is in edit mode
  const [editable, setEditable] = useState(false);

  // // values of edited keys for this element
  const [elementValue, setElementValue] = useState(editedObject);

  // event handlers
  const editHandler = async () => {
    await updateElement({ id: elementId, page, update: elementValue, ...args });
    setEditable(false);
  };

  const deleteHandler = () => {
    deleteConfirm("one", () => deleteItem({ id: elementId, page, ...args }));
  };

  // // choose element by checkBox
  const checkHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems([...checkedItems, e.target.value]);
    } else {
      setCheckedItems(checkedItems.filter((id) => id !== e.target.value));
    }
  };

  // // choose element and check checked box by clicking on row
  const selectHandler = (e) => {
    if (!e.target.closest("td:last-of-type") && !editable) {
      if (checkedItems.includes(elementId)) {
        setCheckedItems(checkedItems.filter((id) => id !== elementId));
      } else {
        setCheckedItems([...checkedItems, elementId]);
      }
    }
  };

  // // go to show tasks of current sub or show subs of current head
  const goToHandler = (e) => {
    if (!e.target.closest("td:last-of-type") && page !== "tasks") {
      navigator(
        `/showTasks/${
          page === "heads"
            ? `subs?headId=${elementId}`
            : `tasks?headId=${element.headId}&subId=${elementId}`
        }`
      );
    }
  };

  // // show edit confirm modal
  const editConfirm = () => {
    show({
      title: `edit ${page.slice(0, -1)}`,
      body: <p className="text-capitalize">are you sure to save changes?</p>,
      btn: {
        name: "save",
        handler: editHandler,
        className: "btn btn-success text-capitalize",
      },
    });
  };

  return (
    <tr onClick={selectHandler} onDoubleClick={goToHandler}>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          value={elementId}
          checked={checkedItems.includes(elementId)}
          onChange={checkHandler}
        />
      </td>
      <td>{index + 1}</td>
      <td>
        {!editable ? (
          element.name
        ) : (
          <input
            type="text"
            className="form-control text-center text-capitalize"
            data-bs-theme="dark"
            value={elementValue.name}
            onChange={(e) =>
              setElementValue({ ...elementValue, name: e.target.value })
            }
          />
        )}
      </td>
      <td>{element.progress}%</td>
      {keys.map((key, index) => (
        <td key={key + index}>
          {editedKeys.includes(key) && editable ? (
            <input
              type="number"
              className="form-control text-center text-capitalize"
              data-bs-theme="dark"
              value={elementValue[key]}
              onChange={(e) =>
                setElementValue({ ...elementValue, [key]: e.target.value })
              }
            />
          ) : (
            element[key]
          )}
        </td>
      ))}
      <td>
        <div
          className={`d-flex gap-3 align-items-center justify-content-center w-100 ${sass.buttonCont}`}
        >
          {!editable ? (
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
                onClick={deleteHandler}
              >
                delete
              </button>
              {page === "tasks" && element.progress < 100 && (
                <Link
                  to={`/runningTasks/add?${new URLSearchParams(
                    args
                  ).toString()}&taskId=${elementId}`}
                  className="btn btn-primary text-capitalize d-block"
                >
                  addToRun
                </Link>
              )}
            </>
          ) : (
            <>
              <button
                onClick={editConfirm}
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
          )}
        </div>
      </td>
    </tr>
  );
};

export default ShowData;
