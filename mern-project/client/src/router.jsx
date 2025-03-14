import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/Login";

const router = createBrowserRouter([
    { path: "/", element: <Dashboard /> },
    { path: "/admin", element: <AdminLogin /> }
]);

export default router;
