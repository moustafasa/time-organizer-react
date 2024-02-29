import {
  Outlet,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import Header from "./components/Header/Header";
import AddTasks, {
  action as addTasksAction,
  loader as addTasksLoader,
} from "./features/AddTasks/AddTasks";
import { useDispatch, useSelector } from "react-redux";
import RunningTasks from "./features/RunningTasks/RunningTasks";
import SetupRunTasks, {
  action as setRunTasksAction,
} from "./features/RunningTasks/SetupRunTasks/SetupRunTasks";
import PopUp from "./components/PopUp/PopUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getOptionsOfWeekDays } from "./features/RunningTasks/functions";
import StartRunTasks from "./features/RunningTasks/StartRunTasks/StartRunTasks";
import Home from "./features/Home/Home";
import SignUp, {
  action as registerAction,
} from "./features/auth/SignUp/SignUp";
import Login, { action as loginAction } from "./features/auth/Login/Login";
import { getCurrentToken, setCredintials } from "./features/auth/authSlice";
import authApiSlice from "./features/auth/authApiSlice";

import ShowTasks from "./features/ShowTasks/ShowTasks";
import ShowHeads from "./features/ShowTasks/ShowHeads";
import ShowSubs from "./features/ShowTasks/showSubs";
import { action as deleteAction } from "./components/deletePage";
import { Spinner } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";

const weekDaysLoader = () => {
  const weekDays = getOptionsOfWeekDays();
  return { weekDays };
};

const proctectedLoader =
  (token) =>
  async ({ request }) => {
    const url = new URL(request.url);
    if (token) {
      return null;
    } else {
      return redirect(`/login?from=${url.pathname}`);
    }
  };

function App() {
  const dispatch = useDispatch();
  const token = useSelector(getCurrentToken);
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    const persist = async () => {
      try {
        const res = await dispatch(
          authApiSlice.endpoints.refresh.initiate(undefined, { track: false })
        ).unwrap();
        dispatch(setCredintials(res));
      } catch (err) {
        console.log(err);
      } finally {
        setRefreshed(true);
      }
    };
    persist();
  }, [dispatch]);

  const router = useCallback(
    () =>
      createBrowserRouter([
        {
          element: (
            <>
              <Header />
              <section id="body">
                <Outlet />
              </section>
              <PopUp />
              <ScrollRestoration
                getKey={(location, matches) => {
                  return location.pathname;
                }}
              />
            </>
          ),
          children: [
            { path: "/", element: <Home /> },

            {
              loader: proctectedLoader(token),
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
            {
              path: "/register",
              element: <SignUp />,
              action: registerAction(dispatch),
            },
            {
              path: "/login",
              element: <Login />,
              action: loginAction(dispatch),
              id: "jsdklfa",
            },
            {
              path: "/deleteOne/:page/:id",
              action: deleteAction(dispatch),
            },
            {
              path: "/delete/:page",
              action: deleteAction(dispatch),
            },
          ],
        },
      ]),
    [dispatch, token]
  );
  return (
    <div className="App">
      {!refreshed ? <Spinner /> : <RouterProvider router={router()} />}
      <ToastContainer />
    </div>
  );
}

export default App;
