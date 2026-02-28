/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { HiDatabase, HiSparkles, HiTrash } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDatasets } from "@/lib/store/slices/datasetsSlice";
import { createChatbot } from "@/lib/store/slices/chatbotsSlice";
import Drawer from "./Drawer";
import showToast from "@/lib/toast";
import { Button, Input } from "@heroui/react";
import { SelectableItemList, SelectableListSkeleton } from "./ui";
import type { SelectableItem } from "./ui";
import { theme } from "../theme";

interface CreateAIAssistantDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateAIAssistantDrawer({ isOpen, onClose }: CreateAIAssistantDrawerProps) {
    const [name, setName] = useState("");
    const [welcomeMessage, setWelcomeMessage] = useState("");
    const [allowedDomains, setAllowedDomains] = useState<string[]>([""]);
    const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useAppDispatch();
    const { items: datasets, status: dsStatus } = useAppSelector((state) => state.datasets);

    useEffect(() => {
        if (isOpen && dsStatus === "idle") {
            dispatch(fetchDatasets());
        }
    }, [isOpen, dsStatus, dispatch]);

    // Auto-update welcome message if name changes and welcome message is empty or default
    useEffect(() => {
        if (name && (!welcomeMessage || welcomeMessage.startsWith("Hi! I am "))) {
            setWelcomeMessage(`Hi! I am ${name}. How can I help you today?`);
        }
    }, [name, welcomeMessage]);

    const toggleDataset = (id: string) => {
        setSelectedDatasets((prev) =>
            prev.includes(id) ? prev.filter((dsId) => dsId !== id) : [...prev, id]
        );
    };

    const validateDomain = (domain: string) => {
        const domainRegex = /^(?:https?:\/\/)?(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?)$/i;
        return domainRegex.test(domain) && domain !== "*";
    };

    const handleSubmit = async () => {
        const validDomains = allowedDomains.filter(d => d.trim() !== "");

        if (!name || selectedDatasets.length === 0 || !welcomeMessage || validDomains.length === 0) {
            showToast.error("All fields are mandatory. Please fill out all fields.");
            return;
        }

        // Validate formats
        const invalidDomains = validDomains.filter(d => !validateDomain(d));
        if (invalidDomains.length > 0) {
            showToast.error(`Invalid domain format(s): ${invalidDomains.join(", ")}. Please use valid domain names (e.g. example.com).`);
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(createChatbot({
                name,
                dataset_ids: selectedDatasets,
                welcome_message: welcomeMessage,
                allowed_domains: validDomains.join(","),
            })).unwrap();
            showToast.success(`AI Assistant "${name}" created successfully!`);
            setName("");
            setWelcomeMessage("");
            setAllowedDomains([""]);
            setSelectedDatasets([]);
            onClose();
        } catch (error: any) {
            showToast.error(error?.message || "Failed to create AI assistant. Please try again.");
            console.error("Failed to create assistant.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const datasetItems: SelectableItem[] = datasets.map((ds) => ({
        id: ds.id,
        label: ds.name,
        sublabel: "Knowledge Base Collection",
    }));

    const footer = (
        <div className="flex gap-4 w-full">
            <Button
                variant="bordered"
                onPress={onClose}
                className="flex-1 font-medium rounded-lg h-12 transition-all hover:bg-slate-50 border border-slate-100 text-slate-600 shadow-sm"
            >
                Cancel
            </Button>
            <Button
                onPress={handleSubmit}
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                className="flex-[1.5] text-white text-sm font-bold rounded-lg h-12 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: theme.colors.primary.main }}
            >
                {isSubmitting ? "Launching..." : "Deploy Assistant"}
            </Button>
        </div>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Deploy Assistant"
            subtitle="Build a new AI persona powered by your knowledge base."
            icon={HiSparkles}
            iconBgColor="bg-indigo-50"
            iconColor="text-indigo-600"
            footer={footer}
        >
            <div className="space-y-8 animate-fade-in">
                {/* Assistant Name */}
                <div className="space-y-3">
                    <label htmlFor="assistant-name" className="text-sm font-bold block text-slate-700">
                        Assistant Name
                    </label>
                    <p className="text-xs text-slate-400">Give your AI a name that reflects its purpose.</p>
                    <Input
                        id="assistant-name"
                        type="text"
                        variant="bordered"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Customer Support Bot"
                        classNames={{
                            inputWrapper: "rounded-lg border border-slate-100 h-11 hover:border-indigo-400 data-[focus=true]:border-indigo-500 shadow-none bg-slate-50 transition-all",
                            input: "font-medium text-sm text-slate-800 placeholder:text-slate-400",
                        }}
                    />
                </div>

                {/* Knowledge Base Selection */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold block text-slate-700">
                            Knowledge Bases
                        </label>
                        <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-full tracking-wider">
                            {selectedDatasets.length} selected
                        </span>
                    </div>
                    {dsStatus === "loading" ? (
                        <SelectableListSkeleton rows={3} />
                    ) : (
                        <SelectableItemList
                            items={datasetItems}
                            selectedIds={selectedDatasets}
                            onToggle={toggleDataset}
                            defaultIcon={HiDatabase}
                            accentColor="indigo"
                            emptyIcon={HiDatabase}
                            emptyMessage={
                                <>No knowledge bases available.<br />Create a knowledge base first.</>
                            }
                        />
                    )}
                </div>

                {/* Configuration */}
                <div className="space-y-6 pt-8 border-t border-slate-100">
                    <div className="space-y-3">
                        <label htmlFor="welcome-msg" className="text-sm font-bold block text-slate-700">
                            Welcome Message
                        </label>
                        <Input
                            id="welcome-msg"
                            type="text"
                            variant="bordered"
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
                            placeholder="Hi! How can I help you?"
                            classNames={{
                                inputWrapper: "rounded-lg border border-slate-100 h-11 hover:border-indigo-400 data-[focus=true]:border-indigo-500 shadow-none bg-slate-50 transition-all font-mono italic",
                                input: "text-sm text-slate-800",
                            }}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold block text-slate-700">
                                Allowed Domains
                            </label>
                            <Button
                                size="sm"
                                variant="light"
                                onPress={() => setAllowedDomains([...allowedDomains, ""])}
                                className="text-indigo-600 hover:bg-indigo-50 font-bold text-xs"
                            >
                                + ADD DOMAIN
                            </Button>
                        </div>
                        <p className="text-xs text-slate-400">Specify valid website domains where this assistant can be embedded.</p>

                        <div className="space-y-3">
                            {allowedDomains.map((domain, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        type="text"
                                        variant="bordered"
                                        value={domain}
                                        onChange={(e) => {
                                            const newDomains = [...allowedDomains];
                                            newDomains[index] = e.target.value;
                                            setAllowedDomains(newDomains);
                                        }}
                                        placeholder="e.g., example.com"
                                        classNames={{
                                            inputWrapper: "rounded-lg border border-slate-100 h-11 hover:border-indigo-400 data-[focus=true]:border-indigo-500 shadow-none bg-slate-50 transition-all",
                                            input: "font-medium text-sm text-slate-800 placeholder:text-slate-400",
                                        }}
                                    />
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onPress={() => {
                                            const newDomains = allowedDomains.filter((_, i) => i !== index);
                                            setAllowedDomains(newDomains.length === 0 ? [""] : newDomains);
                                        }}
                                        className="text-slate-400 hover:text-red-500 shrink-0"
                                    >
                                        <HiTrash className="w-5 h-5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
