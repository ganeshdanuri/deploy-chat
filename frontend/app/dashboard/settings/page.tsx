"use client";

import { useState, useEffect } from "react";
import { HiUser, HiKey, HiCreditCard, HiUsers, HiBell, HiShieldCheck, HiPlus, HiTrash, HiPencil } from "react-icons/hi";
import { SiOpenai, SiAnthropic, SiGooglecloud } from "react-icons/si";
import { useAppSelector } from "@/lib/store/hooks";
import { useAuth } from "@/app/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { PricingCard } from "@/app/components/ui/PricingCard";
import { SettingsSkeleton, TableSkeleton } from "@/app/components/ui/Skeleton";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import showToast from "@/lib/toast";
import AddAPIKeyDrawer from "@/app/components/AddAPIKeyDrawer";
import EditProfileDrawer from "@/app/components/EditProfileDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState, DateCell, DeleteConfirmationModal, Input } from "@/app/components/ui";

export default function SettingsPage() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "general");
    const [apiKeys, setApiKeys] = useState<any[]>([]);
    const [isApiKeysLoading, setIsApiKeysLoading] = useState(false);
    const [isAddKeyModalOpen, setIsAddKeyModalOpen] = useState(false);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && tab !== activeTab) {
            queueMicrotask(() => setActiveTab(tab));
        }
    }, [searchParams, activeTab]);

    useEffect(() => {
        if (activeTab === "api-keys") {
            fetchApiKeys();
        }
    }, [activeTab]);

    const fetchApiKeys = async () => {
        setIsApiKeysLoading(true);
        try {
            const res = await api.get(ENDPOINTS.API_KEYS.BASE);
            setApiKeys(res.data);
        } catch (err) {
            showToast.error("Failed to load API keys");
        } finally {
            setIsApiKeysLoading(false);
        }
    };

    const handleDeleteClick = (id: string, provider: string) => {
        setItemToDelete({ id, name: provider });
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(ENDPOINTS.API_KEYS.BY_ID(itemToDelete.id));
            showToast.success("API key deleted");
            setDeleteModalOpen(false);
            fetchApiKeys();
        } catch (err) {
            showToast.error("Failed to delete API key");
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

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

    const getProviderIcon = (provider: string) => {
        switch (provider.toLowerCase()) {
            case 'openai': return SiOpenai;
            case 'anthropic': return SiAnthropic;
            case 'google': return SiGooglecloud;
            default: return HiKey;
        }
    };

    return (
        <div className="animate-fade-in-up max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e3e2e5]">
                <div>
                    <h1 className="text-2xl font-bold text-[#201f32] tracking-tight">{currentTabLabel}</h1>
                    <p className="text-sm text-[#4d5564] mt-1">Manage your account preferences and system configuration.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#a1a1a1] bg-[#f3f3f9] px-3 py-1.5 rounded-lg border border-[#e3e2e5]">
                    <HiShieldCheck className="w-4 h-4 text-[#262ef2]" />
                    Secure Settings
                </div>
            </div>

            <div className="space-y-6">
                <div className="w-full">
                    {isLoading ? (
                        <SettingsSkeleton />
                    ) : (
                        <div className="w-full">
                            {activeTab === "general" && (
                                <div className="bg-white rounded-2xl border border-[#e3e2e5] shadow-sm overflow-hidden animate-fade-in">
                                    <div className="p-6 border-b border-[#e3e2e5] flex items-center justify-between font-bold">
                                        <div>
                                            <h2 className="text-lg font-bold text-[#201f32]">Profile Information</h2>
                                            <p className="text-sm text-[#4d5564] mt-1">Update your account&apos;s profile information and email address.</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => setIsEditProfileModalOpen(true)}
                                            className="bg-[#f3f3f9] text-[#201f32] font-bold rounded-xl hover:bg-[#e3e2e5]"
                                        >
                                            <HiPencil className="w-3.5 h-3.5 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-[11px] font-black text-[#a1a1a1] uppercase tracking-widest ml-1">Username</label>
                                                <Input type="text" value={userData?.profile?.username || ""} readOnly disabled className="bg-[#f3f3f9] border-[#e3e2e5] opacity-60" />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-[11px] font-black text-[#a1a1a1] uppercase tracking-widest ml-1">Email Address</label>
                                                <Input
                                                    type="email"
                                                    startContent={<HiUser className="w-4 h-4 text-[#a1a1a1]" />}
                                                    value={userData?.profile?.email || authUser?.email || ""}
                                                    readOnly
                                                    disabled
                                                    className="bg-[#f3f3f9] border-[#e3e2e5] opacity-60"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "billing" && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="bg-white rounded-2xl border border-[#e3e2e5] shadow-sm overflow-hidden">
                                        <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#262ef2]/5 flex items-center justify-center border border-[#262ef2]/10 shrink-0">
                                                        <HiCreditCard className="w-5 h-5 text-[#262ef2]" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-lg font-bold text-[#201f32] flex items-center gap-2">
                                                            {userData?.billing?.current_plan ? userData.billing.current_plan.charAt(0).toUpperCase() + userData.billing.current_plan.slice(1) : 'Free'} plan
                                                            <span className="bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                                                        </h2>
                                                        <p className="text-sm text-[#4d5564] mt-0.5">
                                                            {userData?.billing?.expires_at
                                                                ? `Your plan will renew on ${new Date(userData.billing.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`
                                                                : 'You are currently on the free tier.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-2 text-[#4d5564] max-w-sm">
                                                    <div className="flex justify-between items-end mb-1.5">
                                                        <span className="text-sm font-semibold text-[#201f32]">
                                                            {userData?.usage?.messages_sent || 0} <span className="text-[#a1a1a1] font-medium">/ {userData?.billing?.monthly_limit || 100} msgs</span>
                                                        </span>
                                                        <span className="text-xs font-medium text-[#a1a1a1]">
                                                            Resets on {userData?.usage?.reset_date ? new Date(userData.usage.reset_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '1st of month'}
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-[#f3f3f9] rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ${((userData?.usage?.messages_sent || 0) / (userData?.billing?.monthly_limit || 100)) > 0.9 ? 'bg-[#ef4444]' : 'bg-[#262ef2]'}`}
                                                            style={{ width: `${Math.min(((userData?.usage?.messages_sent || 0) / (userData?.billing?.monthly_limit || 100)) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="shrink-0 pt-1">
                                                <button
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#f3f3f9] border border-[#e3e2e5] text-[#a1a1a1] text-sm font-medium rounded-lg cursor-not-allowed opacity-60 shadow-sm"
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

                            {activeTab === "api-keys" && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-[#201f32]">API Keys</h2>
                                            <p className="text-sm text-[#4d5564] mt-1">Manage platform keys for model providers.</p>
                                        </div>
                                        <Button
                                            onClick={() => setIsAddKeyModalOpen(true)}
                                            className="bg-[#201f32] text-white font-bold rounded-xl hover:bg-[#201f32]/90 shadow-lg shadow-[#201f32]/10"
                                        >
                                            <HiPlus className="w-4 h-4 mr-2" />
                                            Add Key
                                        </Button>
                                    </div>

                                    {isApiKeysLoading ? (
                                        <TableSkeleton rows={3} columns={3} />
                                    ) : apiKeys.length === 0 ? (
                                        <EmptyState
                                            icon={HiPlus}
                                            title="No API keys yet"
                                            description="Add your OpenAI or Anthropic key to use your own model quotas."
                                            actionLabel="Add your first key"
                                            onAction={() => setIsAddKeyModalOpen(true)}
                                        />
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            {apiKeys.map((key) => {
                                                const Icon = getProviderIcon(key.provider);
                                                return (
                                                    <Card key={key.id} className="border-[#e3e2e5] shadow-sm rounded-2xl">
                                                        <CardContent className="flex flex-row items-center justify-between p-6">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-10 h-10 rounded-xl bg-[#f3f3f9] flex items-center justify-center border border-[#e3e2e5]">
                                                                    <Icon className="w-5 h-5 text-[#201f32]" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-bold text-[#201f32] uppercase tracking-tight">{key.provider}</h4>
                                                                    <p className="text-xs text-[#a1a1a1] font-mono">••••••••••••••••</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <DateCell isoString={key.created_at} />
                                                                <Button
                                                                    variant="ghost"
                                                                    onClick={() => handleDeleteClick(key.id, key.provider)}
                                                                    className="text-[#a1a1a1] hover:text-[#ef4444] h-8 w-8 p-0"
                                                                >
                                                                    <HiTrash className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Other tabs placeholder */}
                            {(activeTab !== "general" && activeTab !== "billing" && activeTab !== "api-keys") && (
                                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-[#e3e2e5] border-dashed animate-fade-in">
                                    <div className="w-16 h-16 bg-[#f3f3f9] rounded-full flex items-center justify-center mb-4">
                                        <HiShieldCheck className="w-8 h-8 text-[#a1a1a1]/40" />
                                    </div>
                                    <h3 className="text-[#201f32] font-bold">Coming Soon</h3>
                                    <p className="text-[#4d5564] text-sm mt-1 font-medium">This settings panel is under construction.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <AddAPIKeyDrawer
                isOpen={isAddKeyModalOpen}
                onClose={() => setIsAddKeyModalOpen(false)}
                onSuccess={fetchApiKeys}
            />

            <EditProfileDrawer
                isOpen={isEditProfileModalOpen}
                onClose={() => setIsEditProfileModalOpen(false)}
                currentUsername={userData?.profile?.username || ""}
                currentEmail={userData?.profile?.email || authUser?.email || ""}
                onSuccess={() => {
                    window.location.reload(); // Quick way to refresh user data context
                }}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Remove API Key"
                description={`Are you sure you want to remove your ${itemToDelete?.name} API key?`}
                itemName={itemToDelete?.name}
            />
        </div >
    );
}
