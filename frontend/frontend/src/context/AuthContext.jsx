import { createContext, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Safely parse user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async ({email, password}) => {
    setLoading(true);
    try {
     const res = await authService.login({ email, password });

      if (res.ok) {
        const decodedUser = { email };
        setUser(decodedUser);
        localStorage.setItem("user", JSON.stringify(decodedUser));
        return { ok: true };
      } else {
        return { ok: false, error: res.error };
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem("user");
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      if (res.ok) {
        const decodedUser = { email: data.email };
        setUser(decodedUser);
        localStorage.setItem("user", JSON.stringify(decodedUser));
        return { ok: true };
      } else {
        return { ok: false, error: res.error };
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
