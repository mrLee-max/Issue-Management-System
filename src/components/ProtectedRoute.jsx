import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth(); // get current logged-in user

  // 🔒 If no user is logged in, redirect to login
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // ✅ If logged in, render the protected page
  return children;
};

export default ProtectedRoute;
