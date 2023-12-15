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
import { useLoaderData, useSearchParams } from "react-router-dom";

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
      />

      <div className={sass.subjects}>
        {subs.map((sub, index) => (
          <SubInput key={sub} id={sub} index={index + 1} />
        ))}
        {!subId && (
          <button
            className="input-modify-btn plus-btn"
            onClick={(e) =>
              dispatch(changeNumberOfSubs({ num: 1, headId: id }))
            }
            type="button"
            title="add Sub"
          >
            +
          </button>
        )}
      </div>
      {!head.readOnly && (
        <button
          className="input-modify-btn minus-btn"
          title={`remove head ${index}`}
          onClick={(e) => dispatch(removeHead(id))}
          type="button"
        >
          -
        </button>
      )}
    </div>
  );
};

export default memo(HeadInput);
