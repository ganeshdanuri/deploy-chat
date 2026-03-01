"use client";

import { useState } from "react";
import { HiUser } from "react-icons/hi";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import showToast from "@/lib/toast";
import Drawer from "./Drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui";
import { theme } from "../theme";

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
        } catch (err: any) {
            showToast.error(err.response?.data?.detail || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const footer = (
        <>
            <Button
                variant="outline"
                onClick={onClose}
                className="font-medium bg-white rounded-lg h-10 px-6 border border-slate-100 text-slate-600 shadow-sm transition-all hover:bg-slate-50"
            >
                Cancel
            </Button>
            <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="text-white font-bold rounded-lg h-10 px-8 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: theme.colors.primary.main }}
            >
                {isLoading ? "Saving..." : "Save Changes"}
            </Button>
        </>
    );

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Profile"
            subtitle="Update your account details."
            icon={HiUser}
            footer={footer}
        >
            <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                    <Input
                        value={username}
                        onValueChange={setUsername}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
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
