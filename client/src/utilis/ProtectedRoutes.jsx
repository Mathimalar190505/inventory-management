import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoutes = ({ children, requireRole }) => {
  const { user, token } = useAuth();

  // Not logged in → redirect to login
  if (!user || !token) return <Navigate to="/login" replace />;

  // Role check (if requireRole is provided)
  if (requireRole && !requireRole.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoutes;