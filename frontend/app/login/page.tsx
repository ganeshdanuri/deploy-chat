"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import Logo from "../components/Logo";
import gsap from "gsap";
import { Input } from "../components/ui";

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

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

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
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-secondary bg-muted">
            {/* Left Side - Illustrations & Information */}
            <div
                className="hidden lg:flex lg:w-4/6 relative overflow-hidden flex-col justify-center items-start p-16 bg-secondary"
            >
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 60%)`,
                }} />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />

                <div className="relative z-10 max-w-2xl px-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs font-bold tracking-wider text-primary uppercase">Next-Generation Platform</span>
                    </div>

                    <h1 className="text-4xl font-bold mb-8 leading-[1.1] tracking-tight text-white">
                        Powering the <br />
                        <span className="text-primary">
                            Autonomous Future
                        </span>
                    </h1>

                    <p className="text-xl mb-12 text-border leading-relaxed font-normal max-w-lg">
                        Deploy Chat enables teams to build, scale, and monitor intelligent AI agents with production-grade RAG and native dataset connectors.
                    </p>

                    <div className="grid grid-cols-2 gap-8 mb-12">
                        <div className="flex flex-col gap-2">
                            <span className="text-3xl font-bold text-white">99.9%</span>
                            <span className="text-sm text-muted-foreground font-medium">Uptime Guarantee</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-3xl font-bold text-white">250ms</span>
                            <span className="text-sm text-muted-foreground font-medium">Avg. Latency</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-sm font-medium px-8 py-3 rounded-xl bg-secondary border border-white/10 text-white hover:bg-secondary/80 transition-all transform hover:-translate-y-1 shadow-lg shadow-white/5">
                            Platform Overview
                        </button>
                        <button className="text-sm font-medium text-white hover:text-white/70 transition-colors flex items-center gap-2 group border-b border-transparent hover:border-white/30 pb-1">
                            Documentation
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-10 left-16">
                    <p className="text-xs text-primary/50 font-medium tracking-wider uppercase">
                        Building the autonomous future with <span className="text-white font-bold ml-1">Deploy Chat</span>.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div
                className="w-full lg:w-2/6 flex flex-col justify-center px-8 sm:px-16 xl:px-20 bg-white relative overflow-hidden"
            >
                {/* Fixed Logo Header */}
                <div className="absolute top-0 left-0 right-0 h-24 flex items-center justify-center lg:justify-start px-8 sm:px-16 xl:px-20 z-20">
                    <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push("/")}>
                        <Logo className="h-8 w-auto" />
                        <span className="text-2xl font-bold tracking-tight block leading-none text-secondary pt-0.5">
                            DEPLOY CHAT
                        </span>
                    </div>
                </div>

                <div className="w-full max-w-sm mx-auto pt-16">
                    <div className="mb-10 text-center lg:text-left">
                        {/* Static height container to prevent layout shift */}
                        <div className="min-h-[70px] flex flex-col justify-end pb-1">
                            <h2 className="text-xl font-extrabold mb-1 text-secondary tracking-tight">
                                {isVerifying ? "Verify email" : isRegister ? "Create account" : "Welcome back"}
                            </h2>
                            <p className="text-[13px] text-foreground font-medium leading-relaxed">
                                {isVerifying
                                    ? `Code sent to ${email}`
                                    : isRegister
                                        ? (
                                            <>
                                                New accounts start on our <span className="font-bold text-primary px-1.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20 inline-flex items-center mx-1">Free</span> Plan.
                                            </>
                                        )
                                        : "Login to manage your chatbots."}
                            </p>
                        </div>
                    </div>


                </div>

                {!isVerifying && (
                    <div className="mb-8 lg:text-left text-center">
                        <p className="text-sm font-medium text-foreground">
                            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button
                                onClick={() => {
                                    setIsRegister(!isRegister);
                                    setError("");
                                }}
                                className="font-bold transition-colors text-primary hover:text-primary/80 underline underline-offset-4"
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
                            <label className="text-sm font-medium mb-2 block text-secondary">Verification Code</label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full rounded-xl border border-border px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary bg-white placeholder:text-muted-foreground"
                                placeholder="000000"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="text-sm font-medium w-full rounded-xl px-8 py-4 mt-4 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-secondary/25 bg-secondary"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : "Verify Email"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsVerifying(false)}
                            className="w-full text-sm font-bold text-foreground hover:text-secondary transition-colors"
                        >
                            Back to Register
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isRegister && (
                            <div>
                                <label className="text-sm font-medium mb-2 block text-secondary">Full Name</label>
                                <Input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your full name"
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium mb-2 block text-secondary">Email Address</label>
                            <Input
                                type="email"
                                required
                                value={isRegister ? email : username}
                                onChange={(e) => isRegister ? setEmail(e.target.value) : setUsername(e.target.value)}
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium block text-secondary">Password</label>
                                {!isRegister && (
                                    <button type="button" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="text-sm font-medium w-full rounded-xl px-8 py-4 mt-4 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-secondary/25 bg-secondary"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                isRegister ? (
                                    <span>
                                        Create Free Account
                                    </span>
                                ) : "Sign In"
                            )}
                        </button>
                    </form>
                )}

                {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                    <>
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-white px-4 text-muted-foreground font-medium tracking-wide uppercase">Or continue with</span>
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
                                width="320"
                                theme="outline"
                                shape="square"
                                containerProps={{}}
                            />
                        </div>
                    </>
                )}

                <p className="mt-8 text-xs text-left text-foreground">
                    By continuing, you are agreeing to our{" "}
                    <button className="text-sm font-medium underline hover:text-secondary">Terms of Service</button> and{" "}
                    <button className="text-sm font-medium underline hover:text-secondary">Privacy Policy</button>.
                </p>
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
