import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react/jsx-runtime";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, roles } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but lacking the right role → send to “Unauthorized” page
  if (!roles.some((r) => allowedRoles.includes(r))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3) render the child route/component
  return children;
};

export default ProtectedRoute;
