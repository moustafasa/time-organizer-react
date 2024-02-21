import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const TableRow = ({
  checked: [checkedItems, setCheckedItems],
  elementId,
  useGetDataFn,
  getElementById,
  index,
  keys,
  btns = () => {},
  goToHandler,
  args,
}) => {
  // get element by id
  const { element = {} } = useGetDataFn(args, {
    selectFromResult: ({ data, ...rest }) => ({
      element: getElementById(data, elementId),
      ...rest,
    }),
  });

  // handlers

  // // choose tr by click handler
  const selectHandler = (e) => {
    if (!e.target.closest("td:last-of-type") && !editable) {
      if (checkedItems.includes(elementId)) {
        setCheckedItems(checkedItems.filter((id) => id !== elementId));
      } else {
        setCheckedItems([...checkedItems, elementId]);
      }
    }
  };

  // // choose tr by check box checked handler
  const checkHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems([...checkedItems, e.target.value]);
    } else {
      setCheckedItems(checkedItems.filter((id) => id !== e.target.value));
    }
  };

  // edited objects with {edited key : value of this edited key}
  const editedObject = keys.reduce((obj, key) => {
    if (key.edit) obj[key.name || key.title] = element[key.name || key.title];
    return obj;
  }, {});

  // states

  // // is this field is editable or not
  const [editable, setEditable] = useState(false);

  // // values of fields with edit:true
  const [elementValue, setElementValue] = useState(editedObject);

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
      {keys.map((key) => (
        <td key={key.title + elementId}>
          {/* check if this td is editable and is in edit mode to show input instead of text */}
          {key.edit && editable ? (
            <input
              type={key.editType || "text"}
              className="form-control text-center text-capitalize"
              data-bs-theme="dark"
              value={elementValue[key.name || key.title]}
              onChange={(e) =>
                setElementValue({
                  ...elementValue,
                  [key.name || key.title]:
                    key.editType === "number"
                      ? +e.target.value
                      : e.target.value,
                })
              }
            />
          ) : key.func ? (
            key.func(element[key.name || key.title])
          ) : (
            element[key.name || key.title]
          )}
        </td>
      ))}
      <td>
        <div
          className={`d-flex gap-3 align-items-center justify-content-center w-100 `}
        >
          {btns({
            editable,
            setEditable,
            elementValue,
            setElementValue,
            editedObject,
            id: elementId,
            element,
          })}
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
