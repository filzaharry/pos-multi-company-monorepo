'use client';

import React from 'react';
import { Role, PaginationData } from '@/lib/modules/users/types';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Shield,
    X,
    Clock,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Can } from '@/components/auth/Can';
import { motion } from 'framer-motion';
import moment from 'moment';

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
    onPermissions
}) => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Role Management</h1>
                    <p className="text-gray-400">Define and manage user roles and permissions.</p>
                </div>
                <Can permission="role.create">
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add New Role</span>
                    </button>
                </Can>
            </div>

            {/* Filters */}
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

            {/* Grid of Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="h-48 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
                    ))
                ) : roles.length > 0 ? (
                    roles.map((role) => (
                        <motion.div
                            key={role.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative bg-background-dark/50 border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5 cursor-default overflow-hidden"
                        >
                            <Shield className="absolute -right-4 -bottom-4 w-24 h-24 text-white/2 -rotate-12 group-hover:text-primary/5 transition-colors" />

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <Can permission="permission.edit">
                                        <button
                                            onClick={() => onPermissions(role)}
                                            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                            title="Manage Permissions"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                        </button>
                                    </Can>
                                    <Can permission="role.edit">
                                        <button
                                            onClick={() => onEdit(role)}
                                            className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                            title="Edit Role"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </Can>
                                    <Can permission="role.delete">
                                        <button
                                            onClick={() => onDelete(role)}
                                            disabled={role.name === 'Super Admin' || role.name === 'Admin'}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-0"
                                            title="Delete Role"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </Can>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{role.name}</h3>
                            <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px] mb-4">
                                {role.description || 'No description provided.'}
                            </p>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    <span>Modified {moment(role.created_at).fromNow()}</span>
                                </div>
                                {(role.name === 'Super Admin' || role.name === 'Admin') && (
                                    <span className="text-primary/60">System Role</span>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <Shield className="w-16 h-16 text-white/5 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">No Roles Found</h3>
                        <p className="text-gray-500">Create your first role to start managing permissions.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
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
            )}
        </div>
    );
};
