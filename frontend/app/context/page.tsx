"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
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
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-sky-100">
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your chatbots and integrations
            </p>
            <p className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              Demo credentials: <span className="font-mono font-semibold">admin</span> / <span className="font-mono font-semibold">1234</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-black focus:outline-none"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-black focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-900"
            >
              Sign in
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-black hover:underline"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
