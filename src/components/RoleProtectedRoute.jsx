import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!currentUser) return <Navigate to="/" />;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />; // redirect unauthorized users
  }

  return children;
};

export default RoleProtectedRoute;
