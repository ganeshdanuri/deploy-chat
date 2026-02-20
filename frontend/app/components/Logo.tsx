"use client";

import { theme } from "../theme";

export default function Logo({ className = "h-10 w-auto" }: { className?: string }) {
    return (
        <img src="/logo.svg" alt="Logo" className={className} />
    );
}
