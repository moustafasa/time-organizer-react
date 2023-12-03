import {
  Outlet,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Header from "./components/Header/Header";
import AddTasks from "./features/AddTasks/AddTasks";
import ShowTasks from "./features/ShowTasks/ShowTasks";
import Nav from "./components/Header/Nav/Nav";
import Content from "./components/Header/Content/Content";

function App() {
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
        { path: "/addTasks", element: <AddTasks /> },
        { path: "/showTasks/:showed", element: <ShowTasks /> },
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
