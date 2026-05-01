'use client';

import React from 'react';
import { User } from '@/lib/modules/login/types';
import { PaginationData, Role, Company } from '@/lib/modules/users/types';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Shield,
    Building2,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Can } from '@/components/auth/Can';

interface DesktopProps {
    users: User[];
    isLoading: boolean;
    pagination: PaginationData | null;
    roles: Role[];
    companies: Company[];
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
    page,
    setPage,
    onAdd,
    onEdit,
    onDelete
}) => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-gray-400">Manage organizational members and their access levels.</p>
                </div>
                <Can permission="user.create">
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add New User</span>
                    </button>
                </Can>
            </div>

            {/* Filters Card */}
            <div className="p-6 bg-background-dark/50 border border-white/5 rounded-2xl backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name, email..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                            value={roleId}
                            onChange={(e) => { setRoleId(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                        >
                            <option value="" className="bg-background-dark">All Roles</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id.toString()} className="bg-background-dark">{role.name}</option>
                            ))}
                        </select>
                    </div>

                    {isSuperAdmin && (
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <select
                                value={companyId}
                                onChange={(e) => { setCompanyId(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                            >
                                <option value="" className="bg-background-dark">All Companies</option>
                                {companies.map(company => (
                                    <option key={company.id} value={company.id.toString()} className="bg-background-dark">{company.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(search || roleId || companyId) && (
                        <button
                            onClick={() => { setSearch(''); setRoleId(''); setCompanyId(''); setPage(1); }}
                            className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                        >
                            <X className="w-4 h-4" />
                            <span>Reset Filters</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-background-dark/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/2">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-10 w-40 bg-white/5 rounded-lg" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-white/5 rounded-lg" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-white/5 rounded-lg" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-32 bg-white/5 rounded-lg" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-8 ml-auto bg-white/5 rounded-lg" /></td>
                                    </tr>
                                ))
                            ) : users.length > 0 ? (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/2 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{u.name}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{u.phone || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                                                u.role?.name === 'Super Admin' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                    u.role?.name === 'Admin' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                        "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                            )}>
                                                {u.role?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {u.company?.name || <span className="text-gray-600 font-medium italic">System</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Can permission="user.edit">
                                                    <button
                                                        onClick={() => onEdit(u)}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                        title="Edit User"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Can>
                                                <Can permission="user.delete">
                                                    <button
                                                        onClick={() => onDelete(u)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </Can>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No users found. Try adjusting your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/1">
                        <p className="text-xs text-gray-500">
                            Showing <span className="font-bold text-gray-300">{users.length}</span> of <span className="font-bold text-gray-300">{pagination.total}</span> members
                        </p>
                        <div className="flex items-center gap-2">
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
                    </div>
                )}
            </div>
        </div>
    );
};
