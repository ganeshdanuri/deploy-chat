"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserProps {
    name: string;
    description?: string;
    avatarProps?: {
        src?: string;
        fallback?: React.ReactNode;
        className?: string;
    };
    classNames?: {
        name?: string;
        description?: string;
    };
    className?: string;
}

export const User = ({ name, description, avatarProps, classNames, className }: UserProps) => {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Avatar className={cn("h-8 w-8", avatarProps?.className)}>
                {avatarProps?.src && <AvatarImage src={avatarProps.src} />}
                <AvatarFallback>
                    {avatarProps?.fallback || name.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className={cn("text-sm font-medium text-[#201f32]", classNames?.name)}>
                    {name}
                </span>
                {description && (
                    <span className={cn("text-[10px] text-[#a1a1a1] font-bold uppercase tracking-wider", classNames?.description)}>
                        {description}
                    </span>
                )}
            </div>
        </div>
    );
};
