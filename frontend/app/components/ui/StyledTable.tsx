"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";


export interface TableColumnDef {
    key: string;
    label: string;
    align?: "start" |"center" |"end";
}

interface StyledTableProps<T extends { id: string }> {
"aria-label": string;
    columns: TableColumnDef[];
    items: T[];
    renderCell: (item: T, columnKey: React.Key) => React.ReactNode;
    topContent?: React.ReactNode;
    emptyContent?: string;
    rowsPerPage?: number;
}

export function StyledTable<T extends { id: string }>({
"aria-label": ariaLabel,
    columns,
    items,
    renderCell,
    topContent,
    emptyContent,
    rowsPerPage = 10,
}: StyledTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);

    // Reset to page 1 when the item list changes (search/filter)
    useEffect(() => { setCurrentPage(1); }, [items.length]);

    const totalPages = Math.max(1, Math.ceil(items.length / rowsPerPage));
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + rowsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage> 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div data-slot="table-wrapper" className="bg-background border border-border rounded-xl overflow-hidden w-full">
            {topContent && (
                <div data-slot="table-header" className="px-4 md:px-5 py-3.5 border-b border-border bg-background flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {topContent}
                </div>
            )}
            <div className="w-full overflow-x-auto">
                <Table aria-label={ariaLabel} className="min-w-[600px] w-full">
                    <TableHeader className="bg-muted/50 border-b border-border">
                        <TableRow className="border-b-0 hover:bg-transparent">
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={`text-muted-foreground font-medium text-[11px] uppercase tracking-[0.08em] py-3 px-4 md:px-5 ${col.align === "end" ? "text-right" :
                                        col.align === "center" ? "text-center" : "text-left"
                                        }`}
>
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center py-14 text-muted-foreground text-sm"
>
                                    {emptyContent ||"No items found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedItems.map((item) => (
                                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/60 transition-colors border-b border-border last:border-0 group">
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            className={`py-3.5 md:py-4 px-4 md:px-5 text-foreground text-sm ${col.align === "end" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
>
                                            {renderCell(item, col.key as React.Key)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {items.length> rowsPerPage && (
                <div className="px-4 md:px-5 py-3 border-t border-border bg-background flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{startIndex + 1}</span> to <span className="font-medium text-foreground">{Math.min(startIndex + rowsPerPage, items.length)}</span> of <span className="font-medium text-foreground">{items.length}</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="text-xs font-medium text-foreground min-w-[3rem] text-center">
                            {currentPage} / {totalPages}
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
