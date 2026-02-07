"use client";

import { useState } from "react";
import { HiUser, HiKey, HiCreditCard, HiUsers, HiBell, HiShieldCheck } from "react-icons/hi";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");

    const tabs = [
        { id: "general", label: "General", icon: HiUser },
        { id: "team", label: "Team Members", icon: HiUsers },
        { id: "billing", label: "Billing & Plans", icon: HiCreditCard },
        { id: "api-keys", label: "API Keys", icon: HiKey },
        { id: "notifications", label: "Notifications", icon: HiBell },
    ];

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">Settings</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Navigation */}
                <div className="w-full lg:w-64 shrink-0">
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left
                    ${activeTab === tab.id
                                            ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }
                  `}
                                >
                                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? "text-indigo-600" : "text-slate-400"}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="flex-1 max-w-3xl space-y-6">
                    {activeTab === "general" && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200">
                                <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
                                <p className="text-sm text-slate-500 mt-1">Update your account's profile information and email address.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl font-bold border-2 border-white shadow-md">
                                        CH
                                    </div>
                                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                                        Change Photo
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">First Name</label>
                                        <input type="text" className="w-full border-slate-200 rounded-lg text-sm focus:ring-indigo-500" defaultValue="Courtney" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Last Name</label>
                                        <input type="text" className="w-full border-slate-200 rounded-lg text-sm focus:ring-indigo-500" defaultValue="Henry" />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <div className="relative">
                                            <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <input type="email" className="w-full pl-9 border-slate-200 rounded-lg text-sm focus:ring-indigo-500" defaultValue="courtney.henry@docking.ai" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                                <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-slate-800 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "api-keys" && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">API Keys</h2>
                                    <p className="text-sm text-slate-500 mt-1">Manage your API keys for external integrations.</p>
                                </div>
                                <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                                    Create New Key
                                </button>
                            </div>
                            <div className="divide-y divide-slate-100">
                                <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                            <HiKey className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">Production Key</h4>
                                            <code className="text-xs text-slate-500 font-mono bg-slate-100 px-1 py-0.5 rounded">sk_live_...8f92</code>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-400">Created 2 days ago</div>
                                </div>
                                <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                            <HiKey className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">Test Environment</h4>
                                            <code className="text-xs text-slate-500 font-mono bg-slate-100 px-1 py-0.5 rounded">pk_test_...b12a</code>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-400">Created 1 month ago</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Other tabs placeholder */}
                    {(activeTab !== "general" && activeTab !== "api-keys") && (
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
