"use client";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/react";

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
 * Pre-styled HeroUI Table wrapper with the consistent design used across all
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
        <Table
            aria-label={ariaLabel}
            topContent={topContent}
            classNames={{
                base: "bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden",
                thead: "bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold",
                wrapper: "shadow-none p-0",
                th: "bg-slate-50/50 text-slate-500",
            }}
        >
            <TableHeader>
                {columns.map((col) => (
                    <TableColumn key={col.key} align={col.align}>
                        {col.label}
                    </TableColumn>
                ))}
            </TableHeader>
            <TableBody items={items} emptyContent={emptyContent}>
                {(item) => (
                    <TableRow key={item.id} className="cursor-pointer hover:bg-slate-50/80 transition-colors">
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
