import React, { memo } from "react";
import SelectBox from "../../../components/SelectBox/SelectBox";
import { useDispatch } from "react-redux";

const StatusSelect = ({
  entities,
  currentEntity,
  changeEntity,
  label,
  sass,
}) => {
  const dispatch = useDispatch();
  const options = [
    { text: "choose", value: "" },
    ...entities.map((entity, index) => {
      return {
        text: entity.name !== "" ? entity.name : `${label} ${index + 1}`,
        value: entity.id,
      };
    }),
  ];

  return (
    <li className={sass.selectCont}>
      <label>{label}</label>
      <SelectBox
        options={options}
        valueState={[
          currentEntity,
          (value) => {
            dispatch(changeEntity(value));
          },
        ]}
        className={sass.SelectBox}
      />
    </li>
  );
};

export default memo(StatusSelect);
