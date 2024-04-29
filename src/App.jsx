import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import AddTasks, {
  action as addTasksAction,
  loader as addTasksLoader,
} from "./features/AddTasks/AddTasks";
import { useDispatch } from "react-redux";
import RunningTasks from "./features/RunningTasks/RunningTasks";
import SetupRunTasks, {
  action as setRunTasksAction,
} from "./features/RunningTasks/SetupRunTasks/SetupRunTasks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getOptionsOfWeekDays } from "./features/RunningTasks/functions";
import StartRunTasks from "./features/RunningTasks/StartRunTasks/StartRunTasks";
import Home from "./features/Home/Home";
import SignUp, {
  action as registerAction,
} from "./features/auth/SignUp/SignUp";
import Login, { action as loginAction } from "./features/auth/Login/Login";
import ShowTasks from "./features/ShowTasks/ShowTasks";
import ShowHeads from "./features/ShowTasks/ShowHeads";
import ShowSubs from "./features/ShowTasks/showSubs";
import { action as deleteAction } from "./components/deletePage";
import { useMemo } from "react";
import RequireAuth from "./features/auth/RequireAuth";
import { action as logOutLoader } from "./features/auth/Logout";
import PersistLogin from "./features/auth/PersistLogin";
import LayOut from "./components/LayOut";
import BackToAuth from "./features/auth/BackToAuth";

const weekDaysLoader = () => {
  const weekDays = getOptionsOfWeekDays();
  return { weekDays };
};

function App() {
  const dispatch = useDispatch();

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          element: <PersistLogin />,
          children: [
            {
              path: "/",
              element: <LayOut />,
              children: [
                // public routes
                { index: true, element: <Home /> },

                {
                  element: <BackToAuth />,
                  children: [
                    {
                      path: "/register",
                      element: <SignUp />,
                      action: registerAction(dispatch),
                    },
                    {
                      path: "/login",
                      element: <Login />,
                      action: loginAction(dispatch),
                    },
                  ],
                },

                // protected routes
                {
                  element: <RequireAuth />,
                  children: [
                    {
                      path: "/addTasks",
                      element: <AddTasks />,
                      loader: addTasksLoader(dispatch),
                      action: addTasksAction(dispatch),
                    },

                    {
                      path: "/showTasks/heads",
                      element: <ShowHeads />,
                    },
                    {
                      path: "/showTasks/subs",
                      element: <ShowSubs />,
                    },
                    {
                      path: "/showTasks/tasks",
                      element: <ShowTasks />,
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

                // actions
                {
                  path: "/deleteOne/:page/:id",
                  action: deleteAction(dispatch),
                },
                {
                  path: "/delete/:page",
                  action: deleteAction(dispatch),
                },
                {
                  path: "/logout",
                  action: logOutLoader(dispatch),
                },
              ],
            },
          ],
        },
      ]),
    [dispatch]
  );
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
