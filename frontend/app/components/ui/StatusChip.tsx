"use client";

import { Chip } from "@heroui/react";

/**
 * Active status chip used in dashboard list tables.
 */
export function StatusChip() {
    return (
        <Chip
            className="capitalize border-none gap-1 text-emerald-700 bg-emerald-50"
            color="success"
            size="sm"
            variant="dot"
        >
            Active
        </Chip>
    );
}
