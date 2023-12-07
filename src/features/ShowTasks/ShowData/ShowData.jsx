import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentHead,
  changeCurrentSub,
  deleteItem,
  getCurrentPage,
  // getElementById,
  updateItem,
} from "../ShowTasksSlice";
import sass from "./ShowData.module.scss";
import _ from "lodash";
import { useLoaderData, useNavigate } from "react-router-dom";

const ShowData = ({
  elementId,
  index,
  check: [checkedItems, setCheckedItems],
  keys,
  editedKeys,
}) => {
  const { getElementById } = useLoaderData();
  const currentPage = useSelector(getCurrentPage);
  const element = useSelector((state) => getElementById(state, elementId));

  const editedObject = editedKeys.reduce((obj, curr) => {
    obj[curr] = element[curr];
    return obj;
  }, {});

  const [editable, setEditable] = useState(false);
  const [elementValue, setElementValue] = useState(editedObject);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const editHandler = () => {
    dispatch(updateItem({ id: elementId, update: elementValue }));
    setEditable(false);
  };

  const deleteHandler = () => {
    dispatch(deleteItem(elementId));
  };

  const checkHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems([...checkedItems, e.target.value]);
    } else {
      setCheckedItems(checkedItems.filter((id) => id !== e.target.value));
    }
  };

  const selectHandler = (e) => {
    if (!e.target.closest("td:last-of-type")) {
      if (checkedItems.includes(elementId)) {
        setCheckedItems(checkedItems.filter((id) => id !== elementId));
      } else {
        setCheckedItems([...checkedItems, elementId]);
      }
    }
  };

  const goToHandler = (e) => {
    if (!e.target.closest("td:last-of-type") && currentPage !== "tasks") {
      navigator(
        `/showTasks/${
          currentPage === "heads"
            ? `subs?headId=${elementId}`
            : `tasks?headId=${element.headId}&subId=${elementId}`
        }`
      );
    }
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
            </>
          ) : (
            <>
              <button
                onClick={editHandler}
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
