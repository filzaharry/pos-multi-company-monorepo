'use client';

import React from 'react';
import { User } from '@/lib/modules/login/types';
import { PaginationData, LookupOption } from '@/lib/modules/users/types';
import {
    Search,
    Plus,
    Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Can } from '@/components/auth/Can';
import { DataTable } from '@/components/ui/DataTable';
import { getUserColumns } from '../constants/columns';
import { PageHeader } from '@/components/ui/PageHeader';

interface DesktopProps {
    users: User[];
    isLoading: boolean;
    pagination: PaginationData | null;
    roles: LookupOption[];
    companies: LookupOption[];
    isSuperAdmin: boolean;
    search: string;
    setSearch: (val: string) => void;
    roleId: string;
    setRoleId: (val: string) => void;
    companyId: string;
    setCompanyId: (val: string) => void;
    startDate: string;
    setStartDate: (val: string) => void;
    endDate: string;
    setEndDate: (val: string) => void;
    page: number;
    setPage: (val: number | ((p: number) => number)) => void;
    sortKey: string;
    sortOrder: 'asc' | 'desc';
    onSort: (key: string) => void;
    onAdd: () => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onOpenFilter: () => void;
    appliedFiltersCount: number;
}

export const Desktop: React.FC<DesktopProps> = ({
    users,
    isLoading,
    pagination,
    roles,
    companies,
    isSuperAdmin,
    search,
    setSearch,
    roleId,
    setRoleId,
    companyId,
    setCompanyId,
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
    onOpenFilter,
    appliedFiltersCount
}) => {
    const columns = getUserColumns({ onEdit, onDelete });

    const activeFiltersCount = appliedFiltersCount;

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <PageHeader
                title="User Directory"
                subtitle="Manage organizational members and their access levels."
                actions={
                    <>
                        {/* Search Input */}
                        <div className="relative group w-64 lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 shadow-xs"
                            />
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={onOpenFilter}
                            className={cn(
                                "flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border",
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

                        {/* Create Button */}
                        <Can permission="user.create">
                            <button
                                onClick={onAdd}
                                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add Member</span>
                            </button>
                        </Can>
                    </>
                }
            />

            {/* Reusable Data Table */}
            <DataTable
                columns={columns}
                data={users}
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
