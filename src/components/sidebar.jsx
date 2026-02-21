import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  DoorOpenIcon,
  PersonStandingIcon,
} from "lucide-react";
import logo from "../assets/logo.png";
import "../styles/sidebar.css";

import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Sidebar = () => {
  const location = useLocation();

  const [theme, setTheme] = useState({ sidebar: "#20a117f5" }); // default
  const [userImage, setUserImage] = useState(null);

  // Fetch theme & user image
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Theme
      const themeRef = doc(db, "settings", user.uid);
      const themeSnap = await getDoc(themeRef);
      if (themeSnap.exists()) setTheme(themeSnap.data());

      // User profile image
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserImage(userSnap.data().profileImage || null);
      }
    };

    fetchData();
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Customers", path: "/customers", icon: <Users size={18} /> },
    { name: "Manage User", path: "/ManageUsers", icon: <PersonStandingIcon size={18} /> },
    { name: "Profile", path: "/profile", icon: <PersonStandingIcon size={18} /> },
    { name: "Settings", path: "/settings", icon: <AlertTriangle size={18} /> },
    { name: "Logout", path: "/", icon: <DoorOpenIcon size={18} /> },
  ];

  return (
    <div className="sidebar" style={{ backgroundColor: theme.sidebar }}>
      {/* ===== Logo & Title ===== */}
      <div className="sidebar-header">
        <img src={logo} alt="IMS Logo" className="sidebar-logo" />
        
        {/* ===== User Image ===== */}
        {userImage && (
          <img
            src={userImage}
            alt="User"
            className="sidebar-user-image"
          />
        )}

        <h1>Admin Panel</h1>
      </div>

      {/* ===== Navigation ===== */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
            style={location.pathname === item.path ? { backgroundColor: theme.card } : {}}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* ===== Footer ===== */}
      <div className="sidebar-footer">© {new Date().getFullYear()} IMS</div>
    </div>
  );
};

export default Sidebar;
