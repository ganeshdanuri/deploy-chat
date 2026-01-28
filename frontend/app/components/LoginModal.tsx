"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = login(username, password);
    
    if (success) {
      onClose();
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleClose = () => {
    setUsername("");
    setPassword("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-8 relative"
        style={{ boxShadow: theme.shadows.xl }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-2xl transition-colors hover:text-gray-600"
          style={{ color: theme.colors.neutral[400] }}
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 
            className="text-2xl font-semibold"
            style={{ color: theme.colors.neutral[900] }}
          >
            Sign in to your account
          </h1>
          <p 
            className="mt-2 text-sm"
            style={{ color: theme.colors.neutral[600] }}
          >
            Manage your chatbots and integrations
          </p>
          <p 
            className="mt-4 text-xs p-3 rounded-lg border"
            style={{ 
              color: theme.colors.neutral[500],
              backgroundColor: theme.colors.neutral[100],
              borderColor: theme.colors.neutral[200]
            }}
          >
            Demo credentials: <span className="font-mono font-semibold">admin</span> / <span className="font-mono font-semibold">1234</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-4 p-3 border rounded-lg text-sm"
            style={{ 
              backgroundColor: "#fee2e2",
              borderColor: "#fca5a5",
              color: "#991b1b"
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label 
              className="mb-1 block text-sm font-medium"
              style={{ color: theme.colors.neutral[700] }}
            >
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none transition-all focus:ring-2 focus:ring-indigo-200"
              style={{ 
                borderColor: theme.colors.neutral[300],
                color: theme.colors.neutral[900]
              }}
              placeholder="admin"
            />
          </div>

          <div>
            <label 
              className="mb-1 block text-sm font-medium"
              style={{ color: theme.colors.neutral[700] }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none transition-all focus:ring-2 focus:ring-indigo-200"
              style={{ 
                borderColor: theme.colors.neutral[300],
                color: theme.colors.neutral[900]
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ 
              background: theme.gradients.primaryButton,
              boxShadow: theme.shadows.sm
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
