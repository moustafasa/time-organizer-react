import React, { memo, useEffect, useMemo } from "react";
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
  const options = useMemo(
    () =>
      entities?.length
        ? entities.map((entity, index) => {
            return {
              text: entity.name !== "" ? entity.name : `${label} ${index + 1}`,
              value: entity.id,
            };
          })
        : [{ text: "choose", value: "" }],
    [entities, label]
  );

  useEffect(() => {
    if (!options.find((opt) => opt.value === currentEntity)) {
      dispatch(changeEntity(options[0].value));
    }
  }, [changeEntity, currentEntity, dispatch, options]);

  return (
    <li className={sass.selectCont}>
      <label>{label}</label>
      <SelectBox
        options={options}
        valueState={[
          currentEntity,
          (value) => {
            // it will changed from useChangeScrollValue
            // dispatch(changeEntity(value));
          },
        ]}
        className={sass.SelectBox}
        anchor
      />
    </li>
  );
};

export default memo(StatusSelect);
