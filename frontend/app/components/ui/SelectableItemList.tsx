"use client";

import React from "react";
import { HiCheck } from "react-icons/hi";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectableItem {
    id: string;
    label: string;
    sublabel?: string;
    /** Optional per-item leading icon override */
    icon?: React.ElementType;
}

export type SelectableAccentColor = "indigo" | "emerald" | "amber" | "violet" | "rose" | "slate";

/**
 * Fine-grained color override. Provide this instead of `accentColor`
 * if none of the built-in presets fit your use case.
 */
export interface SelectableColors {
    selectedCard: string;
    unselectedCard: string;
    selectedIcon: string;
    unselectedIcon: string;
    selectedText: string;
    unselectedText: string;
    selectedRadio: string;
    unselectedRadio: string;
}

export type SelectableSize = "sm" | "md" | "lg";

interface SelectableItemListProps {
    items: SelectableItem[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    /** Fallback icon when an item has no per-item icon and is NOT selected */
    defaultIcon: React.ElementType;
    /**
     * Pre-built accent colour preset.
     * Ignored if `customColors` is provided.
     */
    accentColor?: SelectableAccentColor;
    /**
     * Full color override — use when the built-in presets don't fit.
     * Takes priority over `accentColor`.
     */
    customColors?: SelectableColors;
    emptyIcon: React.ElementType;
    emptyMessage: React.ReactNode;
    /** Controls padding, icon and text sizes. Default: "md" */
    size?: SelectableSize;
    /** Custom className applied to the outer list wrapper */
    className?: string;
}

// ─── Preset accent map ────────────────────────────────────────────────────────

const ACCENT_MAP: Record<SelectableAccentColor, SelectableColors> = {
    indigo: {
        selectedCard: "bg-primary/5 border-primary/20 shadow-sm",
        unselectedCard: "bg-muted/50 border-border hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm",
        selectedIcon: "bg-primary border-primary text-white shadow-md",
        unselectedIcon: "bg-white border-border text-muted-foreground",
        selectedText: "text-secondary",
        unselectedText: "text-muted-foreground",
        selectedRadio: "bg-primary border-primary",
        unselectedRadio: "bg-white border-border",
    },
    emerald: {
        selectedCard: "bg-emerald-50 border-emerald-200 shadow-sm",
        unselectedCard: "bg-muted/50 border-border hover:border-emerald-100/50 hover:bg-emerald-50/30 hover:shadow-sm",
        selectedIcon: "bg-emerald-600 border-emerald-600 text-white shadow-md",
        unselectedIcon: "bg-white border-border text-muted-foreground",
        selectedText: "text-emerald-900",
        unselectedText: "text-muted-foreground",
        selectedRadio: "bg-emerald-600 border-emerald-600",
        unselectedRadio: "bg-white border-border",
    },
    amber: {
        selectedCard: "bg-amber-50 border-amber-300 shadow-sm",
        unselectedCard: "bg-muted/30 border-border hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-sm",
        selectedIcon: "bg-amber-500 border-amber-500 text-white shadow-md",
        unselectedIcon: "bg-white border-border text-muted-foreground/80",
        selectedText: "text-amber-900",
        unselectedText: "text-muted-foreground",
        selectedRadio: "bg-amber-500 border-amber-500",
        unselectedRadio: "bg-white border-border-medium",
    },
    violet: {
        selectedCard: "bg-violet-50 border-violet-300 shadow-sm",
        unselectedCard: "bg-muted/30 border-border hover:border-violet-200 hover:bg-violet-50/30 hover:shadow-sm",
        selectedIcon: "bg-violet-600 border-violet-600 text-white shadow-md",
        unselectedIcon: "bg-white border-border text-muted-foreground/80",
        selectedText: "text-violet-900",
        unselectedText: "text-muted-foreground",
        selectedRadio: "bg-violet-600 border-violet-600",
        unselectedRadio: "bg-white border-border-medium",
    },
    rose: {
        selectedCard: "bg-rose-50 border-rose-300 shadow-sm",
        unselectedCard: "bg-muted/30 border-border hover:border-rose-200 hover:bg-rose-50/30 hover:shadow-sm",
        selectedIcon: "bg-rose-600 border-rose-600 text-white shadow-md",
        unselectedIcon: "bg-white border-border text-muted-foreground/80",
        selectedText: "text-rose-900",
        unselectedText: "text-muted-foreground",
        selectedRadio: "bg-rose-600 border-rose-600",
        unselectedRadio: "bg-white border-border-medium",
    },
    slate: {
        selectedCard: "bg-muted border-border shadow-sm",
        unselectedCard: "bg-background border-border hover:border-border-medium hover:bg-muted/50 hover:shadow-sm",
        selectedIcon: "bg-foreground border-foreground text-background shadow-md",
        unselectedIcon: "bg-muted border-border text-muted-foreground",
        selectedText: "text-foreground",
        unselectedText: "text-muted-foreground",
        selectedRadio: "bg-foreground border-foreground",
        unselectedRadio: "bg-background border-border",
    },
};

// ─── Size map — controls padding, icon box, icon, label text ─────────────────

const SIZE_MAP: Record<SelectableSize, {
    gap: string;
    cardPadding: string;
    iconBox: string;
    icon: string;
    checkIcon: string;
    listGap: string;
    labelText: string;
    sublabelText: string;
    emptyPadding: string;
    emptyIcon: string;
    radioSize: string;
}> = {
    sm: {
        gap: "gap-3",
        cardPadding: "p-3",
        iconBox: "w-8 h-8",
        icon: "w-4 h-4",
        checkIcon: "w-4 h-4",
        listGap: "space-y-2",
        labelText: "text-xs",
        sublabelText: "text-[9px]",
        emptyPadding: "p-8",
        emptyIcon: "w-8 h-8",
        radioSize: "w-4 h-4",
    },
    md: {
        gap: "gap-4",
        cardPadding: "p-4",
        iconBox: "w-10 h-10",
        icon: "w-5 h-5",
        checkIcon: "w-6 h-6",
        listGap: "space-y-3",
        labelText: "text-sm",
        sublabelText: "text-[10px]",
        emptyPadding: "p-12",
        emptyIcon: "w-10 h-10",
        radioSize: "w-5 h-5",
    },
    lg: {
        gap: "gap-5",
        cardPadding: "p-5",
        iconBox: "w-12 h-12",
        icon: "w-6 h-6",
        checkIcon: "w-7 h-7",
        listGap: "space-y-4",
        labelText: "text-base",
        sublabelText: "text-xs",
        emptyPadding: "p-16",
        emptyIcon: "w-12 h-12",
        radioSize: "w-6 h-6",
    },
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Generic selectable-checklist.
 *
 * - `accentColor` — pick from 6 built-in presets (indigo | emerald | amber | violet | rose | slate)
 * - `customColors` — escape hatch for fully custom colours (overrides `accentColor`)
 * - `size` — "sm" | "md" (default) | "lg" controls all internal dimensions dynamically
 * - Each item can carry its own `icon` to override `defaultIcon`
 */
export function SelectableItemList({
    items,
    selectedIds,
    onToggle,
    defaultIcon: DefaultIcon,
    accentColor = "indigo",
    customColors,
    emptyIcon: EmptyIcon,
    emptyMessage,
    size = "md",
    className = "",
}: SelectableItemListProps) {
    const colors = customColors ?? ACCENT_MAP[accentColor];
    const dim = SIZE_MAP[size];

    if (items.length === 0) {
        return (
            <div className={`${dim.emptyPadding} text-center bg-muted border border-dashed border-border`}>
                <EmptyIcon className={`${dim.emptyIcon} text-muted-foreground mx-auto mb-3`} />
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={`${dim.listGap} ${className}`}>
            {items.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                // Each item can override the default icon
                const ItemIcon = item.icon ?? DefaultIcon;

                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onToggle(item.id)}
                        className={`w-full flex flex-row items-center justify-between ${dim.cardPadding} border transition-all duration-200 cursor-pointer text-left ${isSelected ? colors.selectedCard : colors.unselectedCard
                            }`}
                    >
                        <div className={`flex items-center ${dim.gap} flex-1 min-w-0`}>
                            {/* Leading icon box */}
                            <div
                                className={`${dim.iconBox} shrink-0 flex items-center justify-center border transition-all duration-300 ${isSelected ? colors.selectedIcon : colors.unselectedIcon
                                    }`}
                            >
                                {isSelected ? (
                                    <HiCheck className={dim.checkIcon} />
                                ) : (
                                    <ItemIcon className={dim.icon} />
                                )}
                            </div>

                            {/* Label + sublabel */}
                            <div className="min-w-0 flex-1">
                                <p className={`${dim.labelText} font-medium transition-colors truncate ${isSelected ? colors.selectedText : colors.unselectedText
                                    }`}>
                                    {item.label}
                                </p>
                                {item.sublabel && (
                                    <p className={`${dim.sublabelText} text-muted-foreground uppercase tracking-tight truncate`}>
                                        {item.sublabel}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Radio check indicator */}
                        <div
                            className={`${dim.radioSize} shrink-0 border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? colors.selectedRadio : colors.unselectedRadio
                                }`}
                        >
                            {isSelected && <HiCheck className="w-3.5 h-3.5 text-white" />}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
