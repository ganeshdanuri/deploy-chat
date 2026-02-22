"use client";


interface StatusChipProps {
    status?: "active" | "creating" | "failed" | string;
}

/**
 * Dynamic status chip used in dashboard list tables.
 */
export function StatusChip({ status = "active" }: StatusChipProps) {
    const isCreating = status === "creating";
    const isFailed = status === "failed";

    const bgClass = isCreating ? "bg-amber-50 border-amber-200" : isFailed ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200";
    const textClass = isCreating ? "text-amber-700" : isFailed ? "text-red-700" : "text-emerald-700";
    const label = isCreating ? "Creating" : isFailed ? "Failed" : "Active";

    return (
        <div className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${bgClass} ${textClass}`}>
            <span className={`w-1 h-1 rounded-full mr-1.5 ${isCreating ? "bg-amber-500 animate-pulse" : isFailed ? "bg-red-500" : "bg-emerald-500"}`} />
            {label}
        </div>
    );
}
