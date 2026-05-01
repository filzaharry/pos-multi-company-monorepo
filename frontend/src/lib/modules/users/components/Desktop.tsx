'use client';

import React from 'react';
import { User } from '@/lib/modules/login/types';
import { PaginationData, Role, Company } from '@/lib/modules/users/types';
import {
    Search,
    Plus,
    Shield,
    Building2,
    X,
} from 'lucide-react';
import { Can } from '@/components/auth/Can';
import { DataTable } from '@/components/ui/DataTable';
import { getUserColumns } from '../constants/columns';

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
    sortKey: string;
    sortOrder: 'asc' | 'desc';
    onSort: (key: string) => void;
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
    sortKey,
    sortOrder,
    onSort,
    onAdd,
    onEdit,
    onDelete
}) => {
    const columns = getUserColumns({ onEdit, onDelete });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-gray-400 text-sm">Manage organizational members and their access levels.</p>
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
            <div className="p-6 bg-background-dark/50 border border-white/5 rounded-2xl backdrop-blur-sm shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name, email..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600 shadow-inner"
                        />
                    </div>

                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                            value={roleId}
                            onChange={(e) => { setRoleId(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer shadow-inner"
                        >
                            <option value="" className="bg-background-dark text-gray-400">All Roles</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id.toString()} className="bg-background-dark text-white">{role.name}</option>
                            ))}
                        </select>
                    </div>

                    {isSuperAdmin && (
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <select
                                value={companyId}
                                onChange={(e) => { setCompanyId(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer shadow-inner"
                            >
                                <option value="" className="bg-background-dark text-gray-400">All Companies</option>
                                {companies.map(company => (
                                    <option key={company.id} value={company.id.toString()} className="bg-background-dark text-white">{company.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(search || roleId || companyId) && (
                        <button
                            onClick={() => { setSearch(''); setRoleId(''); setCompanyId(''); setPage(1); }}
                            className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-bold group"
                        >
                            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                            <span>Reset Filters</span>
                        </button>
                    )}
                </div>
            </div>

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
