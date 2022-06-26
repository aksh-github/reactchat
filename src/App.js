import logo from "./logo.svg";
import "./App.css";
import UIComponent from "./UIComponent";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<UIComponent />} />
        <Route path="/room/:room" element={<UIComponent />} />
      </Routes>
      <UIComponent />
    </div>
  );
}

export default App;
