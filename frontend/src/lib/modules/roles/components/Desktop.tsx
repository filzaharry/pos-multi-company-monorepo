'use client';

import { PaginationData, Role } from '@/lib/modules/users/types';
import { cn } from '@/lib/utils';
import {
    Filter,
    Plus,
    Search,
    Shield
} from 'lucide-react';
import React from 'react';
import { RoleCard } from './widgets/RoleCard';
import { RolePagination } from './widgets/RolePagination';
import { RoleSkeleton } from './widgets/RoleSkeleton';
import { PageHeader } from '@/components/ui/PageHeader';

interface DesktopProps {
    roles: Role[];
    isLoading: boolean;
    pagination: PaginationData | null;
    search: string;
    setSearch: (val: string) => void;
    page: number;
    setPage: (val: number | ((p: number) => number)) => void;
    onAdd: () => void;
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
    onPermissions: (role: Role) => void;
    onDetail: (role: Role) => void;
    onOpenFilter: () => void;
    onApplyFilters: () => void;
    onResetFilters: () => void;
    appliedFiltersCount: number;
}

export const Desktop: React.FC<DesktopProps> = ({
    roles,
    isLoading,
    pagination,
    search,
    setSearch,
    page,
    setPage,
    onAdd,
    onEdit,
    onDelete,
    onPermissions,
    onDetail,
    onOpenFilter,
    appliedFiltersCount
}) => {
    const activeFiltersCount = appliedFiltersCount;

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <PageHeader
                title="Role Management"
                subtitle="Define and manage user roles and permissions."
                actions={
                    <>
                        <div className="relative group w-64 lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search roles..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 shadow-xs"
                            />
                        </div>

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

                        <button
                            onClick={onAdd}
                            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New Role</span>
                        </button>
                    </>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    <RoleSkeleton count={6} />
                ) : roles.length > 0 ? (
                    roles.map((role) => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onPermissions={onPermissions}
                            onDetail={onDetail}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <Shield className="w-16 h-16 text-white/5 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">No Roles Found</h3>
                        <p className="text-gray-500">Create your first role to start managing permissions.</p>
                    </div>
                )}
            </div>

            <RolePagination
                pagination={pagination}
                page={page}
                setPage={setPage}
            />
        </div>
    );
};

