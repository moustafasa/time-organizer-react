import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ShowSelects from "./ShowSelects";

const CustomTable = ({
  title,
  keys,
  addPage,
  deleteConfirm,
  children,
  checked: [checkedItems, setCheckedItems],
  selectBoxes = [],
}) => {
  // uncheck tr on blur
  useEffect(() => {
    const unCheckOnBlurHandler = (e) => {
      if (!e.target.closest("table") && !e.target.closest("button")) {
        setCheckedItems([]);
      }
    };
    if (checkedItems.length > 0) {
      document.addEventListener("click", unCheckOnBlurHandler);
    }
    return () => {
      document.removeEventListener("click", unCheckOnBlurHandler);
    };
  }, [checkedItems, setCheckedItems]);

  return (
    <div>
      <div className="container">
        <h2 className="page-head">{title}</h2>
        <div
          className={`text-capitalize d-flex gap-3 align-items-center flex-wrap`}
        >
          {selectBoxes.map((select, id) => (
            <ShowSelects key={id + select.name} {...select} />
          ))}
        </div>
        <div className="table-cont">
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>id</th>
                {keys.map((key) => (
                  <th key={title + key.title}>{key.title}</th>
                ))}
                <th>options</th>
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
          <Link
            to={`${addPage}${window.location.search}`}
            className="btn btn-primary text-capitalize"
          >
            add
          </Link>
          <button
            className="btn btn-danger text-capitalize"
            disabled={checkedItems.length === 0}
            onClick={() => deleteConfirm("multi")}
          >
            delete
          </button>
          <button
            className="btn btn-danger text-capitalize"
            onClick={() => deleteConfirm("all")}
          >
            delete all
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
