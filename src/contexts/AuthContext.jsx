import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useLanguage } from "./LanguageContext";

const AuthContext = createContext(null);
const TOKEN_KEY = "tea-traceability-token";
const USER_KEY = "tea-traceability-user";

function readSessionUser() {
  const raw = sessionStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const { t } = useLanguage();
  const [user, setUser] = useState(readSessionUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      sessionStorage.setItem(TOKEN_KEY, data.token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || t("login.error"),
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener("tea-logout", handleUnauthorized);
    return () => window.removeEventListener("tea-logout", handleUnauthorized);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, t]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
