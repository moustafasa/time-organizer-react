import {
  Form,
  redirect,
  useRouteLoaderData,
  useSearchParams,
} from "react-router-dom";
import {
  getAllHeads,
  getAllSubs,
  getNotDoneTasks,
  useGetHeadsQuery,
  useGetSubsQuery,
  useGetTasksQuery,
} from "../../ShowTasks/ShowTasksSlice";
import { useAddRunTasksMutation } from "../RunningTasksSlice";
import ShowSelects from "../../../components/customTable/ShowSelects";

export const action = async ({ request, params }) => {
  return redirect("/runningTasks/show");
};

const SetupRunTasks = () => {
  const [searchParams] = useSearchParams();
  const { weekDays } = useRouteLoaderData("runningTasks");
  const day = searchParams.get("day") || weekDays[0].value;
  const [setRunTasks] = useAddRunTasksMutation();

  return (
    <div>
      <div className="container">
        <h2 className="page-head mb-5">setup runTasks</h2>
        <Form
          method="post"
          onSubmit={(e) => {
            setRunTasks({
              ...Object.fromEntries(searchParams),
              day,
            });
          }}
        >
          <div className="d-flex justify-content-center  gap-3 flex-column ">
            <ShowSelects
              label="heads"
              name="headId"
              extraChangedValue={{ taskId: "", subId: "" }}
              useGetData={useGetHeadsQuery}
              getDataSelector={getAllHeads}
            />
            <ShowSelects
              label="subs"
              name="subId"
              extraChangedValue={{ taskId: "" }}
              useGetData={useGetSubsQuery}
              getDataSelector={getAllSubs}
              dependencyNames={["headId"]}
            />
            <ShowSelects
              label="tasks"
              name="taskId"
              useGetData={useGetTasksQuery}
              getDataSelector={getNotDoneTasks}
              dependencyNames={["headId", "subId"]}
            />
            <ShowSelects
              label={"day"}
              name={"day"}
              options={weekDays}
              defaultValue={weekDays[0].value}
            />
          </div>
          <button
            className="btn btn-primary d-block mx-auto mt-5 text-capitalize w-50"
            // onClick={addHandler}
            disabled={!searchParams.get("taskId") || !day}
          >
            add
          </button>
        </Form>
      </div>
    </div>
  );
};

export default SetupRunTasks;
