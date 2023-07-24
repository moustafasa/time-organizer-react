import React, { useReducer, useState } from "react";
import "./Pagination.scss";
import { FaAngleLeft } from "react-icons/fa";

const Pagination = ({ pagesNumber, currentPage, setCurrentPage }) => {
  const [inputPage, setInputPage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const nextHandler = () => {
    if (currentPage < pagesNumber) setCurrentPage(currentPage + 1);
  };
  const previousHandler = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const validateInput = (e) => {
    if (/\d/g.test(e.target.value)) {
      setInputPage(e.target.value);
    } else if (e.target.value === "") {
      setInputPage(e.target.value);
    }
  };

  const goHandler = () => {
    if (+inputPage >= 0 && +inputPage <= pagesNumber) {
      setCurrentPage(+inputPage);
      setErrorMsg("");
    } else {
      setErrorMsg(`يرجى ادخال رقم من 0 الي ${pagesNumber || 0}`);
    }
    setInputPage("");
  };

  return (
    <div className="pagination">
      <div className="btns">
        <button
          className="previous"
          type="button"
          onClick={previousHandler}
          disabled={!currentPage || currentPage === 0}
        >
          السابق
        </button>
        <div className="pagi-info">
          صفحة رقم <span className="number"> {currentPage || 0} </span>
          من <span className="number"> {pagesNumber || 0} </span>
          صفحة
        </div>
        <button
          className="next"
          type="button"
          onClick={nextHandler}
          disabled={currentPage === pagesNumber}
        >
          التالي
        </button>
      </div>
      <div className="inputs">
        <input
          className={errorMsg && "error"}
          type="text"
          value={inputPage}
          onChange={validateInput}
          placeholder="اكتب رقم الصفحة"
          onKeyDown={(e) => {
            e.key === "Enter" && goHandler();
          }}
        />
        <button
          className="go"
          type="button"
          disabled={inputPage === ""}
          onClick={goHandler}
        >
          <FaAngleLeft />
        </button>
        <span className={`errorMsg ${!errorMsg && "hidden"}`}>{errorMsg}</span>
      </div>
    </div>
  );
};

export default Pagination;
