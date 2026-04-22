"use client";

import { useMemo } from "react";

export interface AreaChartPoint {
    x: string | number;
    y: number;
}

interface AreaChartProps {
    data: AreaChartPoint[];
    color?: string;
    height?: number;
    showGrid?: boolean;
    yFormat?: (n: number) => string;
    emptyLabel?: string;
}

export function AreaChart({
    data,
    color ="var(--brand)",
    height = 240,
    showGrid = true,
    yFormat = (n) => n.toLocaleString(),
    emptyLabel ="No data yet",
}: AreaChartProps) {
    const isEmpty = !data || data.length === 0;

    const { pathLine, pathArea, maxY, minY, ticks } = useMemo(() => {
        if (isEmpty) return { pathLine: "", pathArea: "", maxY: 0, minY: 0, ticks: [] as number[] };
        const ys = data.map((d) => d.y);
        const rawMax = Math.max(...ys);
        const rawMin = Math.min(...ys, 0);
        const padded = rawMax === 0 ? 10 : rawMax * 1.1;

        const toX = (i: number) => (i / (data.length - 1 || 1)) * 100;
        const toY = (y: number) => 100 - ((y - rawMin) / (padded - rawMin || 1)) * 90;

        // Smooth Catmull-Rom to Bezier
        const pts = data.map((d, i) => ({ x: toX(i), y: toY(d.y) }));
        let line = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i - 1] || pts[i];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[i + 2] || p2;
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            line += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        const area = `${line} L ${pts[pts.length - 1].x} 100 L ${pts[0].x} 100 Z`;

        const t = [0, 0.5, 1].map((f) => rawMin + (padded - rawMin) * f);
        return { pathLine: line, pathArea: area, maxY: padded, minY: rawMin, ticks: t };
    }, [data, isEmpty]);

    if (isEmpty) {
        return (
            <div
                className="relative w-full flex items-center justify-center"
                style={{ height }}
>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    {[25, 50, 75].map((y) => (
                        <line
                            key={y}
                            x1="0"
                            y1={y}
                            x2="100"
                            y2={y}
                            stroke="var(--border)"
                            strokeWidth="0.25"
                            strokeDasharray="0.8 0.8"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                </svg>
                <div className="relative z-10 text-center">
                    <div className="text-sm text-muted-foreground">{emptyLabel}</div>
                    <div className="text-xs text-muted-foreground/70 mt-1">Data will appear once activity starts</div>
                </div>
            </div>
        );
    }

    const gradId = `grad-${Math.random().toString(36).slice(2, 7)}`;

    return (
        <div className="relative w-full" style={{ height }}>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between py-1 pointer-events-none">
                {[...ticks].reverse().map((t, i) => (
                    <span key={i} className="text-[10px] text-muted-foreground tabular-nums">
                        {yFormat(Math.round(t))}
                    </span>
                ))}
            </div>
            <div className="absolute left-12 right-0 top-0 h-full">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {showGrid && [25, 50, 75].map((y) => (
                        <line
                            key={y}
                            x1="0"
                            y1={y}
                            x2="100"
                            y2={y}
                            stroke="var(--border)"
                            strokeWidth="0.25"
                            strokeDasharray="0.8 0.8"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                    <path d={pathArea} fill={`url(#${gradId})`} />
                    <path
                        d={pathLine}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            </div>
            {/* X-axis labels */}
            <div className="absolute left-12 right-0 bottom-0 translate-y-full mt-1 flex justify-between pointer-events-none">
                {data.filter((_, i) => {
                    const step = Math.max(1, Math.floor(data.length / 6));
                    return i % step === 0 || i === data.length - 1;
                }).map((d, i) => (
                    <span key={i} className="text-[10px] text-muted-foreground pt-1.5">
                        {d.x}
                    </span>
                ))}
            </div>
            {/* spacer for x labels */}
            <div aria-hidden style={{ height: 16 }} />
        </div>
    );
}

// ─── SPARKLINE (for cards) ───────────────────────────────────────────────────

export function Sparkline({
    data,
    color ="var(--brand)",
    height = 32,
    width ="100%",
}: {
    data: number[];
    color?: string;
    height?: number;
    width?: string | number;
}) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full flex items-center" style={{ height }}>
                <div className="h-px w-full bg-border" />
            </div>
        );
    }
    const max = Math.max(...data);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const step = 100 / (data.length - 1 || 1);
    const pts = data.map((v, i) => ({
        x: i * step,
        y: 100 - ((v - min) / range) * 80 - 10,
    }));
    let line = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        line += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return (
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ width, height }}
>
            <path
                d={line}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
