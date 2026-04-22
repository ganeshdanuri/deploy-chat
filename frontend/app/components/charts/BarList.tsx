"use client";

export interface BarItem {
    label: string;
    value: number;
    subtitle?: string;
    href?: string;
    active?: boolean;
}

interface BarListProps {
    items: BarItem[];
    color?: string;
    max?: number;
    emptyLabel?: string;
    valueFormat?: (n: number) => string;
}

export function BarList({
    items,
    color ="var(--brand)",
    max,
    emptyLabel ="No data yet",
    valueFormat = (n) => n.toLocaleString(),
}: BarListProps) {
    if (!items || items.length === 0) {
        return (
            <div className="py-12 text-center text-sm text-muted-foreground">
                {emptyLabel}
            </div>
        );
    }

    const computedMax = max ?? Math.max(...items.map((i) => i.value), 1);

    return (
        <div className="flex flex-col">
            {items.map((item, idx) => {
                const pct = (item.value / computedMax) * 100;
                const isActive = item.active ?? idx === 0;
                return (
                    <div
                        key={idx}
                        className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
>
                        <div className="flex-1 min-w-0 flex items-center gap-2.5">
                            <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{
                                    background: isActive ? color : "var(--border-medium)",
                                }}
                            />
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-foreground truncate">
                                    {item.label}
                                </div>
                                {item.subtitle && (
                                    <div className="text-xs text-muted-foreground truncate">
                                        {item.subtitle}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-32 sm:w-48 shrink-0">
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full transition-all"
                                    style={{
                                        width: `${pct}%`,
                                        background: isActive ? color : "var(--border-medium)",
                                    }}
                                />
                            </div>
                        </div>
                        <div
                            className="w-16 text-right text-sm font-medium tabular-nums shrink-0"
                            style={{ color: isActive ? "var(--foreground)" : "var(--muted-foreground)" }}
>
                            {valueFormat(item.value)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
