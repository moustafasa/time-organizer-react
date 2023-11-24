import React from "react";
import sass from "./ShowHeads.module.scss";
import { useSelector } from "react-redux";
import { getAllHeads } from "../ShowTasksSlice";

const ShowHeads = () => {
  const heads = useSelector(getAllHeads);
  console.log(heads);
  return (
    <div className={sass.tableCont}>
      <table className={sass.table + " " + sass.table}>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>progress</th>
            <th>subNum</th>
            <th>subDone</th>
            <th>taskNum</th>
            <th>taskDone</th>
          </tr>
        </thead>
        <tbody>
          {heads.map((head, index) => (
            <tr key={head.id}>
              <td>{index + 1}</td>
              <td>{head.name}</td>
              <td>100%</td>
              <td>23</td>
              <td>23</td>
              <td>233</td>
              <td>233</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowHeads;
