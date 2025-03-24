import { JSX } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ element }: { element: JSX.Element }) => {
  const storedToken = localStorage.getItem("token");

  return !storedToken ? <Navigate to="/" replace /> : element;
};

export default PublicRoute;
