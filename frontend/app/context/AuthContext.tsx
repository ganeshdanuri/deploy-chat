"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import showToast from "@/lib/toast";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { username: string; plan: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, plan?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ username: string; plan: string } | null>(null);
  const router = useRouter();

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("/api/auth/login", { username, password });
      if (response.data.access_token) {
        const userData = {
          username: response.data.username,
          plan: response.data.current_plan || 'free'
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("access_token", response.data.access_token);
        showToast.success(`Welcome back, ${userData.username}!`);
        return true;
      }
      showToast.error("Login failed. Please check your credentials.");
      return false;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Login failed. Please try again.";
      showToast.error(errorMessage);
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (username: string, password: string, plan: string = "free"): Promise<boolean> => {
    try {
      const response = await api.post("/api/auth/register", { username, password, plan });
      if (response.data.access_token) {
        const userData = {
          username: response.data.username,
          plan: plan
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("access_token", response.data.access_token);
        showToast.success(`Account created! Welcome, ${userData.username}!`);
        return true;
      }
      showToast.error("Registration failed. Please try again.");
      return false;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Registration failed. Please try again.";
      showToast.error(errorMessage);
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    showToast.info("You have been logged out.");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
