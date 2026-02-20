"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { useAuth } from "../context/AuthContext";
import { HiLightningBolt } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { fetchChatbots } from "@/lib/store/slices/chatbotsSlice";
import { fetchDatasets } from "@/lib/store/slices/datasetsSlice";
import { fetchDocuments } from "@/lib/store/slices/documentsSlice";
import { fetchUsageStats } from "@/lib/store/slices/usageSlice";
import Logo from "../components/Logo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch<AppDispatch>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Select just status to avoid unnecessary re-renders
    const { status: chatbotStatus } = useSelector((state: RootState) => state.chatbots);
    const { status: datasetStatus } = useSelector((state: RootState) => state.datasets);
    const { status: documentStatus } = useSelector((state: RootState) => state.documents);
    const { status: usageStatus } = useSelector((state: RootState) => state.usage);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
        } else if (isAuthenticated && !isLoading) {
            // Fetch initial data if not already loading/loaded
            if (chatbotStatus === 'idle') dispatch(fetchChatbots());
            if (datasetStatus === 'idle') dispatch(fetchDatasets());
            if (documentStatus === 'idle') dispatch(fetchDocuments());
            if (usageStatus === 'idle') dispatch(fetchUsageStats());
        }
    }, [isLoading, isAuthenticated, router, dispatch, chatbotStatus, datasetStatus, documentStatus, usageStatus]);

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <Logo className="h-16 w-auto animate-bounce" />
                    <div className="h-2 w-24 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Return nothing while redirecting
    }

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
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
                <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-8">
                    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
