import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: React.ReactNode;
}

export default function PrivateRoute({ element }: PrivateRouteProps) {
  const storedToken = localStorage.getItem("token");

  return storedToken ? element : <Navigate to="/login" replace />;
}
