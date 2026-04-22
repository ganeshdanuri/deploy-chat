"use client";

import { Database, Sparkles, Trash2 } from "lucide-react";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDatasets } from "@/lib/store/slices/datasetsSlice";
import { createChatbot, fetchChatbots } from "@/lib/store/slices/chatbotsSlice";
import Drawer from "./Drawer";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui";
import { SelectableItemList, SelectableListSkeleton } from "./ui";
import type { SelectableItem } from "./ui";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";

interface CreateAIAssistantDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    editBot?: any;
}

export default function CreateAIAssistantDrawer({ isOpen, onClose, editBot }: CreateAIAssistantDrawerProps) {
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

    useEffect(() => {
        if (editBot && isOpen) {
            setName(editBot.name ||"");
            setWelcomeMessage(editBot.welcome_message ||"");
            setAllowedDomains(editBot.allowed_domains ? editBot.allowed_domains.split(",") : [""]);
        } else if (!editBot && isOpen) {
            setName("");
            setWelcomeMessage("");
            setAllowedDomains([""]);
            setSelectedDatasets([]);
        }
    }, [editBot, isOpen]);

    useEffect(() => {
        if (!editBot && name && (!welcomeMessage || welcomeMessage.startsWith("Hi! I am"))) {
            setWelcomeMessage(`Hi! I am ${name}. How can I help you today?`);
        }
    }, [name, welcomeMessage, editBot]);

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

        if (!name || (!editBot && selectedDatasets.length === 0) || !welcomeMessage || validDomains.length === 0) {
            showToast.error("All fields are mandatory. Please fill out all fields.");
            return;
        }

        const invalidDomains = validDomains.filter(d => !validateDomain(d));
        if (invalidDomains.length> 0) {
            showToast.error(`Invalid domain format(s): ${invalidDomains.join(",")}.`);
            return;
        }

        setIsSubmitting(true);
        try {
            if (editBot) {
                await api.patch(ENDPOINTS.CHATBOTS.BY_ID(editBot.id), {
                    name,
                    welcome_message: welcomeMessage,
                    allowed_domains: validDomains.join(","),
                });
                showToast.success(`AI Assistant"${name}" updated successfully!`);
                dispatch(fetchChatbots());
            } else {
                await dispatch(createChatbot({
                    name,
                    dataset_ids: selectedDatasets,
                    welcome_message: welcomeMessage,
                    allowed_domains: validDomains.join(","),
                })).unwrap();
                showToast.success(`AI Assistant"${name}" created successfully!`);
            }
            onClose();
        } catch (error: any) {
            showToast.error(error?.message || `Failed to ${editBot ? 'update' : 'create'} AI assistant.`);
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
        <>
            <button onClick={onClose} className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                Cancel
            </button>
            <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl whitespace-nowrap"
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing…
                    </span>
                ) : editBot ? "Save changes" : "Deploy assistant"}
            </Button>
        </>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={editBot ? "Edit AI Assistant" : "Deploy Assistant"}
            subtitle={editBot ? "Update your AI persona's configuration." : "Build a new AI persona powered by your knowledge base."}
            icon={Sparkles}
            footer={footer}
            size="2xl"
>
            <div className="space-y-8 animate-fade-in">
                <div className="space-y-3">
                    <label className="text-sm font-medium block text-foreground">Assistant Name</label>
                    <p className="text-xs text-muted-foreground">Give your AI a name that reflects its purpose.</p>
                    <Input
                        variant="bordered"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Customer Support Bot"
                        classNames={{
                            inputWrapper: "border border-border h-11 hover:border-primary/50 shadow-none bg-muted transition-all",
                            input: "font-medium text-sm text-foreground",
                        }}
                    />
                </div>

                {!editBot && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium block text-foreground">Knowledge Bases</label>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase bg-muted px-2 py-0.5 tracking-wider">
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
                                defaultIcon={Database}
                                accentColor="slate"
                                emptyIcon={Database}
                                emptyMessage={<>No knowledge bases available.</>}
                            />
                        )}
                    </div>
                )}

                <div className="space-y-6 pt-8 border-t border-border">
                    <div className="space-y-3">
                        <label className="text-sm font-medium block text-foreground">Welcome Message</label>
                        <Input
                            variant="bordered"
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
                            placeholder="Hi! How can I help you? "
                            classNames={{
                                inputWrapper: "border border-border h-11 hover:border-primary/50 shadow-none bg-muted transition-all font-mono italic",
                                input: "text-sm text-foreground",
                            }}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium block text-foreground">Allowed Domains</label>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setAllowedDomains([...allowedDomains,""])}
                                className="text-primary font-medium text-xs"
>
                                + ADD DOMAIN
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {allowedDomains.map((domain, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        variant="bordered"
                                        value={domain}
                                        onChange={(e) => {
                                            const newDomains = [...allowedDomains];
                                            newDomains[index] = e.target.value;
                                            setAllowedDomains(newDomains);
                                        }}
                                        placeholder="e.g., example.com"
                                        classNames={{
                                            inputWrapper: "border border-border h-11 hover:border-primary/50 shadow-none bg-muted",
                                            input: "font-medium text-sm text-foreground",
                                        }}
                                    />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            const newDomains = allowedDomains.filter((_, i) => i !== index);
                                            setAllowedDomains(newDomains.length === 0 ? [""] : newDomains);
                                        }}
                                        className="text-muted-foreground hover:text-red-500 p-0 h-8 w-8"
>
                                        <Trash2 className="w-5 h-5" />
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
