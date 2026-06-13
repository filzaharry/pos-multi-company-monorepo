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
                    {u.name.charAt(0).to()}
                </div>
                <div>
                    <div className="text-sm font-bold group-hover:text-primary transition-colors">{u.name}</div>
                    <div className="text-[11px] text-slate-500">{u.email}</div>
                </div>
            </div>
        )
    },
    {
        header: 'Phone',
        accessorKey: 'phone',
        sortable: true,
        cell: (u) => <span className="font-medium">{u.phone || '-'}</span>
    },
    {
        header: 'Role',
        accessorKey: 'role_id',
        sortable: true,
        cell: (u) => (
            <span className={cn(
                "px-2.5 py-1 rounded-lg text-[10px]  font-bold border",
                u.role?.name === 'Super Admin' ? "bg-red-50 text-red-700 border-red-100" :
                    u.role?.name === 'Admin' ? "bg-blue-50 text-blue-700 border-blue-100" :
                        "bg-emerald-50 text-emerald-700 border-emerald-100"
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
                <span className="text-sm font-medium">{u.company?.name || '-'}</span>
                {u.company?.email && <span className="text-[10px] text-slate-500 italic">{u.company.email}</span>}
            </div>
        )
    },
    {
        header: 'Actions',
        align: 'right',
        cell: (u) => (
            <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
                <Can permission="user.edit">
                    <button
                        onClick={() => onEdit(u)}
                        className="p-2 text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                        title="Edit User"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                </Can>
                <Can permission="user.delete">
                    <button
                        onClick={() => onDelete(u)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete User"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </Can>
            </div>
        )
    }
];
