import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/regsister";
import Dashboard from "./pages/dashboard";
import Customers from "./pages/customers";
import Issues from "./pages/issues";
import ManageUsers from "./pages/ManageUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import DashboardLayout from "./layout/DashboardLayout";
import Profile from "./pages/profile"; 
import Settings from "./pages/settings"; 

// Notification helpers
import { requestNotificationPermission, listenForMessages } from "./components/notifications";

function App() {
  useEffect(() => {
    // Ask for notification permission on app load
    requestNotificationPermission();
    
    // Listen for messages in foreground
    listenForMessages();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Customers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/issues/:customerId"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Issues />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ManageUsers"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ManageUsers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
