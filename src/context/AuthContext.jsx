import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // 🔹 Fetch user role
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserRole(userSnap.data().role);
          }
        } catch (err) {
          console.error("Failed to fetch user role:", err);
        }

        // 🔹 Fetch theme settings
        try {
          const settingsRef = doc(db, "settings", user.uid);
          const settingsSnap = await getDoc(settingsRef);

          if (settingsSnap.exists()) {
            setTheme(settingsSnap.data().theme || "light");
          }
        } catch (err) {
          console.error("Failed to fetch theme:", err);
        }
      } else {
        // Reset on logout
        setUserRole(null);
        setTheme("light");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🔹 Apply theme globally
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <AuthContext.Provider value={{ currentUser, userRole, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
