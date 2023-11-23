import React from "react";
import { useParams } from "react-router-dom";
import ShowHeads from "./ShowHeads/ShowHeads";

const ShowTasks = () => {
  const { showed } = useParams();

  return (
    <section>
      <div className="container">
        <h2 className="page-head"> show {showed} </h2>
        {showed === "heads" ? <ShowHeads /> : null}
      </div>
    </section>
  );
};

export default ShowTasks;
