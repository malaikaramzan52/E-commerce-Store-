import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getStoredToken, getStoredUser, storeAuthData, clearStoredAuth, clearAllAuth } from "../utils/auth";

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback((role = "user") => {
    // Clear relevant slot
    if (role === "admin") {
      clearStoredAuth("admin");
      setAdmin(null);
      setAdminToken(null);
    } else {
      clearStoredAuth("user");
      setUser(null);
      setUserToken(null);
    }
    // Deep cleanup: remove legacy 'token' that might cause bleed
    localStorage.removeItem("token");
  }, []);

  const verifySession = useCallback(async () => {
    const uTok = getStoredToken("user");
    const aTok = getStoredToken("admin");

    if (uTok) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${uTok}` },
        });
        if (!res.ok) logout("user");
      } catch (err) {
        console.error("User session verification failed", err);
      }
    }

    if (aTok) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${aTok}` },
        });
        if (!res.ok) logout("admin");
      } catch (err) {
        console.error("Admin session verification failed", err);
      }
    }
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // [LEGACY CLEANUP] Ensure old shared keys are gone
        if (localStorage.getItem("token")) {
           localStorage.removeItem("token");
        }

        const uTok = getStoredToken("user");
        const uProf = getStoredUser("user");
        if (uTok && uProf) {
          setUser(uProf);
          setUserToken(uTok);
        }

        const aTok = getStoredToken("admin");
        const aProf = getStoredUser("admin");
        if (aTok && aProf) {
          setAdmin(aProf);
          setAdminToken(aTok);
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    // Verify sessions once on mount
    verifySession();
  }, [verifySession]);

  const login = (token, userData) => {
    const role = userData.role || "user";
    storeAuthData(token, userData);
    
    if (role === "admin") {
      setAdmin(userData);
      setAdminToken(token);
    } else {
      setUser(userData);
      setUserToken(token);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      admin, 
      userToken,
      adminToken,
      token: adminToken || userToken, // Compatibility
      loading, 
      login, 
      logout,
      isAuthenticated: !!(user || admin),
      activeRole: admin ? "admin" : (user ? "user" : null)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
