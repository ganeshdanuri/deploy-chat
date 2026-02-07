"use client";

import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HiLightningBolt } from "react-icons/hi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <HiLightningBolt className="w-7 h-7 text-white animate-bounce" />
                    </div>
                    <div className="h-2 w-24 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Return nothing while redirecting
    }

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 transition-transform">
                <TopNav />
                <main className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
