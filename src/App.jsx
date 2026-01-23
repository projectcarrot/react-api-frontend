
import { Routes, Route } from "react-router-dom";
import './App.css'
import TestAPI from "./components/text_api";

function App() {
  return (
    <Routes>
      <Route path="/test_api" element={<TestAPI />} />
    </Routes>
  );
}

export default App;