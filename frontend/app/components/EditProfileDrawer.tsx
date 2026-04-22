"use client";
import { User } from "lucide-react";


import { useState } from "react";

import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import showToast from "@/lib/toast";
import Drawer from "./Drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui";

interface EditProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    currentUsername: string;
    currentEmail: string;
    onSuccess: () => void;
}

export default function EditProfileDrawer({ isOpen, onClose, currentUsername, currentEmail, onSuccess }: EditProfileDrawerProps) {
    const [username, setUsername] = useState(currentUsername);
    const [email, setEmail] = useState(currentEmail);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await api.patch(ENDPOINTS.USERS.ME, {
                username,
                email
            });
            showToast.success("Profile updated successfully");
            onSuccess();
            onClose();
        } catch (err) {
            const error = err as { response?: { data?: { detail?: string } } };
            showToast.error(error.response?.data?.detail ||"Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const footer = (
        <>
            <button onClick={onClose} className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
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
                        Saving…
                    </span>
                ) : "Save changes"}
            </Button>
        </>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Profile"
            subtitle="Update your account details."
            icon={User}
            footer={footer}
>
            <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                    <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider ml-1">Username</label>
                    <Input
                        value={username}
                        onValueChange={setUsername}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider ml-1">Email Address</label>
                    <Input
                        type="email"
                        value={email}
                        onValueChange={setEmail}
                    />
                </div>
            </div>
        </Drawer>
    );
}
