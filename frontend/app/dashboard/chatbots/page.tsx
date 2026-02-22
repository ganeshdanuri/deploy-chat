/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { HiChatAlt2, HiPlus, HiRefresh, HiSparkles, HiTrash, HiCode, HiSearch } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchChatbots, deleteChatbot } from "@/lib/store/slices/chatbotsSlice";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import CreateChatbotModal from "@/app/components/CreateChatbotModal";
import EmbedDrawer from "@/app/components/EmbedDrawer";
import showToast from "@/lib/toast";
import { Button, Input } from "@heroui/react";
import { PageHeader, EmptyState, DateCell, StatusChip, ChatbotCardSkeleton, Tooltip } from "@/app/components/ui";
import type { Chatbot } from "@/lib/types";
import { theme } from "@/app/theme";


export default function ChatbotsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const [embedBot, setEmbedBot] = useState<Chatbot | null>(null);

    const dispatch = useAppDispatch();
    const { items: chatbots, status } = useAppSelector((state) => state.chatbots);
    const isLoading = status === "loading";

    useEffect(() => {
        dispatch(fetchChatbots());
    }, [dispatch]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm("Are you sure you want to delete this chatbot?")) return;
        try {
            await dispatch(deleteChatbot(id)).unwrap();
            showToast.success(`Chatbot "${name}" deleted successfully`);
        } catch (error: any) {
            showToast.error(error?.message || "Failed to delete chatbot");
        }
    };

    const handleResume = async (id: string, name: string) => {
        try {
            await api.post(ENDPOINTS.CHATBOTS.RESUME(id));
            showToast.success(`Resumed creation for chatbot "${name}"`);
            dispatch(fetchChatbots());
        } catch (error: any) {
            showToast.error(error?.response?.data?.detail || error?.message || "Failed to resume chatbot creation");
        }
    };

    const filteredChatbots = chatbots.filter(bot =>
        bot.name.toLowerCase().includes(filterValue.toLowerCase())
    );

    const ChatbotCard = ({ bot }: { bot: Chatbot }) => {
        const isCreating = (bot as any).status === "creating";
        const isFailed = (bot as any).status === "failed";

        return (
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative animate-fade-in">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                            <HiChatAlt2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 text-base">{bot.name}</h3>
                            <div className="flex items-center gap-2">
                                <StatusChip status={(bot as any).status} />
                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                    {(bot as any).chunk_count ?? 0} Chunks
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Tooltip content="Refresh Status">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => dispatch(fetchChatbots())}
                                className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md h-8 w-8"
                            >
                                <HiRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </Button>
                        </Tooltip>
                        {isFailed && (
                            <Tooltip content="Resume Creation">
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onPress={() => handleResume(bot.id, bot.name)}
                                    className="text-emerald-500 hover:bg-emerald-50 rounded-md h-8 w-8"
                                >
                                    <HiRefresh className="w-4 h-4" />
                                </Button>
                            </Tooltip>
                        )}
                        <Tooltip color="danger" content="Delete">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => handleDelete(bot.id, bot.name)}
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md h-8 w-8"
                            >
                                <HiTrash className="w-4 h-4" />
                            </Button>
                        </Tooltip>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Welcome Message</p>
                        <p className="text-xs text-slate-600 line-clamp-2 italic">
                            &quot;{bot.welcome_message || 'Hi! How can I help you today?'}&quot;
                        </p>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400 font-medium">Created</span>
                        <DateCell isoString={bot.created_at} className="text-slate-600 font-semibold" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Button
                        size="sm"
                        onPress={() => {
                            window.location.href = `/dashboard/playground?chatbotId=${bot.id}`;
                        }}
                        isDisabled={isCreating}
                        className="text-white text-xs font-medium rounded-lg hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-500/20 py-5"
                        style={{ backgroundColor: theme.colors.primary.main }}
                    >
                        <HiSparkles className="w-3.5 h-3.5 mr-1.5" />
                        Playground
                    </Button>
                    <Button
                        size="sm"
                        isDisabled={isCreating}
                        onPress={() => setEmbedBot(bot)}
                        className="bg-white text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-all shadow-sm border border-slate-200 py-5"
                    >
                        <HiCode className="w-3.5 h-3.5 mr-1.5" />
                        Embed Code
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <PageHeader
                title="Chatbots"
                description="Manage, train and deploy your AI assistants."
                actions={
                    chatbots.length > 0 ? (
                        <div className="flex gap-2 items-center">
                            <Button
                                onPress={() => dispatch(fetchChatbots())}
                                variant="bordered"
                                isLoading={isLoading}
                                startContent={<HiRefresh className={`w-4 h-4 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />}
                                className="bg-white border-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-all hover:bg-slate-50 h-11 px-6 shadow-sm mr-2"
                            >
                                Refresh Sync Status
                            </Button>
                            <Button
                                onPress={() => setIsModalOpen(true)}
                                startContent={<HiPlus className="w-4 h-4" />}
                                className="text-white text-xs sm:text-sm font-medium rounded-lg transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-500/20 h-11 px-6"
                                style={{ backgroundColor: theme.colors.primary.main }}
                            >
                                New Chatbot
                            </Button>
                        </div>
                    ) : null
                }
            />

            {isLoading && chatbots.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <ChatbotCardSkeleton key={i} />
                    ))}
                </div>
            ) : chatbots.length === 0 ? (
                <EmptyState
                    icon={HiSparkles}
                    title="No chatbots active"
                    description="Once you've uploaded documents and created datasets, you can build your first AI chatbot."
                    actionLabel="Create your first chatbot"
                    onAction={() => setIsModalOpen(true)}
                    accentColor="indigo"
                />
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between gap-3 items-center">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[320px]"
                            placeholder="Search chatbots..."
                            startContent={<HiSearch className="text-slate-400 ml-1" />}
                            value={filterValue}
                            variant="bordered"
                            onClear={() => setFilterValue("")}
                            onValueChange={setFilterValue}
                            classNames={{
                                inputWrapper: "rounded-lg border border-slate-200 h-11 px-4 hover:border-indigo-400 data-[focus=true]:border-indigo-500 shadow-none bg-white transition-all",
                                input: "font-medium text-sm text-slate-800 placeholder:text-slate-400 ml-2"
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredChatbots.map((bot) => (
                            <ChatbotCard key={bot.id} bot={bot} />
                        ))}
                    </div>
                </div>
            )}

            <CreateChatbotModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {embedBot && (
                <EmbedDrawer
                    isOpen={!!embedBot}
                    onClose={() => setEmbedBot(null)}
                    chatbot={embedBot}
                />
            )}
        </div>
    );
}
