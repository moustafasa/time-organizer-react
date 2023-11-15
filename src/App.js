import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import AddTasks from "./features/AddTasks/AddTasks";
import ShowTasks from "./features/ShowTasks/ShowTasks";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element=<div>home</div> />
        <Route path="/addTasks" element=<AddTasks /> />
        <Route path="/showTasks/:showed" element=<ShowTasks /> />
      </Routes>
    </div>
  );
}

export default App;
