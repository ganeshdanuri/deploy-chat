"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { useAuth } from "../context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchChatbots } from "@/lib/store/slices/chatbotsSlice";
import { fetchDatasets } from "@/lib/store/slices/datasetsSlice";
import { fetchDocuments } from "@/lib/store/slices/documentsSlice";
import { fetchUsageStats } from "@/lib/store/slices/usageSlice";
import { fetchUserMe } from "@/lib/store/slices/userSlice";
import Logo from "../components/Logo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { status: chatbotStatus } = useAppSelector((state) => state.chatbots);
    const { status: datasetStatus } = useAppSelector((state) => state.datasets);
    const { status: documentStatus } = useAppSelector((state) => state.documents);
    const { status: usageStatus } = useAppSelector((state) => state.usage);
    const { status: userStatus } = useAppSelector((state) => state.user);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
            return;
        }
        if (isAuthenticated && !isLoading) {
            if (chatbotStatus === "idle") dispatch(fetchChatbots());
            if (datasetStatus === "idle") dispatch(fetchDatasets());
            if (documentStatus === "idle") dispatch(fetchDocuments());
            if (usageStatus === "idle") dispatch(fetchUsageStats());
            if (userStatus === "idle") dispatch(fetchUserMe());
        }
    }, [isLoading, isAuthenticated, router, dispatch, chatbotStatus, datasetStatus, documentStatus, usageStatus, userStatus]);

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    }, [pathname]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <Logo className="h-16 w-auto animate-bounce" />
                    <div className="h-2 w-24 bg-slate-200 rounded" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="flex min-h-screen bg-[#f3f3f9] text-[#201F3B] font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <TopNav onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 py-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
