"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme";
import { HiX, HiUser, HiLockClosed, HiLogin } from "react-icons/hi";
import { GoogleLogin } from "@react-oauth/google";
import Logo from "./Logo";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  initialPlan?: string;
}

export default function LoginModal({ isOpen, onClose, initialMode = 'login', initialPlan = 'free' }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [selectedPlan] = useState<string>(initialPlan || 'free');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, continueWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }
        const success = await register(username, password, selectedPlan);
        if (success) {
          onClose();
          router.push("/dashboard");
        } else {
          setError("Registration failed. Data might be invalid or username taken.");
        }
      } else {
        const success = await login(username, password);
        if (success) {
          onClose();
          router.push("/dashboard");
        } else {
          setError("Invalid username or password");
        }
      }
    } catch { // 'err' is kept here as per the instruction's diff, which only removes it from the Google login catch block.
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setIsRegister(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] h-screen w-screen flex items-center justify-center p-4 backdrop-blur-md"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-8 relative overflow-hidden"
        style={{ boxShadow: theme.shadows.xl }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="text-sm font-medium absolute top-4 right-4 p-1 transition-colors hover:bg-gray-100 rounded-full"
          style={{ color: theme.colors.neutral[400] }}
        >
          <HiX className="text-2xl" />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Logo className="h-12 w-auto" />
          </div>
          <h1
            className="text-4xl font-bold"
            style={{ color: theme.colors.neutral[900] }}
          >
            {isRegister ? "Create an account" : "Sign in to your account"}
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: theme.colors.neutral[600] }}
          >
            {isRegister ? `Join us with ${selectedPlan === 'trial' ? 'a Free Trial' : `the ${selectedPlan} plan`}` : "Manage your chatbots and integrations"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-4 p-3 border rounded-lg text-sm"
            style={{
              backgroundColor: theme.colors.semantic.errorLight,
              borderColor: theme.colors.semantic.errorBorder,
              color: theme.colors.semantic.errorDark
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="text-sm font-medium mb-1 block"
              style={{ color: theme.colors.neutral[700] }}
            >
              {isRegister ? "Full Name" : "Username"}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.neutral[400] }}>
                <HiUser className="text-lg" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border pl-10 pr-4 py-2 text-sm focus:outline-none transition-all focus:ring-2 focus:ring-indigo-200"
                style={{
                  borderColor: theme.colors.neutral[300],
                  color: theme.colors.neutral[900]
                }}
                placeholder={isRegister ? "Enter your full name" : "Enter username"}
              />
            </div>
          </div>

          <div>
            <label
              className="text-sm font-medium mb-1 block"
              style={{ color: theme.colors.neutral[700] }}
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.neutral[400] }}>
                <HiLockClosed className="text-lg" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border pl-10 pr-4 py-2 text-sm focus:outline-none transition-all focus:ring-2 focus:ring-indigo-200"
                style={{
                  borderColor: theme.colors.neutral[300],
                  color: theme.colors.neutral[900]
                }}
                placeholder="••••••••"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label
                className="text-sm font-medium mb-1 block"
                style={{ color: theme.colors.neutral[700] }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.neutral[400] }}>
                  <HiLockClosed className="text-lg" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border pl-10 pr-4 py-2 text-sm focus:outline-none transition-all focus:ring-2 focus:ring-indigo-200"
                  style={{
                    borderColor: theme.colors.neutral[300],
                    color: theme.colors.neutral[900]
                  }}
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="text-sm font-medium w-full rounded-lg px-4 py-2.5 text-white transition-all hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: theme.gradients.primaryButton,
              boxShadow: theme.shadows.sm
            }}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <HiLogin className="text-xl" />
                {isRegister ? "Create Account" : "Sign in"}
              </>
            )}
          </button>
        </form>

        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500 font-medium lowercase">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    const success = await continueWithGoogle(credentialResponse.credential);
                    if (success) {
                      onClose();
                      router.push("/dashboard");
                    }
                  }
                }}
                onError={() => {
                  setError("Google login failed");
                }}
                useOneTap
                width="100%"
                theme="outline"
                shape="rectangular"
              />
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="font-semibold transition-colors"
              style={{ color: theme.colors.primary.main }}
            >
              {isRegister ? "Sign In" : "Get Started"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
