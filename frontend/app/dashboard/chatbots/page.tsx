/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { HiChatAlt2, HiPlus, HiRefresh, HiSparkles, HiTrash, HiCode, HiSearch, HiPencil } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchChatbots, deleteChatbot } from "@/lib/store/slices/chatbotsSlice";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import CreateAIAssistantDrawer from "../../components/CreateAIAssistantDrawer";
import EmbedDrawer from "../../components/EmbedDrawer";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState, DateCell, StatusChip, ChatbotCardSkeleton, Tooltip, DeleteConfirmationModal, Input } from "@/app/components/ui";
import type { Chatbot } from "@/lib/types";
import { theme } from "@/app/theme";
import { STATUS } from "@/lib/constants";


export default function ChatbotsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const [embedBot, setEmbedBot] = useState<Chatbot | null>(null);
    const [editBot, setEditBot] = useState<Chatbot | null>(null);

    const dispatch = useAppDispatch();
    const { items: chatbots, status } = useAppSelector((state) => state.chatbots);
    const isLoading = status === "loading";

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchChatbots());
    }, [dispatch]);

    const handleDeleteClick = (id: string, name: string) => {
        setItemToDelete({ id, name });
        setDeleteModalOpen(true);
    };

    const handleEditClick = (bot: Chatbot) => {
        setEditBot(bot);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await dispatch(deleteChatbot(itemToDelete.id)).unwrap();
            showToast.success(`AI Assistant "${itemToDelete.name}" deleted successfully`);
            setDeleteModalOpen(false);
        } catch (error: any) {
            showToast.error(error?.message || "Failed to delete chatbot");
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
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
        const isCreating = (bot as any).status === STATUS.CREATING;
        const isFailed = (bot as any).status === STATUS.FAILED;

        return (
            <div className="bg-white border border-[#e3e2e5] rounded-sm p-5 hover:border-[#262ef2]/20 hover:shadow-xl hover:shadow-[#262ef2]/5 transition-all group relative animate-fade-in">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#262ef2]/5 to-[#f3f3f9] border border-[#e3e2e5] rounded-sm flex items-center justify-center text-[#262ef2] shadow-sm">
                            <HiChatAlt2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#201f32] text-base">{bot.name}</h3>
                            <div className="flex items-center gap-2">
                                <StatusChip status={(bot as any).status} />
                                <span className="text-[10px] text-[#a1a1a1] font-medium uppercase tracking-wider">
                                    {(bot as any).chunk_count ?? 0} Chunks
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Tooltip content="Edit">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditClick(bot)}
                                className="text-[#a1a1a1] hover:text-[#262ef2] hover:bg-[#262ef2]/5 rounded-sm h-8 w-8 px-0"
                            >
                                <HiPencil className="w-4 h-4" />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Refresh Status">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => dispatch(fetchChatbots())}
                                className="text-[#a1a1a1] hover:text-[#262ef2] hover:bg-[#262ef2]/5 rounded-sm h-8 w-8 px-0"
                            >
                                <HiRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </Button>
                        </Tooltip>
                        {isFailed && (
                            <Tooltip content="Resume Creation">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleResume(bot.id, bot.name)}
                                    className="text-[#10b981] hover:bg-[#10b981]/5 rounded-sm h-8 w-8 px-0"
                                >
                                    <HiRefresh className="w-4 h-4" />
                                </Button>
                            </Tooltip>
                        )}
                        <Tooltip content="Delete">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteClick(bot.id, bot.name)}
                                className="text-[#a1a1a1] hover:text-[#ef4444] hover:bg-[#ef4444]/5 rounded-sm h-8 w-8 px-0"
                            >
                                <HiTrash className="w-4 h-4" />
                            </Button>
                        </Tooltip>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="bg-[#f3f3f9] p-3 border border-[#e3e2e5] rounded-sm">
                        <p className="text-[10px] font-bold text-[#a1a1a1] uppercase tracking-widest mb-1">Welcome Message</p>
                        <p className="text-xs text-[#4d5564] line-clamp-2 italic">
                            &quot;{bot.welcome_message || 'Hi! How can I help you today?'}&quot;
                        </p>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#a1a1a1] font-medium">Created</span>
                        <DateCell isoString={bot.created_at} className="text-[#201f32] font-semibold" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Button
                        size="sm"
                        onClick={() => {
                            window.location.href = `/dashboard/playground?chatbotId=${bot.id}`;
                        }}
                        disabled={isCreating}
                        className="text-white text-xs font-medium hover:-translate-y-0.5 transition-all shadow-lg shadow-[#262ef2]/10 py-5"
                        style={{ backgroundColor: "#262ef2" }}
                    >
                        <HiSparkles className="w-3.5 h-3.5 mr-1.5" />
                        Playground
                    </Button>
                    <Button
                        size="sm"
                        disabled={isCreating}
                        onClick={() => setEmbedBot(bot)}
                        className="bg-white text-[#4d5564] text-[11px] font-bold hover:bg-[#f3f3f9] transition-all shadow-sm border border-[#e3e2e5] py-5"
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
                title="AI Assistants"
                description="Manage, train and deploy your intelligent agents."
                actions={
                    chatbots.length > 0 ? (
                        <div className="flex gap-2 items-center">
                            <Button
                                onClick={() => dispatch(fetchChatbots())}
                                variant="outline"
                                className="bg-white border-[#e3e2e5] text-[#4d5564] text-xs sm:text-sm font-medium transition-all hover:bg-[#f3f3f9] h-11 px-6 shadow-sm mr-2"
                                disabled={isLoading}
                            >
                                <HiRefresh className={`w-4 h-4 mr-2 text-[#a1a1a1] ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh Status
                            </Button>
                            <Button
                                onClick={() => {
                                    setEditBot(null);
                                    setIsModalOpen(true);
                                }}
                                className="text-white text-xs sm:text-sm font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-[#262ef2]/20 h-11 px-6"
                                style={{ backgroundColor: "#262ef2" }}
                            >
                                <HiPlus className="w-4 h-4 mr-2" />
                                New Assistant
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
                    description="Once you've uploaded source files and created knowledge bases, you can build your first AI assistant."
                    actionLabel="Create your first assistant"
                    onAction={() => {
                        setEditBot(null);
                        setIsModalOpen(true);
                    }}
                    accentColor="indigo"
                />
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between gap-3 items-center">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[320px]"
                            placeholder="Search assistants..."
                            startContent={<HiSearch className="text-[#a1a1a1]" />}
                            value={filterValue}
                            onClear={() => setFilterValue("")}
                            onValueChange={setFilterValue}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredChatbots.map((bot) => (
                            <ChatbotCard key={bot.id} bot={bot} />
                        ))}
                    </div>
                </div>
            )}

            <CreateAIAssistantDrawer
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditBot(null);
                }}
                editBot={editBot}
            />

            {embedBot && (
                <EmbedDrawer
                    isOpen={!!embedBot}
                    onClose={() => setEmbedBot(null)}
                    chatbot={embedBot}
                />
            )}

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Delete AI Assistant"
                description="Are you sure you want to delete this assistant? This will also remove all its chat history and analytics."
                itemName={itemToDelete?.name}
            />
        </div>
    );
}
