"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { theme } from "../theme";
import { HiUser, HiLockClosed, HiLogin } from "react-icons/hi";
import Logo from "../components/Logo";
import gsap from "gsap";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, register, isAuthenticated, verifyOTP, continueWithGoogle } = useAuth();

    const [isRegister, setIsRegister] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("free");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const leftSideRef = useRef<HTMLDivElement>(null);

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        const isReg = searchParams.get("register") === "true";
        const plan = searchParams.get("plan");
        if (isReg) {
            setIsRegister(true);
            if (plan) setSelectedPlan(plan);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!leftSideRef.current) return;

        // GSAP Animation for shapes and texts
        const shapes = leftSideRef.current.querySelectorAll('.gsap-shape');
        const texts = leftSideRef.current.querySelectorAll('.gsap-text');

        gsap.fromTo(shapes,
            { scale: 0, opacity: 0, rotation: -45 },
            { scale: 1, opacity: 1, rotation: 0, duration: 1.5, stagger: 0.2, ease: "elastic.out(1, 0.5)" }
        );

        gsap.fromTo(texts,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.5 }
        );

        // Floating animation
        gsap.to(shapes, {
            y: "-=15",
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            stagger: 0.3,
            delay: 1.5
        });
    }, []);

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const success = await verifyOTP(email, otp);
            if (success) {
                router.push("/dashboard");
            } else {
                setError("Invalid or expired OTP");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (isRegister && !validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsLoading(true);

        try {
            if (isRegister) {
                const result = await register(username, email, password, selectedPlan);
                if (result.success) {
                    setIsVerifying(true);
                }
            } else {
                const success = await login(username, password);
                if (success) {
                    router.push("/dashboard");
                } else {
                    setError("Invalid username or password");
                }
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-slate-900 bg-white">
            {/* Left Side - Illustrations & Information */}
            <div
                ref={leftSideRef}
                className="hidden lg:flex lg:w-4/6 relative overflow-hidden flex-col justify-center items-start p-16"
                style={{ backgroundColor: theme.colors.neutral[900] }}
            >
                <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${theme.colors.primary.main} 0%, transparent 60%)`,
                }} />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />

                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full gsap-shape shadow-2xl opacity-20 backdrop-blur-3xl"
                    style={{ background: `linear-gradient(135deg, ${theme.colors.primary.lighter}, ${theme.colors.accent.blue})`, boxShadow: `0 0 80px ${theme.colors.accent.blue}80` }} />

                <div className="relative z-10 max-w-2xl px-8">
                    <div className="gsap-text inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-main/10 border border-primary-main/20 mb-8 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-xs font-bold tracking-wider text-blue-400 uppercase">Next-Generation Platform</span>
                    </div>

                    <h1 className="text-6xl font-black mb-8 gsap-text leading-[1.1] tracking-tight text-white">
                        Powering the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                            Autonomous Future
                        </span>
                    </h1>

                    <p className="text-xl mb-12 text-slate-200 gsap-text leading-relaxed font-normal max-w-lg">
                        Deploy Chat enables teams to build, scale, and monitor intelligent AI agents with production-grade RAG and native dataset connectors.
                    </p>

                    <div className="grid grid-cols-2 gap-8 gsap-text mb-12">
                        <div className="flex flex-col gap-2">
                            <span className="text-3xl font-bold text-white">99.9%</span>
                            <span className="text-sm text-slate-400 font-medium">Uptime Guarantee</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-3xl font-bold text-white">250ms</span>
                            <span className="text-sm text-slate-400 font-medium">Avg. Latency</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 gsap-text">
                        <button className="px-8 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-lg shadow-white/5">
                            Platform Overview
                        </button>
                        <button className="text-white hover:text-blue-300 transition-colors font-semibold flex items-center gap-2 group border-b border-transparent hover:border-blue-300 pb-1">
                            Documentation
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>

                {/* Help label similar to image at bottom left */}
                <div className="absolute bottom-8 left-16 gsap-text">
                    <p className="text-sm text-indigo-200/80">
                        For additional graphical assets, check <a href="https://storyset.com" target="_blank" rel="noreferrer" className="text-white hover:underline">Storyset</a> or <a href="https://undraw.co" target="_blank" rel="noreferrer" className="text-white hover:underline">unDraw</a>.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form (Inspired by the image layout) */}
            <div className="w-full lg:w-2/6 flex flex-col justify-center px-8 sm:px-16 xl:px-20 bg-white relative">
                <div className="absolute top-8 left-8 lg:hidden">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
                        <Logo className="h-8 w-auto" />
                        <span className="text-xl font-bold tracking-tight block leading-none text-slate-900">
                            DEPLOY CHAT
                        </span>
                    </div>
                </div>

                <div className="w-full max-w-sm mx-auto">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="hidden lg:flex items-center gap-2 mb-8 cursor-pointer" onClick={() => router.push("/")}>
                            <Logo className="h-8 w-auto" />
                            <span className="text-2xl font-bold tracking-tight block leading-none" style={{ color: theme.colors.neutral[900] }}>
                                DEPLOY CHAT
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2 text-slate-900 tracking-tight min-h-[1.2em]">
                            {isVerifying ? "Verify your email" : isRegister ? "Create an account" : "Welcome back"}
                        </h2>
                        <p className="text-slate-500 font-medium mb-6">
                            {isVerifying
                                ? `We've sent a 6-digit code to ${email}`
                                : isRegister
                                    ? "Join Deploy Chat today. All accounts start on our Free Plan."
                                    : "Please enter your details to continue."}
                        </p>

                        {!isVerifying && !isRegister && (
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-6 flex items-start gap-3 opacity-80">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">i</span>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Reminder: All accounts start on the <span className="font-bold text-slate-700">Free Plan</span>. You can manage your subscription from the dashboard settings.
                                </p>
                            </div>
                        )}

                        {!isVerifying && isRegister && (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 flex items-start gap-3 animate-fade-in shadow-sm">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5 animate-pulse">i</span>
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    New accounts are started on our <span className="font-bold text-blue-900 uppercase">Free Plan</span>. You can upgrade to Professional or Enterprise anytime from your dashboard.
                                </p>
                            </div>
                        )}
                    </div>

                    {!isVerifying && (
                        <div className="mb-8 lg:text-left text-center">
                            <p className="text-sm font-medium" style={{ color: theme.colors.neutral[600] }}>
                                {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                                <button
                                    onClick={() => {
                                        setIsRegister(!isRegister);
                                        setError("");
                                    }}
                                    className="font-bold transition-colors text-blue-600 hover:text-blue-700 underline underline-offset-4"
                                >
                                    {isRegister ? "Log in" : "Create one for free"}
                                </button>
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 border rounded-lg text-sm bg-red-50 text-red-600 border-red-200">
                            {error}
                        </div>
                    )}

                    {isVerifying ? (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">Verification Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white placeholder:text-slate-300"
                                    placeholder="000000"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-xl px-8 py-4 mt-4 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-500/25"
                                style={{ background: theme.gradients.primaryButton }}
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : "Verify Email"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsVerifying(false)}
                                className="w-full text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                Back to Register
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {isRegister && (
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">Username</label>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white placeholder:text-slate-400"
                                        placeholder="Enter username"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={isRegister ? email : username}
                                    onChange={(e) => isRegister ? setEmail(e.target.value) : setUsername(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white placeholder:text-slate-400"
                                    placeholder="name@company.com"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-bold text-slate-700">Password</label>
                                    {!isRegister && (
                                        <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-xl px-8 py-4 mt-4 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-500/25"
                                style={{ background: theme.gradients.primaryButton }}
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    isRegister ? "Create Free Account" : "Sign In"
                                )}
                            </button>
                        </form>
                    )}

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-4 text-slate-500 font-medium tracking-wide uppercase">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                if (credentialResponse.credential) {
                                    const success = await continueWithGoogle(credentialResponse.credential);
                                    if (success) {
                                        router.push("/dashboard");
                                    }
                                }
                            }}
                            onError={() => {
                                setError("Google login failed");
                            }}
                            useOneTap
                            width="280"
                            theme="outline"
                            shape="pill"
                        />
                    </div>

                    <p className="mt-8 text-xs text-left text-slate-500">
                        By continuing, you are agreeing to our{" "}
                        <button className="underline hover:text-slate-700">Terms of Service</button> and{" "}
                        <button className="underline hover:text-slate-700">Privacy Policy</button>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-500">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
