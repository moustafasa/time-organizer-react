import React from "react";
import sass from "./ShowHeads.module.scss";

const ShowHeads = () => {
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
          <tr>
            <td>1</td>
            <td>programming</td>
            <td>100%</td>
            <td>23</td>
            <td>23</td>
            <td>233</td>
            <td>233</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ShowHeads;
