"use client";

/**
 * Renders a date + time in two lines, using the consistent styling
 * used across all dashboard list tables.
 */
export function DateCell({ isoString }: { isoString: string }) {
    const date = new Date(isoString);
    return (
        <div className="flex flex-col">
            <p className="text-xs text-slate-600">{date.toLocaleDateString()}</p>
            <p className="text-xs text-slate-400 font-mono">
                {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
        </div>
    );
}
