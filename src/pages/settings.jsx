import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "../styles/settings.css";

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const user = auth.currentUser;

  // 🔵 Fetch saved theme
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "settings", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setTheme(snap.data().theme || "light");
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };

    fetchSettings();
  }, [user]);

  // 🟢 Save theme
  const saveTheme = async () => {
    if (!user) return;

    try {
      await setDoc(
        doc(db, "settings", user.uid),
        { theme },
        { merge: true }
      );
      alert("Theme updated!");
    } catch (err) {
      console.error("Failed to save theme", err);
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      {/* THEME SECTION */}
      <div className="settings-section">
        <h3>Theme</h3>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

        <button onClick={saveTheme} className="save-btn">
          Save Theme
        </button>
      </div>

      {/* PROFILE SECTION (UI only for now) */}
      <div className="settings-section">
        <h3>Profile</h3>
        <button className="edit-btn">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Settings;
