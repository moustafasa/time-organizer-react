import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import { FaBeer } from "react-icons/fa";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <FaBeer />
        <Header />
      </BrowserRouter>
    </div>
  );
}

export default App;
