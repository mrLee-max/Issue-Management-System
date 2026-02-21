import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";

import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer
} from "recharts";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Change to null-safe initial state
  const [theme] = useState(null);

  // 🟦 Fetch Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const issueSnapshot = await getDocs(collection(db, "issues"));
        const customerSnapshot = await getDocs(collection(db, "customers"));
        setIssues(issueSnapshot.docs.map(doc => doc.data()));
        setCustomers(customerSnapshot.docs.map(doc => doc.data()));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  // 🟢 Summary Calculations
  const totalIssues = issues.length;
  const totalCustomers = customers.length;

  const statusCounts = {
    Open: issues.filter(i => i.status === "Open").length,
    Pending: issues.filter(i => i.status === "Pending").length,
    Closed: issues.filter(i => i.status === "Closed").length,
  };

  const priorityCounts = {
    Low: issues.filter(i => i.priority === "Low").length,
    Medium: issues.filter(i => i.priority === "Medium").length,
    High: issues.filter(i => i.priority === "High").length,
    Critical: issues.filter(i => i.priority === "Critical").length,
  };

  const issuesByStatus = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const issuesByPriority = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));

  const issuesOverTime = [
    { date: "Jan", issues: 2 },
    { date: "Feb", issues: 5 },
    { date: "Mar", issues: 3 },
    { date: "Apr", issues: 4 },
  ];

  const COLORS = ["#F87171", "#FACC15", "#4ADE80"];

  // ==========================
  //         RETURN UI
  // ==========================
  return (
    <div className="dashboard" style={{ backgroundColor: theme?.background || "#f9fafb" }}> {/* ✅ fixed */}   
      <main>
        <div className="dashboard-header">
          <div>
            <h1>📊 Dashboard</h1>
            <p>Overview of current system analytics</p>
          </div>

          <div className="header-buttons">
            <button className="refresh-btn" onClick={() => window.location.reload()}>
              Refresh Data
            </button>
          </div>
        </div>

        {/* 📊 Charts */}
        <div className="charts">
          <div className="chart-box" style={{ backgroundColor: theme?.card || "#ffffff" }}> {/* ✅ fixed */}
            <h2>Issues by Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={issuesByStatus} dataKey="value" outerRadius={80} label>
                  {issuesByStatus.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box" style={{ backgroundColor: theme?.card || "#ffffff" }}> {/* ✅ fixed */}
            <h2>Issues by Priority</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={issuesByPriority}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#FB923C" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box" style={{ backgroundColor: theme?.card || "#ffffff" }}> {/* ✅ fixed */}
            <h2>Issue Trends Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={issuesOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="issues" stroke="#FB923C" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🟢 Summary Cards */}
        <div className="cards">
          <div className="card orange" style={{ backgroundColor: theme?.card || "#ffffff" }}> {/* ✅ fixed */}
            <p>Total Issues</p>
            <h2>{totalIssues}</h2>
          </div>

          <div className="card sky" style={{ backgroundColor: theme?.card || "#ffffff" }}> {/* ✅ fixed */}
            <p>Total Customers</p>
            <h2>{totalCustomers}</h2>
          </div>

          <div className="card amber" style={{ backgroundColor: theme?.card || "#ffffff" }}> {/* ✅ fixed */}
            <p>🟡 Pending Issues</p>
            <h2>{statusCounts.Pending}</h2>
          </div>

          <div className="card green" style={{ backgroundColor: theme?.card || "#ffffff" }}> {/* ✅ fixed */}
            <p>🟢 Open Issues</p>
            <h2>{statusCounts.Open}</h2>
          </div>

          <div className="card red" style={{ backgroundColor: theme?.card || "#ffffff" }}> {/* ✅ fixed */}
            <p>🔴 Closed Issues</p>
            <h2>{statusCounts.Closed}</h2>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
