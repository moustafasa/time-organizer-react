import React, { memo, useEffect, useState } from "react";
import "./SelectBox.scss";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Link } from "react-router-dom";

/**
 * @param {options} param0 the options you need to be in select it should be like
    [
        { value: "test", text: "test" },
        { value: "test 2", text: "test 2" },
    ]
 * @param {valueState} param1 the state which will contain choosed value of select and the function * to set the value it should be like [selectValue,setSelect]
 * @returns customize select box
 */
const SelectBox = ({
  as,
  options,
  className,
  valueState: [selectValue, setSelectValue],
  name,
  anchor,
}) => {
  const [optOpenClass, setOptOpenClass] = useState(false);

  const chooseHandler = (e) => {
    e.stopPropagation();
    const li = e.target.closest("li");
    setSelectValue(li.dataset.value);
    setOptOpenClass(false);
  };
  const openOptions = (e) => {
    e.stopPropagation();
    e.currentTarget.parentElement.click();
    setOptOpenClass(!optOpenClass);
  };
  useEffect(() => {
    const blurHandler = (e) => {
      if (!e.target.closest(".select-box")) {
        setOptOpenClass(false);
      }
    };
    document.addEventListener("click", blurHandler);
    return () => document.removeEventListener("click", blurHandler);
  }, []);

  return (
    <div className={`select-box ${className}`}>
      <div className="overlay" onClick={openOptions}>
        {optOpenClass ? (
          <FaCaretUp className="drop-down-icon" />
        ) : (
          <FaCaretDown className="drop-down-icon" />
        )}

        <select
          value={selectValue}
          onChange={(e) => setSelectValue(e.target.value)}
          name={name}
        >
          {options.map((opt, key) => (
            <option key={key} value={opt.value}>
              {opt.text}
            </option>
          ))}
        </select>
      </div>
      <ul className={`options ${!optOpenClass && "hidden"}`}>
        {options.map((opt, key) => (
          <li
            key={key}
            onClick={chooseHandler}
            data-value={opt.value}
            className={`${selectValue === opt.value ? "active" : ""}`}
          >
            {anchor ? <Link to={`#${opt.value}`}>{opt.text}</Link> : opt.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(SelectBox);
