import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores";

const ProtectedRoute = () => {
  const { isAuthenticated, token } = useAuthStore();

  // Check for token in localStorage as fallback
  const hasToken = token || localStorage.getItem("adminToken");

  if (!hasToken) {
    return <Navigate to="/owner/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
