'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaginationData } from '@/lib/modules/users/types';

export interface Column<T> {
    header: string;
    accessorKey?: keyof T | string;
    cell?: (item: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
    align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    pagination?: PaginationData | null;
    page: number;
    onPageChange: (page: number) => void;
    sortKey?: string;
    sortOrder?: 'asc' | 'desc';
    onSort?: (key: string) => void;
}

export function DataTable<T>({
    columns,
    data,
    isLoading,
    pagination,
    page,
    onPageChange,
    sortKey,
    sortOrder,
    onSort
}: DataTableProps<T>) {
    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-100/50">
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        className={cn(
                                            "px-6 py-4 text-xs font-bold text-slate-800 uppercase tracking-wider",
                                            col.sortable && "cursor-pointer hover:text-slate-900 transition-colors",
                                            col.align === 'center' && "text-center",
                                            col.align === 'right' && "text-right",
                                            col.className
                                        )}
                                        onClick={() => col.sortable && onSort?.(col.accessorKey as string)}
                                    >
                                        <div className={cn(
                                            "flex items-center gap-2",
                                            col.align === 'center' && "justify-center",
                                            col.align === 'right' && "justify-end"
                                        )}>
                                            {col.header}
                                            {col.sortable && (
                                                <div className="text-slate-800">
                                                    {sortKey === col.accessorKey ? (
                                                        sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />
                                                    ) : (
                                                        <ArrowUpDown className="w-3 h-3" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {columns.map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-slate-200/60 rounded w-full" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (data && data.length > 0) ? (
                                data.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        {columns.map((col, j) => (
                                            <td
                                                key={j}
                                                className={cn(
                                                    "px-6 py-4 text-sm text-slate-800",
                                                    col.align === 'center' && "text-center",
                                                    col.align === 'right' && "text-right",
                                                    col.className
                                                )}
                                            >
                                                {
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    col.cell ? col.cell(item) : (item as any)[col.accessorKey!]
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="p-4 rounded-full bg-slate-100">
                                                <svg className="w-8 h-8 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-slate-800 font-bold italic uppercase tracking-widest text-sm">No Records Found</p>
                                                <p className="text-slate-800 text-xs mt-1">Try adjusting your filters or adding new data.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-xs text-slate-800">
                        Showing <span className="text-slate-800 font-bold">{data.length}</span> of <span className="text-slate-800 font-bold">{pagination.total}</span> entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(Math.max(1, page - 1))}
                            disabled={!pagination.has_previous}
                            className="p-2 text-slate-800 hover:text-slate-900 disabled:opacity-20 transition-all bg-slate-100 hover:bg-slate-200/50 rounded-xl border border-slate-200"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-1">
                            {[...Array(pagination.last_page)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => onPageChange(i + 1)}
                                    className={cn(
                                        "w-9 h-9 rounded-xl text-xs font-bold transition-all border",
                                        page === i + 1
                                            ? "bg-primary border-primary text-slate-800 shadow-lg shadow-primary/20"
                                            : "bg-slate-100 border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-200/50"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => onPageChange(Math.min(pagination.last_page, page + 1))}
                            disabled={!pagination.has_next}
                            className="p-2 text-slate-800 hover:text-slate-900 disabled:opacity-20 transition-all bg-slate-100 hover:bg-slate-200/50 rounded-xl border border-slate-200"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
