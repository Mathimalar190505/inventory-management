import { useContext, createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ❌ NO AUTO LOGIN FROM LOCALSTORAGE
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Login function
  const login = (userData, token) => {
    setUser(userData);
    setToken(token);

    localStorage.setItem("pos-user", JSON.stringify(userData));
    localStorage.setItem("pos-token", token);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("pos-user");
    localStorage.removeItem("pos-token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);