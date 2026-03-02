"use client";

import { useState } from "react";
import { HiKey } from "react-icons/hi";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import showToast from "@/lib/toast";
import Drawer from "./Drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui/Input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
                variant="outline"
                onClick={handleClose}
                className="font-medium bg-white h-10 px-6 border border-[#e3e2e5] text-[#5a5a6a] shadow-sm transition-all hover:bg-[#f3f3f9]"
            >
                Cancel
            </Button>
            <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="text-white font-bold h-10 px-8 shadow-lg shadow-[#262ef2]/10 transition-all"
                style={{ backgroundColor: "#262ef2" }}
            >
                {isLoading ? "Processing..." : "Add Key"}
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
                    <label className="text-[11px] font-black text-[#a1a1a1] uppercase tracking-widest ml-1">Provider</label>
                    <Select
                        value={provider}
                        onValueChange={setProvider}
                    >
                        <SelectTrigger className="border border-[#e3e2e5] bg-white h-11 transition-all focus:border-[#262ef2] outline-none">
                            <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent className="border border-[#e3e2e5] bg-white">
                            {PROVIDERS.map((p) => (
                                <SelectItem key={p.value} value={p.value}>
                                    {p.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-black text-[#a1a1a1] uppercase tracking-widest ml-1">API Key</label>
                    <Input
                        type="password"
                        placeholder="sk-..."
                        value={apiKey}
                        onValueChange={setApiKey}
                    />
                    <p className="text-[10px] text-[#a1a1a1] font-medium px-1">
                        Your keys are encrypted at rest.
                    </p>
                </div>
            </div>
        </Drawer>
    );
}
