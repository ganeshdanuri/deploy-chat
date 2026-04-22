"use client";

interface DonutProps {
    value: number;
    color?: string;
    size?: number;
    thickness?: number;
    label?: string;
    sublabel?: string;
}

export function Donut({
    value,
    color ="var(--accent-green)",
    size = 140,
    thickness = 10,
    label,
    sublabel,
}: DonutProps) {
    const pct = Math.max(0, Math.min(100, value));
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth={thickness}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={thickness}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[28px] font-medium tracking-tight tabular-nums leading-none">
                    {label ?? `${Math.round(pct)}%`}
                </div>
                {sublabel && (
                    <div className="text-[11px] text-muted-foreground mt-1 uppercase tracking-[0.08em]">
                        {sublabel}
                    </div>
                )}
            </div>
        </div>
    );
}
