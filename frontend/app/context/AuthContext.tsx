"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import showToast from "@/lib/toast";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { username: string; email: string; plan: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  continueWithGoogle: (credential: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, plan?: string) => Promise<{ success: boolean; email?: string }>;
  verifyOTP: (email: string, otpCode: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ username: string; email: string; plan: string } | null>(null);
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      if (response.data.access_token) {
        const userData = {
          username: response.data.username,
          email: response.data.email || '',
          plan: response.data.current_plan || 'free'
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("access_token", response.data.access_token);
        showToast.success(`Welcome back, ${userData.username}!`);
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Login failed. Please try again.";
      showToast.error(errorMessage);
      return false;
    }
  };

  const continueWithGoogle = async (credential: string): Promise<boolean> => {
    try {
      const response = await api.post("/api/auth/google", { credential });
      if (response.data.access_token) {
        const userData = {
          username: response.data.username,
          email: response.data.email || '',
          plan: response.data.current_plan || 'free',
          profile_image: response.data.profile_image
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("access_token", response.data.access_token);
        showToast.success(`Welcome back, ${userData.username}!`);
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Google login failed.";
      showToast.error(errorMessage);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string, plan: string = "free") => {
    try {
      const response = await api.post("/api/auth/register", { username, email, password, plan });
      if (response.data.message) {
        showToast.success("Registration successful! Please check your email for OTP.");
        return { success: true, email: response.data.email };
      }
      return { success: false };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Registration failed. Please try again.";
      showToast.error(errorMessage);
      return { success: false };
    }
  };

  const verifyOTP = async (email: string, otpCode: string): Promise<boolean> => {
    try {
      const response = await api.post("/api/auth/verify-otp", { email, otp_code: otpCode });
      if (response.data.access_token) {
        const userData = {
          username: response.data.username,
          email: email,
          plan: response.data.current_plan || 'free'
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("access_token", response.data.access_token);
        showToast.success(`Email verified! Welcome, ${userData.username}!`);
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Verification failed. Invalid or expired OTP.";
      showToast.error(errorMessage);
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
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, continueWithGoogle, register, verifyOTP, logout }}>
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
