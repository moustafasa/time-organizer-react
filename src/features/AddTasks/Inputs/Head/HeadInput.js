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
import { useRef } from "react";
import useScrollChangeValue from "../../../../customHooks/useChangeScrollValue/useChangeScrollValue";
import InputBox from "../../../../components/InputBox/InputBox";
import SubInput from "../Sub/SubInput";
import sass from "./HeadInput.module.scss";

const HeadInput = ({ id, index }) => {
  const headName = useSelector((state) => getHeadById(state, id).name);
  const subs = useSelector((state) => getSubsOfHead(state, id));
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
        value={headName}
        setValue={setHeadName}
      />
      <div className={sass.subjects}>
        {subs.map((sub, index) => (
          <SubInput key={sub} id={sub} index={index + 1} />
        ))}
        <button
          className="input-modify-btn plus-btn"
          onClick={(e) => dispatch(changeNumberOfSubs({ num: 1, headId: id }))}
          title="add Sub"
        >
          +
        </button>
      </div>
      <button
        className="input-modify-btn minus-btn"
        title={`remove head ${index}`}
        onClick={(e) => dispatch(removeHead(id))}
      >
        -
      </button>
    </div>
  );
};

export default HeadInput;
