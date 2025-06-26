import { useDispatch, useSelector } from "react-redux";
import {
  changeCurrentHead,
  changeNumberOfSubs,
  getCurrentHead,
  getHeadById,
  getSubsOfHead,
  removeHead,
  updateHead,
} from "../../AddTasksSlice";
import { memo, useRef } from "react";
import useScrollChangeValue from "../../../../customHooks/useChangeScrollValue/useChangeScrollValue";
import InputBox from "../../../../components/InputBox/InputBox";
import SubInput from "../Sub/SubInput";
import sass from "./HeadInput.module.scss";
import { useLoaderData } from "react-router-dom";
import AddFieldButton from "../../../../components/AddFieldButton/AddFieldButton";

const HeadInput = ({ id, index }) => {
  const head = useSelector((state) => getHeadById(state, id));
  const subs = useSelector((state) => getSubsOfHead(state, id));
  const { subId } = useLoaderData();
  const dispatch = useDispatch();
  const setHeadName = (value) =>
    dispatch(updateHead({ id, changes: { name: value } }));
  const headRef = useRef();

  useScrollChangeValue(id, changeCurrentHead, headRef, getCurrentHead);

  return (
    <div className={sass.headCont} ref={headRef} id={id}>
      <InputBox
        label={`head ${index}`}
        type="text"
        value={head.name}
        setValue={setHeadName}
        readOnly={head.readOnly}
        onFocus={() => headRef.current.scrollIntoView()}
      />

      <div className={sass.subjects}>
        {subs.map((sub, index) => (
          <SubInput
            key={sub}
            id={sub}
            index={index + 1}
            last={index === subs.length - 1}
          />
        ))}
        {!subId && (
          <AddFieldButton
            onClick={(e) =>
              dispatch(changeNumberOfSubs({ num: 1, headId: id }))
            }
            type={"plus"}
            title={"add Sub"}
          />
        )}
      </div>
      {!head.readOnly && (
        <AddFieldButton
          title={`remove head ${index}`}
          type={"minus"}
          onClick={(e) => dispatch(removeHead(id))}
        />
      )}
    </div>
  );
};

export default memo(HeadInput);
