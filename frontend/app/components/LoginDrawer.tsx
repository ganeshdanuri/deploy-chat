/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme";
import { HiUser, HiLockClosed, HiLogin } from "react-icons/hi";
import { GoogleLogin } from "@react-oauth/google";
import Logo from "./Logo";
import Drawer from "./Drawer";

interface LoginDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
    initialPlan?: string;
}

export default function LoginDrawer({ isOpen, onClose, initialMode = 'login', initialPlan = 'free' }: LoginDrawerProps) {
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
        } catch {
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

    return (
        <Drawer
            isOpen={isOpen}
            onClose={handleClose}
            title={isRegister ? "Join Deploy Chat" : "Welcome Back"}
            subtitle={isRegister ? "Start your journey today." : "Sign in to manage your AI knowledge."}
            icon={HiLogin}
        >
            <div className="space-y-8 animate-fade-in">
                <div className="flex justify-center mb-4">
                    <Logo className="h-12 w-auto" />
                </div>

                {/* Error Message */}
                {error && (
                    <div
                        className="p-4 border rounded-xl text-xs font-bold animate-shake"
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
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label
                            className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1"
                        >
                            {isRegister ? "Account Name" : "Username"}
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                <HiUser className="text-lg" />
                            </div>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-xl border border-slate-100 pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white bg-slate-50/50 transition-all font-medium text-slate-900 shadow-none hover:border-slate-300"
                                placeholder={isRegister ? "Your full name" : "Your username"}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1"
                        >
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                <HiLockClosed className="text-lg" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-slate-100 pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white bg-slate-50/50 transition-all font-medium text-slate-900 shadow-none hover:border-slate-300"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {isRegister && (
                        <div className="space-y-2">
                            <label
                                className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1"
                            >
                                Confirm Security
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <HiLockClosed className="text-lg" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-xl border border-slate-100 pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white bg-slate-50/50 transition-all font-medium text-slate-900 shadow-none hover:border-slate-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl px-4 py-4 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        style={{
                            background: theme.colors.primary.main,
                        }}
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                {isRegister ? "Create Secure Account" : "Secure Sign In"}
                            </>
                        )}
                    </button>
                </form>

                {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                    <div className="space-y-6 pt-2">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                                <span className="bg-white px-3 text-slate-400">One-Click Access</span>
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
                    </div>
                )}

                <div className="text-center pt-4">
                    <p className="text-xs font-bold text-slate-500">
                        {isRegister ? "ALREADY PART OF THE TEAM?" : "NEW TO THE PLATFORM?"}{" "}
                        <button
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setError("");
                            }}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-[0.15em] ml-1"
                        >
                            {isRegister ? "Sign In" : "Register Now"}
                        </button>
                    </p>
                </div>
            </div>
        </Drawer>
    );
}
