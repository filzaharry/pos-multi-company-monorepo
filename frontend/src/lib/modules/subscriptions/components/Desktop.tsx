'use client';

import { DataTable } from '@/components/ui/DataTable';
import { PaginationData } from '@/lib/modules/users/types';
import {
    Clock,
    CreditCard,
    Filter,
    Plus,
    Search,
    TrendingUp,
    Users,
    X
} from 'lucide-react';
import React from 'react';
import { getSubscriptionColumns } from '../constants/columns';
import { CompanySubscription, SubscriptionStats } from '../types';
import { StatCard } from './widgets/StatCard';
import { cn } from '@/lib/utils';

interface DesktopProps {
    subscriptions: CompanySubscription[];
    stats: SubscriptionStats | null;
    isLoading: boolean;
    pagination: PaginationData | null;
    search: string;
    setSearch: (val: string) => void;
    status: string;
    setStatus: (val: string) => void;
    startDate: string;
    setStartDate: (val: string) => void;
    endDate: string;
    setEndDate: (val: string) => void;
    page: number;
    setPage: (val: number) => void;
    sortKey: string;
    sortOrder: 'asc' | 'desc';
    onSort: (key: string) => void;
    onAdd: () => void;
    onEdit: (sub: CompanySubscription) => void;
    onDelete: (sub: CompanySubscription) => void;
    onApprove: (sub: CompanySubscription) => void;
    onOpenFilter: () => void;
    onApplyFilters: () => void;
    onResetFilters: () => void;
    appliedFiltersCount: number;
}

export const Desktop: React.FC<DesktopProps> = ({
    subscriptions,
    stats,
    isLoading,
    pagination,
    search,
    setSearch,
    status,
    setStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    page,
    setPage,
    sortKey,
    sortOrder,
    onSort,
    onAdd,
    onEdit,
    onDelete,
    onApprove,
    onOpenFilter,
    onApplyFilters,
    onResetFilters,
    appliedFiltersCount
}) => {
    const columns = getSubscriptionColumns({ onEdit, onDelete, onApprove });

    const activeFiltersCount = appliedFiltersCount;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Subscription <span className="text-primary">Console</span></h1>
                    <p className="text-gray-500 text-sm font-medium tracking-wide">Monitor company billing and license life-cycles.</p>
                </div>

                <div className="flex items-center gap-3 self-end">
                    <div className="relative group w-64 lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search subscriptions..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600 shadow-inner"
                        />
                    </div>

                    <button
                        onClick={onOpenFilter}
                        className={cn(
                            "flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border",
                            activeFiltersCount > 0
                                ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10"
                                : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
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
                    <div className=""></div>

                    {/* <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        <span>New License</span>
                    </button> */}
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={subscriptions}
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
