"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import Logo from "../components/Logo";
import { Input } from "../components/ui";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";

// Rotating proof points to show alongside the form
const PROOF_POINTS = [
"Trained on your content — answers in your voice.",
"One line of code. Live on your site in under 5 minutes.",
"Used by 500+ teams in production.",
"Your data never trains our base models.",
];

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, register, isAuthenticated, verifyOTP, continueWithGoogle, continueWithGithub } = useAuth();

    const [isRegister, setIsRegister] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("free");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [proofIdx, setProofIdx] = useState(0);

    useEffect(() => {
        if (isAuthenticated) router.push("/dashboard");
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
        const t = setInterval(() => {
            setProofIdx((i) => (i + 1) % PROOF_POINTS.length);
        }, 3200);
        return () => clearInterval(t);
    }, []);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const success = await continueWithGoogle(tokenResponse.access_token);
            if (success) router.push("/dashboard");
        },
        onError: () => setError("Google login failed"),
        flow: "implicit",
    });

    const validateEmail = (v: string) =>
        String(v).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const success = await verifyOTP(email, otp);
            if (success) router.push("/dashboard");
            else setError("Invalid or expired code");
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
                if (result.success) setIsVerifying(true);
            } else {
                const success = await login(username, password);
                if (success) router.push("/dashboard");
                else setError("Invalid username or password");
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Top bar — home link + minimal brand */}
            <div className="flex items-center justify-between px-5 sm:px-8 h-14 border-b border-border">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
>
                    <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
                    <span className="hidden sm:inline">Back to home</span>
                </Link>
                <Link href="/" className="flex items-center gap-2">
                    <Logo className="h-6 w-auto" />
                    <span className="text-[14px] font-medium tracking-tight">Deploy Chat</span>
                </Link>
                <div className="text-xs text-muted-foreground hidden sm:block">
                    Need help?{""}
                    <a
                        href="mailto:sales@deploymind.com"
                        className="text-foreground font-medium hover:underline"
>
                        Contact us
                    </a>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_1fr] min-h-[calc(100vh-3.5rem)]">
                {/* LEFT — form */}
                <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 lg:py-16 order-2 lg:order-1">
                    <div className="w-full max-w-sm mx-auto lg:mx-0">
                        {/* Contextual badge */}
                        {!isVerifying && (
                            <div
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium mb-6"
                                style={{
                                    background: "var(--brand-bg)",
                                    color: "var(--brand)",
                                }}
>
                                {isRegister ? "Free forever — no card needed" : "Welcome back"}
                            </div>
                        )}

                        <h1 className="text-[32px] font-medium tracking-[-0.025em] text-foreground mb-2 leading-[1.1]">
                            {isVerifying
                                ? "Check your email"
                                : isRegister
                                ? "Create your account"
                                : "Sign in to Deploy Chat"}
                        </h1>
                        <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">
                            {isVerifying
                                ? `We sent a 6-digit code to ${email}`
                                : isRegister
                                ? "Ship your first AI agent in under 5 minutes."
                                : "Pick up where you left off."}
                        </p>

                        {error && (
                            <div
                                role="alert"
                                aria-live="polite"
                                className="mb-5 p-3 rounded-md text-sm border"
                                style={{
                                    background: "rgba(220, 38, 38, 0.05)",
                                    color: "var(--destructive)",
                                    borderColor: "rgba(220, 38, 38, 0.2)",
                                }}
>
                                {error}
                            </div>
                        )}

                        {isVerifying ? (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g,""))}
                                    className="w-full rounded-md border border-border px-4 py-4 text-center text-2xl font-medium tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-foreground/30 bg-background placeholder:text-muted-foreground transition-colors"
                                    placeholder="000000"
                                    autoComplete="one-time-code"
                                    name="otp"
                                    autoFocus
                                />
                                <Button type="submit" disabled={isLoading} className="w-full h-11">
                                    {isLoading ? "Verifying…" : "Verify email →"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsVerifying(false)}
                                    className="w-full"
>
                                    Use a different email
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {isRegister && (
                                    <div>
                                        <label htmlFor="username" className="text-sm font-medium mb-1.5 block text-foreground">
                                            Your name
                                        </label>
                                        <Input
                                            id="username"
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Jane Doe"
                                            autoComplete="name"
                                            name="username"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="email" className="text-sm font-medium mb-1.5 block text-foreground">
                                        Work email
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={isRegister ? email : username}
                                        onChange={(e) =>
                                            isRegister ? setEmail(e.target.value) : setUsername(e.target.value)
                                        }
                                        placeholder="you@company.com"
                                        autoComplete="email"
                                        name="email"
                                        spellCheck={false}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                                        {!isRegister && (
                                            <button
                                                type="button"
                                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
>
                                                Forgot password?
                                            </button>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete={isRegister ? "new-password" : "current-password"}
                                        name="password"
                                    />
                                </div>

                                <Button type="submit" disabled={isLoading} className="w-full h-11 mt-2">
                                    {isLoading
                                        ? "Loading…"
                                        : isRegister
                                        ? "Create free account →"
                                        : "Sign in →"}
                                </Button>
                            </form>
                        )}

                        {!isVerifying && (
                            <>
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="bg-background px-3 text-muted-foreground">or continue with</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2.5">
                                    {/* Google */}
                                    {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                                        <button
                                            type="button"
                                            onClick={() => googleLogin()}
                                            className="w-full flex items-center justify-center gap-2.5 h-10 px-4 rounded-md border border-border bg-background hover:bg-muted text-sm font-medium text-foreground transition-colors"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                                                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                                            </svg>
                                            Continue with Google
                                        </button>
                                    )}

                                    {/* GitHub */}
                                    {process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const params = new URLSearchParams({
                                                    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
                                                    redirect_uri: `${window.location.origin}/auth/callback/github`,
                                                    scope: "user:email",
                                                });
                                                window.location.href = `https://github.com/login/oauth/authorize?${params}`;
                                            }}
                                            className="w-full flex items-center justify-center gap-2.5 h-10 px-4 rounded-md border border-border bg-background hover:bg-muted text-sm font-medium text-foreground transition-colors"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 0 1 3-.405c1.02.005 2.045.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
                                            </svg>
                                            Continue with GitHub
                                        </button>
                                    )}
                                </div>
                            </>
                        )}

                        {!isVerifying && (
                            <p className="mt-8 text-sm text-muted-foreground">
                                {isRegister ? "Already have an account? " : "New here? "}
                                <button
                                    onClick={() => {
                                        setIsRegister(!isRegister);
                                        setError("");
                                    }}
                                    className="font-medium text-foreground hover:underline"
>
                                    {isRegister ? "Sign in" : "Create a free account"}
                                </button>
                            </p>
                        )}

                        <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
                            By continuing, you agree to our{""}
                            <a href="#" className="underline hover:text-foreground">Terms</a>
                            {""}and{""}
                            <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
                        </p>
                    </div>
                </div>

                {/* RIGHT — product-focused panel */}
                <div
                    className="hidden lg:flex flex-col justify-center items-center p-12 xl:p-16 order-1 lg:order-2 relative overflow-hidden"
                    style={{ background: "var(--muted)" }}
>
                    {/* Subtle grid pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.5] pointer-events-none"
                        style={{
                            backgroundImage:
"linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                            backgroundSize: "48px 48px",
                            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                        }}
                    />

                    <div className="relative z-10 w-full max-w-md flex flex-col gap-8">
                        {/* Floating chat preview */}
                        <div className="bg-background rounded-xl border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                                        style={{
                                            background: "var(--brand-bg)",
                                            color: "var(--brand)",
                                        }}
>
                                        AI
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-medium leading-tight">
                                            Your support agent
                                        </div>
                                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" />
                                            Online
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-5 flex flex-col gap-2.5">
                                <div className="self-start max-w-[85%] bg-muted text-foreground px-3 py-2 rounded-2xl rounded-tl-sm text-[13px] leading-relaxed">
                                    Hey! I&apos;m trained on your docs. Ask me anything.
                                </div>
                                <div className="self-end max-w-[85%] bg-foreground text-background px-3 py-2 rounded-2xl rounded-tr-sm text-[13px] leading-relaxed">
                                    How do I cancel a subscription?
                                </div>
                                <div className="self-start max-w-[90%] bg-muted text-foreground px-3 py-2 rounded-2xl rounded-tl-sm text-[13px] leading-relaxed">
                                    You can cancel anytime from{""}
                                    <span
                                        className="underline underline-offset-2"
                                        style={{ color: "var(--brand)" }}
>
                                        Settings → Billing
                                    </span>
                                    . Refunds are automatic within 14 days.
                                </div>
                            </div>
                            <div className="px-3 py-2.5 border-t border-border flex items-center gap-2">
                                <div className="flex-1 text-[12px] text-muted-foreground px-3 py-1.5 bg-muted rounded-full">
                                    Ask a question...
                                </div>
                                <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-sm">
                                    ↑
                                </div>
                            </div>
                        </div>

                        {/* Rotating proof point */}
                        <div className="text-center min-h-[56px] flex items-center justify-center">
                            <p
                                key={proofIdx}
                                className="text-[15px] text-foreground leading-relaxed animate-fade-in max-w-sm"
>
                                {PROOF_POINTS[proofIdx]}
                            </p>
                        </div>

                        {/* Tiny stats strip */}
                        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border">
                            <div>
                                <div className="text-2xl font-medium tracking-tight text-foreground tabular-nums">
                                    500+
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">Teams</div>
                            </div>
                            <div>
                                <div className="text-2xl font-medium tracking-tight text-foreground tabular-nums">
                                    99.9%
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">Uptime</div>
                            </div>
                            <div>
                                <div className="text-2xl font-medium tracking-tight text-foreground tabular-nums">
                                    250ms
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">Avg. reply</div>
                            </div>
                        </div>

                        {/* Compliance row */}
                        <div className="flex flex-wrap gap-4 justify-center text-[12px] text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Check strokeWidth={2} className="w-3.5 h-3.5" style={{ color: "var(--accent-green)" }} />
                                GDPR compliant
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Check strokeWidth={2} className="w-3.5 h-3.5" style={{ color: "var(--accent-green)" }} />
                                SOC 2 ready
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Check strokeWidth={2} className="w-3.5 h-3.5" style={{ color: "var(--accent-green)" }} />
                                Data encrypted
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">
                    Loading...
                </div>
            }
>
            <LoginContent />
        </Suspense>
    );
}
