"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme";
import { HiX, HiUser, HiLockClosed, HiLogin } from "react-icons/hi";
import { MdEmail } from "react-icons/md";

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
      className="fixed inset-0 z-[100] h-screen w-screen flex items-center justify-center p-4 backdrop-blur-md"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
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
          className="absolute top-4 right-4 p-1 transition-colors hover:bg-gray-100 rounded-full"
          style={{ color: theme.colors.neutral[400] }}
        >
          <HiX className="text-2xl" />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.colors.primary.lightest }}
            >
              <HiLogin className="text-3xl" style={{ color: theme.colors.primary.main }} />
            </div>
          </div>
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
              backgroundColor: theme.colors.semantic.errorLight,
              borderColor: theme.colors.semantic.errorBorder,
              color: theme.colors.semantic.errorDark
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
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium"
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

          <button
            type="submit"
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center gap-2"
            style={{
              background: theme.gradients.primaryButton,
              boxShadow: theme.shadows.sm
            }}
          >
            <HiLogin className="text-xl" />
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
