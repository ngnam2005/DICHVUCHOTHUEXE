// components/darkScreen.js
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const colors = isDarkMode
    ? {
        background: '#121212',
        text: '#ffffff',
        border: '#333',
        logout: '#ff4d4f',
      }
    : {
        background: '#f9f9f9',
        text: '#000000',
        border: '#ddd',
        logout: '#ff4d4f',
      };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
