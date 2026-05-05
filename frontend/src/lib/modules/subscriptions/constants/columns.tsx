'use client';

import React from 'react';
import { Column } from '@/components/ui/DataTable';
import { CompanySubscription } from '../types';
import { cn } from '@/lib/utils';
import { Edit2, Trash2, CheckCircle, Clock, AlertCircle, Building2 } from 'lucide-react';
import { Can } from '@/components/auth/Can';
import moment from 'moment';

interface SubscriptionColumnProps {
    onEdit: (sub: CompanySubscription) => void;
    onDelete: (sub: CompanySubscription) => void;
    onApprove: (sub: CompanySubscription) => void;
}

export const getSubscriptionColumns = ({ onEdit, onDelete, onApprove }: SubscriptionColumnProps): Column<CompanySubscription>[] => [
    {
        header: 'Company / Business',
        accessorKey: 'company_name',
        sortable: true,
        cell: (sub) => (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                    <Building2 className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{sub.company_name}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">{sub.full_name}</div>
                </div>
            </div>
        )
    },
    {
        header: 'Package',
        accessorKey: 'package_id',
        sortable: true,
        cell: (sub) => (
            <div className="flex flex-col">
                <span className="text-sm text-gray-200 font-bold">{sub.package.name}</span>
                <span className="text-[11px] text-primary">Rp {sub.package.pricing.toLocaleString()}</span>
            </div>
        )
    },
    {
        header: 'Status',
        accessorKey: 'payment_status',
        sortable: true,
        cell: (sub) => {
            const status = sub.payment_status;
            return (
                <span className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit",
                    status === 1 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        status === 2 ? "bg-red-500/10 text-red-400 border-red-500/20" :
                            "bg-orange-500/10 text-orange-400 border-orange-500/20"
                )}>
                    {status === 1 ? <CheckCircle className="w-3 h-3" /> :
                        status === 2 ? <AlertCircle className="w-3 h-3" /> :
                            <Clock className="w-3 h-3" />}
                    {status === 1 ? 'Active' : status === 2 ? 'Failed' : 'Pending'}
                </span>
            );
        }
    },
    {
        header: 'Date Created',
        accessorKey: 'created_at',
        sortable: true,
        cell: (sub) => (
            <div className="text-xs text-gray-400">
                {moment(sub.created_at).format('DD MMM YYYY')}
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
                        className="p-2 text-white bg-white/5 rounded-lg transition-all"
                        title="Edit User"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                </Can>
                <Can permission="user.delete">
                    <button
                        onClick={() => onDelete(u)}
                        className="p-2 text-red-500 bg-red-500/10 rounded-lg transition-all"
                        title="Delete User"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </Can>
            </div>
        )
    }
];
