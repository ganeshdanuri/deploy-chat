"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { HiCheck } from "react-icons/hi";

export interface SelectableItem {
    id: string;
    label: string;
    sublabel?: string;
}

interface SelectableItemListProps {
    items: SelectableItem[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    /** Icon rendered when an item is NOT selected */
    defaultIcon: React.ElementType;
    accentColor: "indigo" | "emerald";
    emptyIcon: React.ElementType;
    emptyMessage: React.ReactNode;
}

const accentMap = {
    indigo: {
        selectedCard: "bg-indigo-50/70 border-indigo-200",
        unselectedCard: "bg-white border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20",
        selectedIcon: "bg-indigo-600 border-indigo-600 text-white shadow-md",
        unselectedIcon: "bg-slate-50 border-slate-200 text-slate-400",
        selectedText: "text-indigo-900",
        unselectedText: "text-slate-600",
        selectedRadio: "bg-indigo-600 border-indigo-600",
        unselectedRadio: "bg-white border-slate-200",
    },
    emerald: {
        selectedCard: "bg-emerald-50/70 border-emerald-200 shadow-sm",
        unselectedCard: "bg-white border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20",
        selectedIcon: "bg-emerald-600 border-emerald-600 text-white shadow-md",
        unselectedIcon: "bg-slate-50 border-slate-200 text-slate-400",
        selectedText: "text-emerald-900",
        unselectedText: "text-slate-600",
        selectedRadio: "bg-emerald-600 border-emerald-600",
        unselectedRadio: "bg-white border-slate-200",
    },
};

/**
 * A generic selectable-checklist used inside both CreateChatbotModal (datasets)
 * and CreateDatasetModal (documents). Prevents the massive duplication of that UI pattern.
 */
export function SelectableItemList({
    items,
    selectedIds,
    onToggle,
    defaultIcon: DefaultIcon,
    accentColor,
    emptyIcon: EmptyIcon,
    emptyMessage,
}: SelectableItemListProps) {
    const colors = accentMap[accentColor];

    if (items.length === 0) {
        return (
            <div className="p-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <EmptyIcon className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {items.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                    <Card
                        key={item.id}
                        isPressable
                        onPress={() => onToggle(item.id)}
                        className={`border-1 transition-all duration-300 rounded-2xl shadow-none ${isSelected ? colors.selectedCard : colors.unselectedCard
                            }`}
                    >
                        <CardBody className="flex flex-row items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${isSelected ? colors.selectedIcon : colors.unselectedIcon
                                        }`}
                                >
                                    {isSelected ? (
                                        <HiCheck className="w-6 h-6" />
                                    ) : (
                                        <DefaultIcon className="w-5 h-5" />
                                    )}
                                </div>
                                <div>
                                    <p className={`text-sm font-medium transition-colors ${isSelected ? colors.selectedText : colors.unselectedText
                                        }`}>
                                        {item.label}
                                    </p>
                                    {item.sublabel && (
                                        <p className="text-[10px] text-slate-400 uppercase tracking-tight">
                                            {item.sublabel}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isSelected ? colors.selectedRadio : colors.unselectedRadio
                                    }`}
                            >
                                {isSelected && <HiCheck className="w-3.5 h-3.5 text-white" />}
                            </div>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
}
