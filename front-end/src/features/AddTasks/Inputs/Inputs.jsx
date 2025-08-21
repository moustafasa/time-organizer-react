import { useDispatch, useSelector } from "react-redux";
import {
  changeNumberOfHeads,
  getHeads,
  getHeadsLoadingStatus,
  useAddAllMutation,
} from "../AddTasksSlice";

import "./Inputs.scss";

import HeadInput from "./Head/HeadInput";
import { Form, useLoaderData } from "react-router-dom";
import AddFieldButton from "../../../components/AddFieldButton/AddFieldButton";
import Spinner from "../../../components/Spinner/Spinner";

const Inputs = () => {
  const headsIds = useSelector(getHeads);
  const { headId } = useLoaderData();
  const [addAll] = useAddAllMutation();
  const dispatch = useDispatch();
  const loadingStatus = useSelector(getHeadsLoadingStatus);

  return (
    <Form onSubmit={addAll} method="post" className={"inputs"}>
      {headsIds.map((headId, index) => (
        <HeadInput key={headId} id={headId} index={index + 1} />
      ))}

      {!headId && !loadingStatus && (
        <div style={{ marginTop: "50px" }}>
          <AddFieldButton
            onClick={(e) => dispatch(changeNumberOfHeads(1))}
            type="plus"
          />
        </div>
      )}

      {loadingStatus && (
        <div style={{ marginTop: "50px" }}>
          <Spinner size="small" showLabel label="heads loading" />
        </div>
      )}

      <button className="submit-button" type="submit" disabled={loadingStatus}>
        add
      </button>
    </Form>
  );
};

export default Inputs;
