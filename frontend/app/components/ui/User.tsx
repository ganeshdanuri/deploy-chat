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
            <Avatar className={cn("h-8 w-8 rounded-lg", avatarProps?.className)}>
                {avatarProps?.src && <AvatarImage src={avatarProps.src} />}
                <AvatarFallback className="rounded-lg">
                    {avatarProps?.fallback || name.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className={cn("text-sm font-medium text-slate-800", classNames?.name)}>
                    {name}
                </span>
                {description && (
                    <span className={cn("text-[10px] text-slate-400 font-bold uppercase tracking-wider", classNames?.description)}>
                        {description}
                    </span>
                )}
            </div>
        </div>
    );
};
