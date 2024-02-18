import React, { useEffect, useState } from "react";
import SelectBox from "../SelectBox/SelectBox";
import { useSearchParams } from "react-router-dom";
import useGetOptionsFromData from "../../customHooks/useGetOptionsFromData";

const ShowSelects = ({
  label,
  options,
  name,
  extraChangedValue,
  useGetData = () => ({}),
  getDataSelector = () => ({}),
  customControl: [customValue, setCustomValue] = [],
  defaultValue = "",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data = [] } = useGetData(searchParams.toString(), {
    selectFromResult: ({ data, ...rest }) => ({
      data: getDataSelector(data),
      ...rest,
    }),
  });

  const convertToOptions = useGetOptionsFromData();

  const dataOptions = convertToOptions(data);

  let value;
  let setSelectValue;

  if (customValue === undefined) {
    value = searchParams.get(name) || defaultValue;
    setSelectValue = (value) => {
      setSearchParams((prev) => ({
        ...Object.fromEntries(prev),
        [name]: value,
        ...extraChangedValue,
      }));
    };
  } else {
    value = customValue;
    setSelectValue = setCustomValue;
  }

  return (
    <div
      className={`d-flex gap-3 px-3 mt-5 align-items-center flex-grow-1  flex-sm-nowrap flex-wrap`}
    >
      <label className="text-nowrap">{label}</label>
      <SelectBox
        options={options ? options : dataOptions}
        valueState={[value, setSelectValue]}
        name={name}
      />
    </div>
  );
};

export default ShowSelects;
