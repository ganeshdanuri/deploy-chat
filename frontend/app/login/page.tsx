"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
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
                                    autoFocus
                                />
                                <Button type="submit" disabled={isLoading} className="w-full h-11">
                                    {isLoading ? "Verifying..." : "Verify email →"}
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
                                        <label className="text-sm font-medium mb-1.5 block text-foreground">
                                            Your name
                                        </label>
                                        <Input
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-foreground">
                                        Work email
                                    </label>
                                    <Input
                                        type="email"
                                        required
                                        value={isRegister ? email : username}
                                        onChange={(e) =>
                                            isRegister ? setEmail(e.target.value) : setUsername(e.target.value)
                                        }
                                        placeholder="you@company.com"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-sm font-medium text-foreground">Password</label>
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
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <Button type="submit" disabled={isLoading} className="w-full h-11 mt-2">
                                    {isLoading
                                        ? "Loading..."
                                        : isRegister
                                        ? "Create free account →"
                                        : "Sign in →"}
                                </Button>
                            </form>
                        )}

                        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && !isVerifying && (
                            <>
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="bg-background px-3 text-muted-foreground">or</span>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            if (credentialResponse.credential) {
                                                const success = await continueWithGoogle(credentialResponse.credential);
                                                if (success) router.push("/dashboard");
                                            }
                                        }}
                                        onError={() => setError("Google login failed")}
                                        useOneTap
                                        width="320"
                                        theme="outline"
                                        shape="rectangular"
                                        containerProps={{}}
                                    />
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
