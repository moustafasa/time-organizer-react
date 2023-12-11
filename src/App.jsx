import {
  Outlet,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Header from "./components/Header/Header";
import AddTasks, {
  action as addTasksAction,
  loader as addTasksLoader,
} from "./features/AddTasks/AddTasks";
import ShowTasks, {
  loader as showTasksLoader,
} from "./features/ShowTasks/ShowTasks";
import Nav from "./components/Header/Nav/Nav";
import Content from "./components/Header/Content/Content";
import { useDispatch } from "react-redux";
import RunningTasks, {
  loader as runningTasksLoader,
} from "./features/RunningTasks/RunningTasks";
import SetupRunTasks, {
  loader as setRunTasksLoader,
  action as setRunTasksAction,
} from "./features/RunningTasks/SetupRunTasks/SetupRunTasks";

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
          children: [
            {
              path: "show/:page",
              element: <RunningTasks />,
              loader: runningTasksLoader(dispatch),
            },
            {
              path: "add",
              element: <SetupRunTasks />,
              loader: setRunTasksLoader,
              action: setRunTasksAction,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
