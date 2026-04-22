"use client";
import { KeyRound } from "lucide-react";


import { useState } from "react";

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

interface AddAPIKeyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

import { LLM_PROVIDERS } from "@/lib/constants";

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
        } catch (err) {
            const error = err as { response?: { data?: { detail?: string } } };
            showToast.error(error.response?.data?.detail ||"Failed to add API key");
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
            <button onClick={handleClose} className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                Cancel
            </button>
            <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="rounded-xl"
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing…
                    </span>
                ) : "Add key"}
            </Button>
        </>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Platform Key"
            subtitle="Connect your own model provider for higher limits."
            icon={KeyRound}
            footer={footer}
>
            <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                    <label htmlFor="provider-select" className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider ml-1">Provider</label>
                    <Select
                        value={provider}
                        onValueChange={setProvider}
>
                        <SelectTrigger id="provider-select" className="border border-border bg-background h-11 transition-all focus:border-primary outline-none">
                            <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent className="border border-border bg-background">
                            {LLM_PROVIDERS.map((p) => (
                                <SelectItem key={p.value} value={p.value}>
                                    {p.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="api-key-input" className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider ml-1">API Key</label>
                    <Input
                        id="api-key-input"
                        type="password"
                        placeholder="sk-…"
                        value={apiKey}
                        onValueChange={setApiKey}
                        spellCheck={false}
                        autoComplete="off"
                    />
                    <p className="text-[10px] text-muted-foreground font-medium px-1">
                        Your keys are encrypted at rest.
                    </p>
                </div>
            </div>
        </Drawer>
    );
}
