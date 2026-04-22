"use client";
import { STATUS } from "@/lib/constants";


interface StatusChipProps {
    status?: "active" |"creating" |"failed" | string;
}

/**
 * Dynamic status chip used in dashboard list tables.
 */
export function StatusChip({ status = STATUS.ACTIVE }: StatusChipProps) {
    const isCreating = status === STATUS.CREATING;
    const isFailed = status === STATUS.FAILED;

    const bgClass = isCreating ? "bg-amber-50 border-amber-200" : isFailed ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200";
    const textClass = isCreating ? "text-amber-700" : isFailed ? "text-red-700" : "text-emerald-700";
    const label = isCreating ? "Creating" : isFailed ? "Failed" : "Active";

    return (
        <div className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-medium uppercase tracking-wider rounded-lg ${bgClass} ${textClass}`}>
            <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${isCreating ? "bg-amber-500 animate-pulse" : isFailed ? "bg-red-500" : "bg-emerald-500"}`} />
            {label}
        </div>
    );
}
