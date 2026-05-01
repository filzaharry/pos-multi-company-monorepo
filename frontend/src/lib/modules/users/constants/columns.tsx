'use client';

import React from 'react';
import { Column } from '@/components/ui/DataTable';
import { User } from '@/lib/modules/login/types';
import { cn } from '@/lib/utils';
import { Edit2, Trash2 } from 'lucide-react';
import { Can } from '@/components/auth/Can';

interface UserColumnProps {
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export const getUserColumns = ({ onEdit, onDelete }: UserColumnProps): Column<User>[] => [
    {
        header: 'User',
        accessorKey: 'name',
        sortable: true,
        cell: (u) => (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-inner">
                    {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{u.name}</div>
                    <div className="text-[11px] text-gray-500">{u.email}</div>
                </div>
            </div>
        )
    },
    {
        header: 'Phone',
        accessorKey: 'phone',
        sortable: true,
        cell: (u) => <span className="text-gray-400 font-medium">{u.phone || '-'}</span>
    },
    {
        header: 'Role',
        accessorKey: 'role_id',
        sortable: true,
        cell: (u) => (
            <span className={cn(
                "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                u.role?.name === 'Super Admin' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    u.role?.name === 'Admin' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            )}>
                {u.role?.name}
            </span>
        )
    },
    {
        header: 'Company',
        accessorKey: 'company_id',
        sortable: true,
        cell: (u) => (
            <div className="flex flex-col">
                <span className="text-sm text-gray-300 font-medium">{u.company?.name || '-'}</span>
                {u.company?.email && <span className="text-[10px] text-gray-600 italic">{u.company.email}</span>}
            </div>
        )
    },
    {
        header: 'Actions',
        align: 'right',
        cell: (u) => (
            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
        )
    }
];
