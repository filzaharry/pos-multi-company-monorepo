'use client';

import React from 'react';
import { Role, PaginationData } from '@/lib/modules/users/types';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Shield,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Can } from '@/components/auth/Can';
import moment from 'moment';

interface MobileProps {
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

export const Mobile: React.FC<MobileProps> = ({
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
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Roles</h1>
                <Can permission="role.create">
                    <button
                        onClick={onAdd}
                        className="p-2 bg-primary text-white rounded-lg shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </Can>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search roles..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                />
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="p-4 bg-background-dark border border-white/5 rounded-2xl animate-pulse h-32" />
                    ))
                ) : roles.length > 0 ? (
                    roles.map((role) => (
                        <div key={role.id} className="p-4 bg-background-dark border border-white/5 rounded-2xl space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{role.name}</h4>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                                            Modified {moment(role.created_at).fromNow()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Can permission="permission.edit">
                                        <button onClick={() => onPermissions(role)} className="p-2 text-gray-400 hover:text-primary">
                                            <ShieldCheck className="w-4 h-4" />
                                        </button>
                                    </Can>
                                    <Can permission="role.edit">
                                        <button onClick={() => onEdit(role)} className="p-2 text-gray-400 hover:text-white">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </Can>
                                    <Can permission="role.delete">
                                        <button 
                                            onClick={() => onDelete(role)} 
                                            disabled={role.name === 'Super Admin' || role.name === 'Admin'}
                                            className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </Can>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">
                                {role.description || 'No description provided.'}
                            </p>
                            {(role.name === 'Super Admin' || role.name === 'Admin') && (
                                <div className="pt-2 border-t border-white/5">
                                    <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">System Role</span>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center text-gray-500 text-sm">No roles found.</div>
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
