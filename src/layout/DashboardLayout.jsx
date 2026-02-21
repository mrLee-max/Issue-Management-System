import React from "react";
import Sidebar from "../components/sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, background: "#f9fafb", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
