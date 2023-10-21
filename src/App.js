import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import AddTasks from "./features/AddTasks/AddTasks";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element=<div>home</div> />
        <Route path="/addTasks" element=<AddTasks /> />
      </Routes>
    </div>
  );
}

export default App;
