"use client";

import { useState, useEffect } from "react";
import { HiUser, HiKey, HiCreditCard, HiUsers, HiBell, HiShieldCheck } from "react-icons/hi";
import { useAppSelector } from "@/lib/store/hooks";
import { useAuth } from "@/app/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { PricingCard } from "@/app/components/ui/PricingCard";
import { SettingsSkeleton } from "@/app/components/ui/Skeleton";

export default function SettingsPage() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("general");

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const { data: userData, status: userStatus } = useAppSelector((state) => state.user);
    const { user: authUser } = useAuth();
    const isLoading = userStatus === "loading";

    const tabs = [
        { id: "general", label: "General", icon: HiUser },
        { id: "team", label: "Team Members", icon: HiUsers },
        { id: "billing", label: "Billing & Plans", icon: HiCreditCard },
        { id: "api-keys", label: "API Keys", icon: HiKey },
        { id: "notifications", label: "Notifications", icon: HiBell },
    ];

    const currentTabLabel = tabs.find(t => t.id === activeTab)?.label || "Settings";

    return (
        <div className="animate-fade-in-up max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{currentTabLabel}</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your account preferences and system configuration.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <HiShieldCheck className="w-4 h-4 text-indigo-500" />
                    Secure Settings
                </div>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <SettingsSkeleton />
                ) : (
                    <div className="w-full">
                        {activeTab === "general" && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-200">
                                    <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
                                    <p className="text-sm text-slate-500 mt-1">Update your account's profile information and email address.</p>
                                </div>
                                <div className="p-6 space-y-6">

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Username</label>
                                            <input type="text" className="py-1.5 w-full border-slate-200 rounded-lg text-sm bg-slate-50 cursor-not-allowed" value={userData?.profile?.username || ""} readOnly />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                                            <div className="relative">
                                                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                <input type="email" className="py-1.5 w-full pl-9 border-slate-200 rounded-lg text-sm bg-slate-50 cursor-not-allowed" value={userData?.profile?.email || authUser?.email || ""} readOnly />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                        {activeTab === "billing" && (
                            <div className="space-y-4">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0">
                                                    <HiCreditCard className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                        {userData?.billing?.current_plan ? userData.billing.current_plan.charAt(0).toUpperCase() + userData.billing.current_plan.slice(1) : 'Free'} plan
                                                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                                                    </h2>
                                                    <p className="text-sm text-slate-500 mt-0.5">
                                                        {userData?.billing?.expires_at
                                                            ? `Your plan will renew on ${new Date(userData.billing.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`
                                                            : 'You are currently on the free tier.'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-2 text-slate-700 max-w-sm">
                                                <div className="flex justify-between items-end mb-1.5">
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {userData?.usage?.messages_sent || 0} <span className="text-slate-500 font-medium">/ {userData?.billing?.monthly_limit || 100} msgs</span>
                                                    </span>
                                                    <span className="text-xs font-medium text-slate-500">
                                                        Resets on {userData?.usage?.reset_date ? new Date(userData.usage.reset_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '1st of month'}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${((userData?.usage?.messages_sent || 0) / (userData?.billing?.monthly_limit || 100)) > 0.9 ? 'bg-red-500' : 'bg-indigo-600'}`}
                                                        style={{ width: `${Math.min(((userData?.usage?.messages_sent || 0) / (userData?.billing?.monthly_limit || 100)) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="shrink-0 pt-1">
                                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-0.5 shadow-sm">
                                                View Invoices
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                                    <PricingCard
                                        title="Starter"
                                        price="19"
                                        interval="/month"
                                        features={[
                                            "1,000 Messages / month",
                                            "1 AI Chatbot",
                                            "Standard Analytics",
                                            "Email Support"
                                        ]}
                                        buttonText="Upgrade"
                                        onButtonClick={() => { }}
                                    />
                                    <PricingCard
                                        title="Professional"
                                        price="49"
                                        interval="/month"
                                        features={[
                                            "10,000 Messages / month",
                                            "5 AI Chatbots",
                                            "Advanced Analytics",
                                            "Priority Support",
                                            "Remove Branding"
                                        ]}
                                        buttonText="Get Started"
                                        isPopular={true}
                                        onButtonClick={() => { }}
                                    />
                                    <PricingCard
                                        title="Enterprise"
                                        price="Custom"
                                        features={[
                                            "Unlimited everything",
                                            "Dedicated Azure Server",
                                            "SLA Guarantees",
                                            "Custom Integrations",
                                            "Single Sign-On (SSO)"
                                        ]}
                                        buttonText="Contact Sales"
                                        onButtonClick={() => { }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Other tabs placeholder */}
                        {(activeTab !== "general" && activeTab !== "billing") && (
                            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 border-dashed">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <HiShieldCheck className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-slate-900 font-medium">Coming Soon</h3>
                                <p className="text-slate-500 text-sm mt-1">This settings panel is under construction.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
