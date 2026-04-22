"use client";

import { useState } from "react";

export interface BarDataPoint {
    label: string;
    value: number;
}

interface BarChartProps {
    data: BarDataPoint[];
    color?: string;
    height?: number;
    highlightIdx?: number |"last" |"max" |"none";
    valueFormat?: (n: number) => string;
    emptyLabel?: string;
}

export function BarChart({
    data,
    color ="var(--brand)",
    height = 280,
    highlightIdx ="max",
    valueFormat = (n) => n.toLocaleString(),
    emptyLabel ="No data yet",
}: BarChartProps) {
    const [hover, setHover] = useState<number | null>(null);

    const isEmpty = !data || data.length === 0 || data.every((d) => d.value === 0);

    if (isEmpty) {
        return (
            <div
                className="relative w-full flex flex-col items-center justify-center"
                style={{ height }}
>
                <div className="w-full h-full flex items-end gap-[2%] px-1 opacity-30">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 rounded-t"
                            style={{
                                height: `${20 + Math.sin(i) * 15 + i * 3}%`,
                                background: "var(--muted)",
                            }}
                        />
                    ))}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="text-sm font-medium text-foreground">{emptyLabel}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Data will appear once activity starts
                    </div>
                </div>
            </div>
        );
    }

    const maxVal = Math.max(...data.map((d) => d.value), 1);
    const padded = maxVal * 1.1;
    const highlighted =
        highlightIdx === "max"
            ? data.reduce((maxI, d, i, arr) => (d.value> arr[maxI].value ? i : maxI), 0)
            : highlightIdx === "last"
            ? data.length - 1
            : highlightIdx === "none"
            ? -1
            : highlightIdx;

    const shown = hover ?? highlighted;

    return (
        <div className="relative w-full" style={{ height }}>
            {/* Bars */}
            <div className="w-full h-full flex items-end gap-1 sm:gap-2 pb-8">
                {data.map((d, i) => {
                    const pct = (d.value / padded) * 100;
                    const isHi = i === shown && shown>= 0;
                    return (
                        <div
                            key={i}
                            className="flex-1 flex flex-col items-center justify-end relative group cursor-default min-w-0"
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(null)}
>
                            {/* Tooltip bubble */}
                            {isHi && (
                                <div
                                    className="absolute z-20 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap tabular-nums"
                                    style={{
                                        bottom: `calc(${pct}% + 10px)`,
                                        background: "var(--foreground)",
                                        color: "var(--background)",
                                    }}
>
                                    {valueFormat(d.value)}
                                </div>
                            )}
                            {/* Bar */}
                            <div
                                className="w-full rounded-t transition-colors"
                                style={{
                                    height: `${Math.max(pct, 2)}%`,
                                    background: isHi ? color : "var(--border)",
                                    minHeight: 4,
                                }}
                            />
                            {/* X label */}
                            <div
                                className="absolute -bottom-6 text-[11px] text-muted-foreground truncate max-w-full px-0.5"
                                style={{
                                    color: isHi ? "var(--foreground)" : "var(--muted-foreground)",
                                    fontWeight: isHi ? 500 : 400,
                                }}
>
                                {d.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
