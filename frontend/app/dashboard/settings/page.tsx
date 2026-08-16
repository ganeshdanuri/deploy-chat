"use client";
import { Bell, CreditCard, Pencil, ShieldCheck, User, Users } from "lucide-react";


import { useState, useEffect } from "react";

import { useAppSelector } from "@/lib/store/hooks";
import { useAuth } from "@/app/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { PricingCard } from "@/app/components/ui/PricingCard";
import { SettingsSkeleton } from "@/app/components/ui/Skeleton";
import EditProfileDrawer from "@/app/components/EditProfileDrawer";
import { Button } from "@/components/ui/button";
import { Input, PageHeader } from "@/app/components/ui";

export default function SettingsPage() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") ||"general");
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && tab !== activeTab) {
            queueMicrotask(() => setActiveTab(tab));
        }
    }, [searchParams, activeTab]);





    const { data: userData, status: userStatus } = useAppSelector((state) => state.user);
    const { user: authUser } = useAuth();
    const isLoading = userStatus === "loading";

    const tabs = [
        { id: "general", label: "General", icon: User },
        { id: "team", label: "Team Members", icon: Users },
        { id: "billing", label: "Billing & Plans", icon: CreditCard },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    const currentTabLabel = tabs.find(t => t.id === activeTab)?.label ||"Settings";


    return (
        <div className="animate-fade-in-up max-w-5xl mx-auto space-y-6">
            <PageHeader
                title={currentTabLabel}
                description="Manage your account preferences and system configuration."
            />

            <div className="space-y-6">
                <div className="w-full">
                    {isLoading ? (
                        <SettingsSkeleton />
                    ) : (
                        <div className="w-full">
                            {activeTab === "general" && (
                                <div className="bg-background border border-border rounded-xl overflow-hidden animate-fade-in">
                                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                                        <div>
                                            <h2 className="text-[15px] font-medium text-foreground">Profile information</h2>
                                            <p className="text-xs text-muted-foreground mt-0.5">Your account&apos;s profile information and email address.</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setIsEditProfileModalOpen(true)}
>
                                            <Pencil className="w-3.5 h-3.5 mr-1.5" />
                                            Edit
                                        </Button>
                                    </div>
                                    <div className="p-5 space-y-5">
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="col-span-2 space-y-1.5">
                                                <label className="text-xs font-medium text-muted-foreground">Username</label>
                                                <Input type="text" value={userData?.profile?.username ||""} readOnly disabled className="bg-muted border-border opacity-70" />
                                            </div>
                                            <div className="col-span-2 space-y-1.5">
                                                <label className="text-xs font-medium text-muted-foreground">Email address</label>
                                                <Input
                                                    type="email"
                                                    startContent={<User className="w-4 h-4 text-muted-foreground" />}
                                                    value={userData?.profile?.email || authUser?.email ||""}
                                                    readOnly
                                                    disabled
                                                    className="bg-muted border-border opacity-70"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "billing" && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="dash-card bg-background border border-border rounded-xl overflow-hidden">
                                        <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border shrink-0">
                                                        <CreditCard className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
                                                            {userData?.billing?.current_plan ? userData.billing.current_plan.charAt(0).toUpperCase() + userData.billing.current_plan.slice(1) : 'Free'} plan
                                                            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-medium px-2 py-0.5 rounded-lg uppercase tracking-wider">Active</span>
                                                        </h2>
                                                        <p className="text-sm text-foreground mt-0.5">
                                                            {userData?.billing?.expires_at
                                                                ? `Your plan will renew on ${new Date(userData.billing.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`
                                                                : 'You are currently on the free tier.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-2 text-foreground max-w-sm">
                                                    <div className="flex justify-between items-end mb-1.5">
                                                        <span className="text-sm font-medium text-foreground">
                                                            {userData?.usage?.messages_sent || 0} <span className="text-muted-foreground font-medium">/ {userData?.billing?.monthly_limit || 100} msgs</span>
                                                        </span>
                                                        <span className="text-xs font-medium text-muted-foreground">
                                                            Resets on {userData?.usage?.reset_date ? new Date(userData.usage.reset_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '1st of month'}
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-muted rounded-lg overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-1000 ${((userData?.usage?.messages_sent || 0) / (userData?.billing?.monthly_limit || 100)) > 0.9 ? 'bg-red-500' : 'bg-foreground'}`}
                                                            style={{ width: `${Math.min(((userData?.usage?.messages_sent || 0) / (userData?.billing?.monthly_limit || 100)) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="shrink-0 pt-1">
                                                <button
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-muted border border-border rounded-xl text-muted-foreground text-sm font-medium cursor-not-allowed opacity-60"
                                                    disabled
>
                                                    View Invoices
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
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
                                            isDisabled={true}
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
                                            isDisabled={true}
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
                                            isDisabled={true}
                                        />
                                    </div>
                                </div>
                            )}


                            {/* Other tabs placeholder */}
                            {(activeTab !== "general" && activeTab !== "billing") && (
                                <div className="flex flex-col items-center justify-center p-12 bg-background border border-border border-dashed rounded-xl animate-fade-in">
                                    <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mb-4">
                                        <ShieldCheck className="w-8 h-8 text-muted-foreground/40" />
                                    </div>
                                    <h3 className="text-foreground font-medium">Coming Soon</h3>
                                    <p className="text-foreground text-sm mt-1 font-medium">This settings panel is under construction.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>


            <EditProfileDrawer
                isOpen={isEditProfileModalOpen}
                onClose={() => setIsEditProfileModalOpen(false)}
                currentUsername={userData?.profile?.username ||""}
                currentEmail={userData?.profile?.email || authUser?.email ||""}
                onSuccess={() => {
                    window.location.reload(); // Quick way to refresh user data context
                }}
            />

        </div>
    );
}
