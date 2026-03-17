"use client";

import { useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export interface TableColumnDef {
    key: string;
    label: string;
    align?: "start" | "center" | "end";
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

/**
 * Pre-styled shadcn Table wrapper with the consistent design used across all
 * dashboard list pages. Uses data-slot attributes for CSS-driven styling.
 */
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

    const totalPages = Math.max(1, Math.ceil(items.length / rowsPerPage));
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + rowsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div data-slot="table-wrapper" className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden w-full" style={{ boxShadow: 'var(--shadow-md)' }}>
            {topContent && (
                <div data-slot="table-header" className="px-4 md:px-6 py-4 md:py-5 border-b border-border bg-muted flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {topContent}
                </div>
            )}
            <div className="w-full overflow-x-auto">
                <Table aria-label={ariaLabel} className="min-w-[600px] w-full">
                    <TableHeader className="bg-muted/80 border-b border-border">
                        <TableRow className="border-b-0 hover:bg-transparent">
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={`text-muted-foreground font-bold text-[10px] uppercase tracking-[0.2em] py-4 px-4 md:px-6 ${col.align === "end" ? "text-right" :
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
                                    className="text-center py-16 text-muted-foreground text-sm"
                                >
                                    {emptyContent || "No items found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedItems.map((item) => (
                                <TableRow key={item.id} className="cursor-pointer hover:bg-muted transition-colors border-b border-muted last:border-0 group">
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            className={`py-4 md:py-5 px-4 md:px-6 text-muted-foreground text-sm ${col.align === "end" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
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

            {items.length > rowsPerPage && (
                <div className="px-4 md:px-6 py-4 border-t border-border bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        Showing <span className="font-semibold text-muted-foreground">{startIndex + 1}</span> to <span className="font-semibold text-muted-foreground">{Math.min(startIndex + rowsPerPage, items.length)}</span> of <span className="font-semibold text-muted-foreground">{items.length}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <HiChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="text-xs font-semibold text-secondary min-w-[3rem] text-center">
                            {currentPage} / {totalPages}
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <HiChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

