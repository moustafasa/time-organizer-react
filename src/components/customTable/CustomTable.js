import React, { useState } from "react";
import SelectBox from "../SelectBox/SelectBox";
import ShowSelects from "./ShowSelects";
import { Link } from "react-router-dom";

// selectBox
// {
//     options,
//     handler: [selectValue, setSelectValue],
//     label,
//     name
//   },
const CustomTable = ({
  title,
  selectBox,
  data,
  keys,
  addPage,
  deleteConfirm,
}) => {
  const [checkedItems, setCheckedItems] = useState([]);
  return (
    <section>
      <div className="container">
        <h2 className="page-head">{title}</h2>
        <div
          className={`text-capitalize d-flex gap-3 align-items-center flex-wrap`}
        >
          {selectBox.map((select, id) => (
            <ShowSelects key={title + id} {...select} />
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
            <tbody>{/* this is body */}</tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
          <Link
            to={`${addPage}?${window.location.search}`}
            className="btn btn-primary text-capitalize"
          >
            add
          </Link>
          <button
            className="btn btn-danger text-capitalize"
            disabled={checkedItems.length === 0}
            onClick={() => deleteConfirm(() => {}, "multi")}
          >
            delete
          </button>
          <button
            className="btn btn-danger text-capitalize"
            onClick={() => deleteConfirm(() => {}, "all")}
          >
            delete all
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomTable;
