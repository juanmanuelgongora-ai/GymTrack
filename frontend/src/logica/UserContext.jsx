import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('gymtrack_token') || null);
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem('gymtrack_user');
      return (saved && saved !== 'undefined') ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const saveSession = (newToken, user) => {
    setToken(newToken);
    setUserData(user);
    localStorage.setItem('gymtrack_token', newToken);
    localStorage.setItem('gymtrack_user', JSON.stringify(user));
  };

  const updateUser = (user) => {
    setUserData(user);
    localStorage.setItem('gymtrack_user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUserData(null);
    localStorage.removeItem('gymtrack_token');
    localStorage.removeItem('gymtrack_user');
    localStorage.removeItem('gymtrack_view');
    localStorage.removeItem('gymtrack_tab');
  };

  return (
    <UserContext.Provider value={{ token, userData, saveSession, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
