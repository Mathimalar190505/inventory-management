import { useContext } from "react";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // Load user from localStorage when app starts
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("pos-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

//   const [token, setToken] = useState(() => {
//     return localStorage.getItem("pos-token") || null;
//   });

  // 🔐 Login function
  const login = (userData, token) => {
    setUser(userData);
    // setToken(token);

    localStorage.setItem("pos-user", JSON.stringify(userData));
    localStorage.setItem("pos-token", token);
  };

  // 🚪 Logout function
  const logout = () => {
    setUser(null);
    // setToken(null);

    localStorage.removeItem("pos-user");
    localStorage.removeItem("pos-token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);