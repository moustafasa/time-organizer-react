import React, { useState } from "react";
import sass from "./HeadNum.module.scss";
import InputBox from "../../../components/InputBox/InputBox";
import { useFetcher } from "react-router-dom";

const HeadNum = () => {
  const fetcher = useFetcher();
  const [numberOfHeads, setNumberOfHeads] = useState(0);

  return (
    <fetcher.Form
      method="post"
      className={sass.headNum + " input-box"}
      onSubmit={(e) => {
        if (numberOfHeads <= 0) e.preventDefault();
      }}
    >
      <InputBox
        type="number"
        label="number of heads"
        value={numberOfHeads}
        setValue={setNumberOfHeads}
        name="headNum"
      />
      <button className="start" type="submit">
        start
      </button>
    </fetcher.Form>
  );
};

export default HeadNum;
