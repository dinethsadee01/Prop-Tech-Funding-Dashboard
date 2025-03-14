import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/admin" element={<AdminLogin />} />
    </Routes>
  );
};

export default App;
