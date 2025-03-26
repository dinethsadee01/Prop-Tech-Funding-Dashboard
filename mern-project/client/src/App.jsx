import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/Login";
import AdminDashboard from "./pages/AdminDash";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/ad" element={<AdminDashboard/>} />
      <Route path="/notFound" element={<NotFound />} />
    </Routes>
  );
};

export default App;
