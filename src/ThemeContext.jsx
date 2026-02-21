import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Default theme (before saving)
  const [theme, setTheme] = useState({
    backgroundColor: "#f5f5f5",
    sidebarColor: "#1e1e1e",
    textColor: "#000000",
  });

  // Load saved colors from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
  }, []);

  // Save theme to localStorage whenever it's updated
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", JSON.stringify(newTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
