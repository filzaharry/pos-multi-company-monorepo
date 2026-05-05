'use client';

import React from 'react';
import { Role, PaginationData } from '@/lib/modules/users/types';
import { 
    Search, 
    Filter, 
    Plus, 
    Shield, 
    ChevronRight, 
    MoreVertical, 
    Trash2, 
    Edit3, 
    ExternalLink 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoleCard } from './widgets/RoleCard';
import { RoleSkeleton } from './widgets/RoleSkeleton';
import { RolePagination } from './widgets/RolePagination';

interface DesktopProps {
    roles: Role[];
    isLoading: boolean;
    pagination: PaginationData | null;
    search: string;
    setSearch: (val: string) => void;
    startDate: string;
    setStartDate: (val: string) => void;
    endDate: string;
    setEndDate: (val: string) => void;
    page: number;
    setPage: (val: number | ((p: number) => number)) => void;
    onAdd: () => void;
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
    onPermissions: (role: Role) => void;
    onDetail: (role: Role) => void;
    onOpenFilter: () => void;
}

export const Desktop: React.FC<DesktopProps> = ({
    roles,
    isLoading,
    pagination,
    search,
    setSearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    page,
    setPage,
    onAdd,
    onEdit,
    onDelete,
    onPermissions,
    onDetail,
    onOpenFilter
}) => {
    const activeFiltersCount = [startDate, endDate].filter(Boolean).length;

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Role <span className="text-primary">Management</span></h1>
                    <p className="text-gray-500 text-sm font-medium tracking-wide">Define and manage user roles and permissions.</p>
                </div>

                <div className="flex items-center gap-3 self-end">
                    <div className="relative group w-64 lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search roles..."
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

                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        <span>New Role</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

