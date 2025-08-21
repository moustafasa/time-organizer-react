import React, { useCallback } from "react";
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
  dependencyNames = [],
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const args = dependencyNames.length
    ? Object.fromEntries(
        dependencyNames.map((name) => [name, searchParams.get(name)])
      )
    : undefined;

  const { data = [], isError } = useGetData(args, {
    selectFromResult: ({ data, ...rest }) => ({
      data: getDataSelector(data),
      ...rest,
    }),
  });

  const convertToOptions = useGetOptionsFromData();

  const dataOptions = convertToOptions(isError ? [] : data);

  let value;
  let setSelectValue;

  const getNotEmptyObj = useCallback((obj) => {
    if (typeof obj === "object") {
      const notEmptyKeys = Object.keys(obj).filter((key) => !!obj[key]);
      return notEmptyKeys.reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
      }, {});
    }
    return {};
  }, []);

  if (customValue === undefined) {
    value = searchParams.get(name) || defaultValue;
    setSelectValue = (value) => {
      const valueSearchPair = value === "" ? {} : { [name]: value };
      setSearchParams((prev) => {
        const prevObj = Object.fromEntries(prev);
        if (prevObj[name]) {
          delete prevObj[name];
        }
        if (extraChangedValue)
          Object.keys(extraChangedValue).forEach((key) => {
            if (prevObj[key]) delete prevObj[key];
          });

        return {
          ...getNotEmptyObj(prevObj),
          ...valueSearchPair,
          ...getNotEmptyObj(extraChangedValue),
        };
      });
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
