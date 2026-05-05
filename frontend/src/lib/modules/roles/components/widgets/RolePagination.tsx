'use client';

import React from 'react';
import { PaginationData } from '@/lib/modules/users/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RolePaginationProps {
    pagination: PaginationData | null;
    page: number;
    setPage: (val: number | ((p: number) => number)) => void;
    isMobile?: boolean;
}

export const RolePagination: React.FC<RolePaginationProps> = ({ pagination, page, setPage, isMobile }) => {
    if (!pagination || pagination.last_page <= 1) return null;

    if (isMobile) {
        return (
            <div className="flex items-center justify-center gap-4 pt-4">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!pagination.has_previous}
                    className="p-2 bg-white/5 rounded-lg disabled:opacity-20"
                >
                    <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <span className="text-sm text-gray-400">Page {page} of {pagination.last_page}</span>
                <button
                    onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                    disabled={!pagination.has_next}
                    className="p-2 bg-white/5 rounded-lg disabled:opacity-20"
                >
                    <ChevronRight className="w-5 h-5 text-white" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-2 pt-4">
            <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.has_previous}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            {[...Array(pagination.last_page)].map((_, i) => (
                <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={cn(
                        "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                        page === i + 1
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                    )}
                >
                    {i + 1}
                </button>
            ))}
            <button
                onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                disabled={!pagination.has_next}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};
