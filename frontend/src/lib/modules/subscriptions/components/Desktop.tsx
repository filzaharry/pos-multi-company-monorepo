'use client';

import { DataTable } from '@/components/ui/DataTable';
import { PaginationData } from '@/lib/modules/users/types';
import {
    Filter,
    Search,
} from 'lucide-react';
import React from 'react';
import { getCompanyColumns } from '../constants/columns';
import { CompanyHeader, SubscriptionStats } from '../types';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/ui/PageHeader';

interface DesktopProps {
    companies: CompanyHeader[];
    stats: SubscriptionStats | null;
    isLoading: boolean;
    pagination: PaginationData | null;
    search: string;
    setSearch: (val: string) => void;
    status: string;
    setStatus: (val: string) => void;
    page: number;
    setPage: (val: number) => void;
    sortKey: string;
    sortOrder: 'asc' | 'desc';
    onSort: (key: string) => void;
    onViewDetail: (company: CompanyHeader) => void;
    onOpenFilter: () => void;
    appliedFiltersCount: number;
}

export const Desktop: React.FC<DesktopProps> = ({
    companies,
    stats,
    isLoading,
    pagination,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    sortKey,
    sortOrder,
    onSort,
    onViewDetail,
    onOpenFilter,
    appliedFiltersCount
}) => {
    const columns = getCompanyColumns({ onViewDetail });

    const activeFiltersCount = appliedFiltersCount;

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Subscriptions"
                subtitle="Monitor company billing and license life-cycles."
                actions={
                    <>
                        <div className="relative group w-full sm:w-64 lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search companies..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 shadow-xs"
                            />
                        </div>

                        <button
                            onClick={onOpenFilter}
                            className={cn(
                                "flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border w-full sm:w-auto justify-center",
                                activeFiltersCount > 0
                                    ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10"
                                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300"
                            )}
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                            {activeFiltersCount > 0 && (
                                <span className="flex items-center justify-center w-5 h-5 bg-primary text-white text-[10px] rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </>
                }
            />

            {/* Table */}
            <DataTable
                columns={columns}
                data={companies}
                isLoading={isLoading}
                pagination={pagination}
                page={page}
                onPageChange={setPage}
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={onSort}
            />
        </div>
    );
};
