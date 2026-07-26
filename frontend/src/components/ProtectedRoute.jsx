import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, authLoading } = useAppContext();

  if (authLoading) {
    return <div style={{ padding: 24, textAlign: "center" }}>Loading your session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;