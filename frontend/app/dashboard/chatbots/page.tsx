"use client";

import { useEffect } from "react";
import { HiChatAlt2, HiPlus, HiRefresh, HiSparkles, HiTrash, HiCog } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchChatbots, deleteChatbot } from "@/lib/store/slices/chatbotsSlice";
import CreateChatbotModal from "@/app/components/CreateChatbotModal";
import showToast from "@/lib/toast";
import { User, Tooltip, Button } from "@heroui/react";
import { PageHeader, EmptyState, StyledTable, DateCell, StatusChip, TableSkeleton } from "@/app/components/ui";
import type { TableColumnDef } from "@/app/components/ui";
import type { Chatbot } from "@/lib/types";
import { useState } from "react";

const COLUMNS: TableColumnDef[] = [
    { key: "name", label: "NAME" },
    { key: "status", label: "STATUS" },
    { key: "created_at", label: "CREATED AT" },
    { key: "actions", label: "ACTIONS", align: "end" },
];

export default function ChatbotsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const renderCell = (bot: Chatbot, columnKey: React.Key) => {
        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{
                            radius: "lg",
                            src: "",
                            fallback: <HiChatAlt2 className="w-4 h-4 text-indigo-600" />,
                            className: "bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200",
                            size: "sm",
                        }}
                        description="AI Assistant"
                        name={bot.name}
                        classNames={{
                            name: "font-medium text-sm text-slate-800",
                            description: "text-xs text-slate-400",
                        }}
                    />
                );
            case "status":
                return <StatusChip />;
            case "created_at":
                return <DateCell isoString={bot.created_at} />;
            case "actions":
                return (
                    <div className="relative flex items-center justify-end gap-2">
                        <Button
                            size="sm"
                            onPress={() => {
                                window.location.href = `/dashboard/playground?chatbotId=${bot.id}`;
                            }}
                            className="bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100"
                        >
                            <HiSparkles className="w-3 h-3 mr-1" />
                            Test
                        </Button>
                        <Tooltip content="Settings">
                            <Button isIconOnly size="sm" variant="light" className="text-slate-400 hover:text-indigo-600">
                                <HiCog className="w-4 h-4" />
                            </Button>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => handleDelete(bot.id, bot.name)}
                                className="text-slate-400 hover:text-red-500"
                            >
                                <HiTrash className="w-4 h-4" />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return String((bot as any)[columnKey as string] ?? "");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <PageHeader
                title="Chatbots"
                description="Manage, train and deploy your AI assistants."
                actions={
                    <>
                        <Button
                            onPress={() => dispatch(fetchChatbots())}
                            variant="bordered"
                            startContent={<HiRefresh className="w-4 h-4 text-slate-400" />}
                            className="bg-white border-slate-200 text-slate-700 font-medium rounded-lg"
                        >
                            Refresh
                        </Button>
                        <Button
                            onPress={() => setIsModalOpen(true)}
                            color="primary"
                            startContent={<HiPlus className="w-4 h-4" />}
                            className="bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-indigo-200"
                        >
                            New Chatbot
                        </Button>
                    </>
                }
            />

            {isLoading && chatbots.length === 0 ? (
                <TableSkeleton rows={5} columns={4} />
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
                <StyledTable
                    aria-label="Chatbots list"
                    columns={COLUMNS}
                    items={chatbots}
                    renderCell={renderCell}
                />
            )}

            <CreateChatbotModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
