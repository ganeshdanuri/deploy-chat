"use client";

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
    align?: "start" | "center" | "end";
}

interface StyledTableProps<T extends { id: string }> {
    "aria-label": string;
    columns: TableColumnDef[];
    items: T[];
    renderCell: (item: T, columnKey: React.Key) => React.ReactNode;
    topContent?: React.ReactNode;
    emptyContent?: string;
}

/**
 * Pre-styled shadcn Table wrapper with the consistent design used across all
 * dashboard list pages. Eliminates the repeated classNames boilerplate.
 */
export function StyledTable<T extends { id: string }>({
    "aria-label": ariaLabel,
    columns,
    items,
    renderCell,
    topContent,
    emptyContent,
}: StyledTableProps<T>) {
    return (
        <div className="bg-white border border-[#e3e2e5] shadow-sm rounded-sm overflow-hidden">
            {topContent && (
                <div className="px-6 py-5 border-b border-[#e3e2e5] bg-white">
                    {topContent}
                </div>
            )}
            <Table aria-label={ariaLabel}>
                <TableHeader className="bg-[#f3f3f9] border-b border-[#e3e2e5]">
                    <TableRow className="border-b-0 hover:bg-transparent">
                        {columns.map((col) => (
                            <TableHead
                                key={col.key}
                                className={`text-[#a1a1a1] font-bold text-[10px] uppercase tracking-[0.2em] py-5 px-6 ${col.align === "end" ? "text-right" :
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
                                className="text-center py-12 text-[#a1a1a1] text-sm"
                            >
                                {emptyContent || "No items found."}
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id} className="cursor-pointer hover:bg-[#f3f3f9] transition-colors border-b border-[#f3f3f9] last:border-0 group">
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        className={`py-5 px-6 text-[#5a5a6a] text-sm ${col.align === "end" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
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
    );
}
