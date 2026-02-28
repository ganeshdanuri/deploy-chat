"use client";

import { useState } from "react";
import { HiKey } from "react-icons/hi";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import showToast from "@/lib/toast";
import Drawer from "./Drawer";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { theme } from "../theme";

interface AddAPIKeyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const PROVIDERS = [
    { label: "OpenAI", value: "openai" },
    { label: "Anthropic", value: "anthropic" },
    { label: "Google Gemini", value: "google" },
];

export default function AddAPIKeyDrawer({ isOpen, onClose, onSuccess }: AddAPIKeyDrawerProps) {
    const [provider, setProvider] = useState("openai");
    const [apiKey, setApiKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!apiKey) {
            showToast.error("Please enter an API key");
            return;
        }
        setIsLoading(true);
        try {
            await api.post(ENDPOINTS.API_KEYS.BASE, {
                provider,
                api_key: apiKey
            });
            showToast.success("API key added successfully");
            onSuccess();
            handleClose();
        } catch (err: any) {
            showToast.error(err.response?.data?.detail || "Failed to add API key");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setApiKey("");
        setProvider("openai");
        onClose();
    };

    const footer = (
        <>
            <Button
                variant="bordered"
                onPress={handleClose}
                className="font-medium bg-white rounded-lg h-10 px-6 border border-slate-100 text-slate-600 shadow-sm transition-all hover:bg-slate-50"
            >
                Cancel
            </Button>
            <Button
                onPress={handleSubmit}
                isLoading={isLoading}
                className="text-white font-bold rounded-lg h-10 px-8 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: theme.colors.primary.main }}
            >
                Add Key
            </Button>
        </>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Platform Key"
            subtitle="Connect your own model provider for higher limits."
            icon={HiKey}
            footer={footer}
        >
            <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Provider</label>
                    <Select
                        selectedKeys={[provider]}
                        onChange={(e) => setProvider(e.target.value)}
                        variant="bordered"
                        classNames={{
                            trigger: "rounded-xl border border-slate-100 bg-slate-50/50 h-12 shadow-none",
                        }}
                    >
                        {PROVIDERS.map((p) => (
                            <SelectItem key={p.value}>
                                {p.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">API Key</label>
                    <Input
                        type="password"
                        placeholder="sk-..."
                        variant="bordered"
                        value={apiKey}
                        onValueChange={setApiKey}
                        classNames={{
                            inputWrapper: "rounded-xl border border-slate-100 bg-slate-50/50 h-12 shadow-none",
                        }}
                    />
                    <p className="text-[10px] text-slate-400 font-medium px-1">
                        Your keys are encrypted at rest.
                    </p>
                </div>
            </div>
        </Drawer>
    );
}
