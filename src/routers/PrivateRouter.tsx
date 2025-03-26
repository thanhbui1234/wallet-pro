import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: JSX.Element;
}

export default function PrivateRoute({ element }: PrivateRouteProps) {
  const storedToken = localStorage.getItem("token");

  if (storedToken === null) {
    return <Navigate to="/login" replace />;
  }

  return element;
}
