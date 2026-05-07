'use client';

import React from 'react';
import { User } from '@/lib/modules/login/types';
import { PaginationData, Role, Company, LookupOption } from '@/lib/modules/users/types';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Shield,
    Building2,
    Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Can } from '@/components/auth/Can';

interface MobileProps {
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
    page: number;
    setPage: (val: number | ((p: number) => number)) => void;
    onAdd: () => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onApplyFilters: () => void;
    onResetFilters: () => void;
    appliedFiltersCount: number;
}

export const Mobile: React.FC<MobileProps> = ({
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
    page,
    setPage,
    onAdd,
    onEdit,
    onDelete,
    onApplyFilters,
    onResetFilters,
    appliedFiltersCount
}) => {
    const [showFilters, setShowFilters] = React.useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Users</h1>
                <Can permission="user.create">
                    <button
                        onClick={onAdd}
                        className="p-2 bg-primary text-white rounded-lg shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </Can>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "p-2 rounded-xl border transition-all",
                        showFilters ? "bg-primary border-primary text-white" : "bg-white/5 border-white/10 text-gray-400"
                    )}
                >
                    <div className="relative">
                        <Filter className="w-5 h-5" />
                        {appliedFiltersCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background-dark">
                                {appliedFiltersCount}
                            </span>
                        )}
                    </div>
                </button>
            </div>

            {showFilters && (
                <div className="p-4 bg-background-dark border border-white/5 rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Role</label>
                        <select
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                        >
                            <option value="">All Roles</option>
                            {roles.map(role => (
                                <option key={role.value} value={role.value.toString()}>{role.label}</option>
                            ))}
                        </select>
                    </div>

                    {isSuperAdmin && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Company</label>
                            <select
                                value={companyId}
                                onChange={(e) => setCompanyId(e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                            >
                                <option value="">All Companies</option>
                                {companies.map(company => (
                                    <option key={company.value} value={company.value.toString()}>{company.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={onResetFilters}
                            className="flex-1 py-2 bg-white/5 text-gray-400 rounded-lg text-xs font-bold"
                        >
                            Reset
                        </button>
                        <button
                            onClick={onApplyFilters}
                            className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-bold"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="p-4 bg-background-dark border border-white/5 rounded-2xl animate-pulse h-24" />
                    ))
                ) : users.length > 0 ? (
                    users.map((u) => (
                        <div key={u.id} className="p-4 bg-background-dark border border-white/5 rounded-2xl space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white truncate">{u.name}</h4>
                                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                </div>
                                <div className="flex gap-1">
                                    <Can permission="user.edit">
                                        <button onClick={() => onEdit(u)} className="p-2 text-gray-400 hover:text-white">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </Can>
                                    <Can permission="user.delete">
                                        <button onClick={() => onDelete(u)} className="p-2 text-gray-400 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </Can>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <div className="flex gap-2">
                                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase">
                                        {u.role?.name}
                                    </span>
                                    {u.company && (
                                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase">
                                            {u.company.name}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Active</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center text-gray-500 text-sm">No users found.</div>
                )}
            </div>

            {pagination && pagination.last_page > 1 && (
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
            )}
        </div>
    );
};

const ChevronLeft = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);
