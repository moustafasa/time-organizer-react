import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Header from "./components/Header/Header";
import AddTasks, {
  action as addTasksAction,
  loader as addTasksLoader,
} from "./features/AddTasks/AddTasks";
import ShowTasks, {
  loader as showTasksLoader,
} from "./features/ShowTasks/ShowTasks";
import { useDispatch } from "react-redux";
import RunningTasks from "./features/RunningTasks/RunningTasks";
import SetupRunTasks, {
  loader as setRunTasksLoader,
  action as setRunTasksAction,
} from "./features/RunningTasks/SetupRunTasks/SetupRunTasks";
import PopUp from "./components/PopUp/PopUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getOptionsOfWeekDays } from "./features/RunningTasks/functions";
import StartRunTasks from "./features/RunningTasks/StartRunTasks/StartRunTasks";

const weekDaysLoader = () => {
  const weekDays = getOptionsOfWeekDays();
  return { weekDays };
};

function App() {
  const dispatch = useDispatch();

  const router = createBrowserRouter([
    {
      element: (
        <>
          <Header />
          <Outlet />
        </>
      ),
      children: [
        { path: "/", element: <div>home</div> },
        {
          path: "/addTasks",
          element: <AddTasks />,
          loader: addTasksLoader(dispatch),
          action: addTasksAction(dispatch),
        },
        {
          path: "/showTasks/:page",
          element: <ShowTasks />,
          loader: showTasksLoader(dispatch),
        },
        {
          path: "/runningTasks",
          element: <Outlet />,
          id: "runningTasks",
          loader: weekDaysLoader,
          children: [
            {
              path: "show",
              element: <RunningTasks />,
            },
            {
              path: "add",
              element: <SetupRunTasks />,
              loader: setRunTasksLoader,
              action: setRunTasksAction,
            },
            {
              path: "start",
              element: <StartRunTasks />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
      <PopUp />
      <ToastContainer />
    </div>
  );
}

export default App;
