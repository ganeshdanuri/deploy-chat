/* eslint-disable @next/next/no-img-element */
"use client";

export default function Logo({ className ="h-10 w-auto" }: { className?: string }) {
    return (
        <img src="/logo.svg" alt="Logo" className={className} />
    );
}
