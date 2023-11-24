import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ShowHeads from "./ShowHeads/ShowHeads";
import { useDispatch } from "react-redux";
import { fetchData } from "./ShowTasksSlice";

const ShowTasks = () => {
  const { showed } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchData(showed));
  }, [showed]);
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
