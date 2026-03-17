"use client";

/**
 * Renders a date + time in two lines, using the consistent styling
 * used across all dashboard list tables.
 */
export function DateCell({ isoString, className }: { isoString: string; className?: string }) {
    const date = new Date(isoString);
    return (
        <div className={`flex flex-col ${className || ""}`}>
            <p className="text-xs text-foreground">{date.toLocaleDateString()}</p>
            <p className="text-xs text-muted-foreground font-mono">
                {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
        </div>
    );
}
