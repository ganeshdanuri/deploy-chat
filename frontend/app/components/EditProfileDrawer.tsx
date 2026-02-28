"use client";

import { useState } from "react";
import { HiUser } from "react-icons/hi";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import showToast from "@/lib/toast";
import Drawer from "./Drawer";
import { Button, Input } from "@heroui/react";
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
                variant="bordered"
                onPress={onClose}
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
                Save Changes
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
                        variant="bordered"
                        value={username}
                        onValueChange={setUsername}
                        classNames={{
                            inputWrapper: "rounded-xl border border-slate-100 bg-slate-50/50 h-12 shadow-none",
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <Input
                        type="email"
                        variant="bordered"
                        value={email}
                        onValueChange={setEmail}
                        classNames={{
                            inputWrapper: "rounded-xl border border-slate-100 bg-slate-50/50 h-12 shadow-none",
                        }}
                    />
                </div>
            </div>
        </Drawer>
    );
}
