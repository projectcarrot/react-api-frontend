
import { Routes, Route } from "react-router-dom";
import './App.css'
import TestAPI from "./components/text_api";
import Item from "./components/item";
import ItemDetail from "./components/ItemDetail";

function App() {
  return (
    <Routes>
      <Route path="/test_api" element={<TestAPI />} />
      <Route path="/item" element={<Item />} />
      <Route path="/items/:id" element={<ItemDetail />} />
    </Routes>
  );
}

export default App;