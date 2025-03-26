import { createBrowserRouter, Navigate } from "react-router-dom";
// import Layout from "../layouts/MainLayout";
// import AuthLayout from "../layouts/AuthLayout";
import AuthLayout from "@/layouts/AuthLayout/index.tsx";
import Layout from "@/layouts/MainLayout/index.tsx";
import Login from "@/pages/auth/login.tsx";
import Strategy from "@/pages/Strategy/index.tsx";
import PrivateRoute from "@/routers/PrivateRouter.tsx";
import PublicRoute from "@/routers/PublichRouter.tsx";
import { lazy } from "react";

const Bots = lazy(() => import("@/pages/Bot/index.tsx"));
// const Login = lazy(() => import("../pages/Login"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/bot" replace />,
      },
      {
        element: <PrivateRoute element={<Bots />} />,
        path: "/bot",
      },
      {
        element: <PrivateRoute element={<Strategy />} />,
        path: "/strategy",
      },
      {
        element: <PrivateRoute element={<h1>huhu </h1>} />,
        path: "/position",
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
