
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import './App.css'
import TestAPI from "./components/text_api";
import TestMongo from "./components/test_mongo";
import RequireAuth from "./middleware/RequiredAuth";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Logout from "./components/Logout";
import UserManagement from "./components/UserManagement";


function App() {
  
  return (
    <Routes>
      <Route path="/test_api" element={<TestAPI />} />
      <Route path="/test_mongo" element={<TestMongo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={
        <RequireAuth>
          <Profile />
        </RequireAuth>
      } />
      <Route path="/logout" element={
        <RequireAuth>
          <Logout />
        </RequireAuth>
      } />
      <Route path="/user-management" element={
        <RequireAuth>
          <UserManagement />
        </RequireAuth>
      } />
    </Routes>
  );
}

export default App;
