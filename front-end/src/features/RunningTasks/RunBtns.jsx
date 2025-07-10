import { isSameDay } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";

const RunBtns = ({ id, element, deleteConfirm }) => {
  return (
    <>
      <button
        className="btn btn-danger text-capitalize d-block"
        onClick={() => deleteConfirm("one", [id])}
      >
        delete
      </button>
      {isSameDay(new Date(element.day), new Date()) && !element.done && (
        <Link
          className="btn btn-primary text-capitalize d-block"
          to={`/runningTasks/start?taskId=${id}`}
        >
          start
        </Link>
      )}
    </>
  );
};

export default RunBtns;
