import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/Login";

const router = createBrowserRouter([
    { path: "/", element: <Dashboard /> },
    { path: "/admin", element: <AdminLogin /> },
    { path: "/ad", element: <AdminDashboard /> }
]);

export default router;
