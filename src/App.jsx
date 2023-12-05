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
  action as showTasksAction,
} from "./features/ShowTasks/ShowTasks";
import Nav from "./components/Header/Nav/Nav";
import Content from "./components/Header/Content/Content";
import { useDispatch } from "react-redux";

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
