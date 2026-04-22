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

    useEffect(() => {
        if (isSidebarOpen) setIsSidebarOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3 animate-pulse">
                    <Logo className="h-10 w-auto" />
                    <div className="h-1 w-20 bg-border rounded-full" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans overflow-hidden dashboard-theme">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <TopNav onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-8 space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
