"use client";

import { Chip } from "@heroui/react";

interface StatusChipProps {
    status?: "active" | "creating" | "failed" | string;
}

/**
 * Dynamic status chip used in dashboard list tables.
 */
export function StatusChip({ status = "active" }: StatusChipProps) {
    const isCreating = status === "creating";
    const isFailed = status === "failed";

    // Choose styles based on status
    const bgClass = isCreating ? "bg-amber-50" : isFailed ? "bg-red-50" : "bg-emerald-50";
    const textClass = isCreating ? "text-amber-700" : isFailed ? "text-red-700" : "text-emerald-700";
    const color = isCreating ? "warning" : isFailed ? "danger" : "success";
    const label = isCreating ? "Creating" : isFailed ? "Failed" : "Active";

    return (
        <Chip
            className={`capitalize border-none gap-1 ${textClass} ${bgClass}`}
            color={color}
            size="sm"
            variant="dot"
        >
            {label}
        </Chip>
    );
}
