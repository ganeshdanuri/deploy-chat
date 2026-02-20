"use client";

import { useState, useEffect } from "react";
import { HiChatAlt2, HiPlus, HiRefresh, HiSparkles, HiTrash, HiCog } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchChatbots, deleteChatbot } from "@/lib/store/slices/chatbotsSlice";
import CreateChatbotModal from "@/app/components/CreateChatbotModal";
import showToast from "@/lib/toast";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Chip,
    Tooltip,
    Button,
    Spinner
} from "@heroui/react";

export default function ChatbotsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { items: chatbots, status, error } = useSelector((state: RootState) => state.chatbots);
    const isLoading = status === 'loading';

    useEffect(() => {
        dispatch(fetchChatbots());
    }, [dispatch]);


    const handleDelete = async (id: string, name: string) => {
        if (confirm("Are you sure you want to delete this chatbot?")) {
            try {
                await dispatch(deleteChatbot(id)).unwrap();
                showToast.success(`Chatbot "${name}" deleted successfully`);
            } catch (error: any) {
                showToast.error(error?.message || "Failed to delete chatbot");
            }
        }
    };

    const renderCell = (bot: any, columnKey: React.Key) => {
        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{
                            radius: "lg",
                            src: "",
                            fallback: <HiChatAlt2 className="w-4 h-4 text-indigo-600" />,
                            className: "bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200",
                            size: "sm"
                        }}
                        description="AI Assistant"
                        name={bot.name}
                        classNames={{
                            name: "font-medium text-sm text-slate-800",
                            description: "text-xs text-slate-400"
                        }}
                    >
                        {bot.name}
                    </User>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-emerald-700 bg-emerald-50"
                        color="success"
                        size="sm"
                        variant="dot"
                    >
                        Active
                    </Chip>
                );
            case "created_at":
                return (
                    <div className="flex flex-col">
                        <p className="text-xs text-slate-600">{new Date(bot.created_at).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-400 font-mono">
                            {new Date(bot.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex items-center justify-end gap-2">
                        <Button
                            size="sm"
                            onPress={() => window.location.href = `/dashboard/playground?chatbotId=${bot.id}`}
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
                return (bot as any)[columnKey as any];
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chatbots</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage, train and deploy your AI assistants.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onPress={() => dispatch(fetchChatbots())}
                        variant="bordered"
                        startContent={<HiRefresh className="w-4 h-4 text-slate-400" />}
                        className="bg-white border-slate-200 text-slate-700 font-semibold rounded-lg"
                    >
                        Refresh
                    </Button>
                    <Button
                        onPress={() => setIsModalOpen(true)}
                        color="primary"
                        startContent={<HiPlus className="w-4 h-4" />}
                        className="bg-indigo-600 text-white font-semibold rounded-lg shadow-indigo-200"
                    >
                        New Chatbot
                    </Button>
                </div>
            </div>

            {isLoading && chatbots.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner color="primary" size="lg" />
                </div>
            ) : chatbots.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                        <HiSparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No chatbots active</h2>
                    <p className="text-slate-500 max-w-sm text-center mb-8">
                        Once you've uploaded documents and created datasets, you can build your first AI chatbot.
                    </p>
                    <Button
                        onPress={() => setIsModalOpen(true)}
                        color="primary"
                        startContent={<HiPlus className="w-5 h-5" />}
                        className="bg-indigo-600 px-6 h-12 text-white font-bold rounded-xl shadow-lg shadow-indigo-200"
                    >
                        Create your first chatbot
                    </Button>
                </div>
            ) : (
                <Table
                    aria-label="Chatbots list"
                    classNames={{
                        base: "bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden",
                        thead: "bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold",
                        wrapper: "shadow-none p-0",
                        th: "bg-slate-50/50 text-slate-500"
                    }}
                >
                    <TableHeader>
                        <TableColumn key="name">NAME</TableColumn>
                        <TableColumn key="status">STATUS</TableColumn>
                        <TableColumn key="created_at">CREATED AT</TableColumn>
                        <TableColumn key="actions" align="end">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody items={chatbots}>
                        {(item) => (
                            <TableRow key={item.id} className="cursor-pointer hover:bg-slate-50/80 transition-colors">
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}

            <CreateChatbotModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
