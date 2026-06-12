import React, { createContext, useState, useContext, useEffect } from "react";
import { authApi } from "../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const userStr = localStorage.getItem("user");
      console.log("Checking auth, token found:", !!token);

      // Optimistic authentication - if token exists, assume authenticated
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Failed to parse user data:", e);
        }
      }

      // Now validate the token in the background
      if (token) {
        try {
          const response = await authApi.getProfile();
          console.log("Profile response:", response.data);
          setUser(response.data);
          setIsAuthenticated(true);
          // Update localStorage with fresh user data
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          console.error("Auth check failed:", error);
          // Try to refresh token if access token is expired
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            try {
              const refreshResponse = await authApi.refreshToken(refreshToken);
              const { access, refresh } = refreshResponse.data;
              localStorage.setItem("access_token", access);
              localStorage.setItem("refresh_token", refresh);

              // Retry profile fetch with new token
              const profileResponse = await authApi.getProfile();
              setUser(profileResponse.data);
              setIsAuthenticated(true);
              localStorage.setItem("user", JSON.stringify(profileResponse.data));
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              // Only clear tokens if refresh also fails and we don't have user data
              if (!userStr) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");
                setIsAuthenticated(false);
              }
            }
          } else {
            // No refresh token, but keep user authenticated if we have user data
            if (!userStr) {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("user");
              setIsAuthenticated(false);
            }
          }
        }
      } else if (userStr) {
        // If no token but user data exists, try to use it as fallback
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Failed to parse user data:", e);
          setIsAuthenticated(false);
        }
      } else {
        console.log("No token found in localStorage");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      // Don't set isAuthenticated to false if we have user data
      if (!localStorage.getItem("user")) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        error: error.response?.data?.detail || "Login failed" 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Registration failed:", error);
      return { 
        success: false, 
        error: error.response?.data || "Registration failed" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = () => {
    return user?.role === "ADMIN";
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    isAdmin,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
