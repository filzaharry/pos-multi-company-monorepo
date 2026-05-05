'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleFiltersProps {
    search: string;
    setSearch: (val: string) => void;
    setPage: (val: number | ((p: number) => number)) => void;
    isMobile?: boolean;
}

export const RoleFilters: React.FC<RoleFiltersProps> = ({ search, setSearch, setPage, isMobile }) => {
    if (isMobile) {
        return (
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search roles..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                />
                {search && (
                    <button
                        onClick={() => { setSearch(''); setPage(1); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="p-6 bg-background-dark/50 border border-white/5 rounded-2xl backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by role name or description..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                    />
                </div>
                {search && (
                    <button
                        onClick={() => { setSearch(''); setPage(1); }}
                        className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium px-4"
                    >
                        <X className="w-4 h-4" />
                        <span>Reset</span>
                    </button>
                )}
            </div>
        </div>
    );
};
