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
                    <label className="text-[11px] font-black text-[#a1a1a1] uppercase tracking-widest ml-1">Username</label>
                    <Input
                        value={username}
                        onValueChange={setUsername}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-black text-[#a1a1a1] uppercase tracking-widest ml-1">Email Address</label>
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
