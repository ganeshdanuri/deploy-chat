"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Logo from "@/app/components/Logo";
import { Suspense } from "react";

function GitHubCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { continueWithGithub } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      router.replace("/login?error=github_denied");
      return;
    }

    handled.current = true;
    continueWithGithub(code).then((success) => {
      router.replace(success ? "/dashboard" : "/login?error=github_failed");
    });
  }, [searchParams, continueWithGithub, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground">
      <Logo className="h-8 w-auto mb-2" />
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <span className="w-4 h-4 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin inline-block" />
        Signing you in with GitHub…
      </div>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense>
      <GitHubCallbackContent />
    </Suspense>
  );
}
