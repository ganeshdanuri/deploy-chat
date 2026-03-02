"use client";

import React from "react";
import { Input as RawInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { HiX } from "react-icons/hi";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    isClearable?: boolean;
    onClear?: () => void;
    variant?: "bordered" | "flat";
    classNames?: {
        inputWrapper?: string;
        input?: string;
    };
    onValueChange?: (value: string) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ startContent, endContent, isClearable, onClear, classNames, onValueChange, className, onChange, value, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) onChange(e);
            if (onValueChange) onValueChange(e.target.value);
        };

        return (
            <div className={cn("relative flex items-center w-full", classNames?.inputWrapper)}>
                {startContent && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-muted-foreground">
                        {startContent}
                    </div>
                )}
                <RawInput
                    ref={ref}
                    value={value}
                    onChange={handleChange}
                    className={cn(
                        startContent && "pl-10",
                        (endContent || (isClearable && value)) && "pr-10",
                        classNames?.input,
                        className
                    )}
                    {...props}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {isClearable && value && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="text-muted-foreground hover:text-foreground outline-none transition-colors"
                        >
                            <HiX className="w-4 h-4" />
                        </button>
                    )}
                    {endContent && (
                        <div className="flex items-center text-muted-foreground">
                            {endContent}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

Input.displayName = "Input";
