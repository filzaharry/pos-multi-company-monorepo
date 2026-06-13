'use client';

import React from 'react';
import { Column } from '@/components/ui/DataTable';
import { CompanyHeader } from '../types';
import { cn } from '@/lib/utils';
import { Building2, CheckCircle, Clock, AlertCircle, Eye, Calendar } from 'lucide-react';
import moment from 'moment';

interface CompanyColumnProps {
    onViewDetail: (company: CompanyHeader) => void;
}

const getStatusInfo = (company: CompanyHeader) => {
    if (company.status === 0) return { label: 'Pending', color: 'bg-orange-50 text-orange-700 border-orange-100', icon: Clock };
    if (company.status === 2) return { label: 'Expired', color: 'bg-red-50 text-red-700 border-red-100', icon: AlertCircle };

    // Status 1 (Active) - check end date
    if (company.subscription_end_date) {
        const endDate = new Date(company.subscription_end_date);
        const now = new Date();
        const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysLeft <= 0) return { label: 'Expired', color: 'bg-red-50 text-red-700 border-red-100', icon: AlertCircle };
        if (daysLeft <= 7) return { label: `Expiring (${daysLeft}d)`, color: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock };
    }

    return { label: 'Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle };
};

export const getCompanyColumns = ({ onViewDetail }: CompanyColumnProps): Column<CompanyHeader>[] => [
    {
        header: 'Company',
        accessorKey: 'name',
        sortable: true,
        cell: (company) => (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                    <Building2 className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-sm font-bold group-hover:text-primary transition-colors">{company.name}</div>
                    <div className="text-[10px] text-slate-500 ">{company.email}</div>
                </div>
            </div>
        )
    },
    {
        header: 'Route',
        accessorKey: 'route',
        sortable: true,
        cell: (company) => (
            <div className="flex items-center">
                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 font-medium rounded-md border border-slate-200">
                    /{company.route || '-'}
                </span>
            </div>
        )
    },
    {
        header: 'Status',
        accessorKey: 'status',
        sortable: true,
        cell: (company) => {
            const statusInfo = getStatusInfo(company);
            const Icon = statusInfo.icon;
            return (
                <span className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px]  font-bold border flex items-center gap-1.5 w-fit",
                    statusInfo.color
                )}>
                    <Icon className="w-3 h-3" />
                    {statusInfo.label}
                </span>
            );
        }
    },
    {
        header: 'End Date',
        accessorKey: 'subscription_end_date',
        sortable: true,
        cell: (company) => (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                {company.subscription_end_date
                    ? moment(company.subscription_end_date).format('DD MMM YYYY')
                    : '-'
                }
            </div>
        )
    },
    {
        header: 'Registered',
        accessorKey: 'created_at',
        sortable: true,
        cell: (company) => (
            <div className="text-xs text-slate-500">
                {moment(company.created_at).format('DD MMM YYYY')}
            </div>
        )
    },
    {
        header: 'Actions',
        align: 'right',
        cell: (company) => (
            <div className="flex items-center justify-end gap-1">
                <button
                    onClick={() => onViewDetail(company)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-all"
                >
                    <Eye className="w-3.5 h-3.5" />
                    Detail
                </button>
            </div>
        )
    }
];
