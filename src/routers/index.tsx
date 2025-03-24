import { createBrowserRouter, Navigate } from "react-router-dom";
// import Layout from "../layouts/MainLayout";
// import AuthLayout from "../layouts/AuthLayout";
import AuthLayout from "@/layouts/AuthLayout/index.tsx";
import Layout from "@/layouts/MainLayout/index.tsx";
import Login from "@/pages/auth/login.tsx";
import PublicRoute from "@/routers/PublichRouter.tsx";

// const Bots = lazy(() => import("../pages/Bots"));
// const Login = lazy(() => import("../pages/Login"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true, // Route mặc định khi truy cập "/"
        element: <h1>Trang chủ</h1>,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <PublicRoute element={<Login />} />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
