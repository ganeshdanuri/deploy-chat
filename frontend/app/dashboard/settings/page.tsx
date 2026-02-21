"use client";

import { useState, useEffect } from "react";
import { HiUser, HiKey, HiCreditCard, HiUsers, HiBell, HiShieldCheck } from "react-icons/hi";
import showToast from "@/lib/toast";
import { useAppSelector } from "@/lib/store/hooks";
import { useAuth } from "@/app/context/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";

export default function SettingsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("general");

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const { data: userData } = useAppSelector((state) => state.user);
    const { user: authUser } = useAuth();

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
                {/* Settings Content */}
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
                                        <input type="text" className="w-full border-slate-200 rounded-lg text-sm bg-slate-50 cursor-not-allowed" value={userData?.profile?.username || ""} readOnly />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <div className="relative">
                                            <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <input type="email" className="w-full pl-9 border-slate-200 rounded-lg text-sm bg-slate-50 cursor-not-allowed" value={userData?.profile?.email || authUser?.email || ""} readOnly />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {activeTab === "billing" && (
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-200">
                                    <h2 className="text-base font-bold text-slate-900">Current Plan</h2>
                                    <p className="text-xs text-slate-500 mt-1">You are currently on the {userData?.billing?.current_plan} plan.</p>
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex justify-between items-end mb-1">
                                                <span className="text-sm font-medium text-slate-700">Monthly Usage</span>
                                                <span className="text-sm font-semibold text-slate-900">
                                                    {userData?.usage?.messages_sent || 0} / {userData?.billing?.monthly_limit || 100} messages
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                                                    style={{ width: `${Math.min(((userData?.usage?.messages_sent || 0) / (userData?.billing?.monthly_limit || 100)) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500">Your usage resets on {userData?.usage?.reset_date ? new Date(userData.usage.reset_date).toLocaleDateString() : 'the 1st of next month'}.</p>
                                        </div>
                                        <div className="shrink-0 flex gap-2">
                                            <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                                                View Invoices
                                            </button>
                                            <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                                                Upgrade Plan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="bg-white rounded-xl border border-indigo-200 shadow-sm p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3">
                                        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">Most Popular</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Professional</h3>
                                    <div className="mt-1 flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-slate-900">$29</span>
                                        <span className="text-sm text-slate-500">/month</span>
                                    </div>
                                    <ul className="mt-5 space-y-3">
                                        {[
                                            "1,000 messages / month",
                                            "Unlimited Chatbots",
                                            "Custom Branding",
                                            "Priority Support",
                                            "Advanced Analytics"
                                        ].map((feat, i) => (
                                            <li key={feat} className="flex items-center gap-2 text-sm text-slate-600">
                                                <HiShieldCheck className="w-5 h-5 text-indigo-500" />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="mt-6 w-full py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                                        Get Started
                                    </button>
                                </div>

                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                    <h3 className="text-lg font-bold text-slate-900">Enterprise</h3>
                                    <div className="mt-1 flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-slate-900">Custom</span>
                                    </div>
                                    <ul className="mt-5 space-y-3">
                                        {[
                                            "Unlimited everything",
                                            "SLA Guarantees",
                                            "Dedicated Account Manager",
                                            "Custom Integrations",
                                            "On-premise deployment"
                                        ].map((feat, i) => (
                                            <li key={feat} className="flex items-center gap-2 text-sm text-slate-600">
                                                <HiShieldCheck className="w-5 h-5 text-slate-400" />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="mt-6 w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-all">
                                        Contact Sales
                                    </button>
                                </div>
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
            </div>
        </div>
    );
}
