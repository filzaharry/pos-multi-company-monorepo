'use client';

import { DataTable } from '@/components/ui/DataTable';
import { PaginationData } from '@/lib/modules/users/types';
import {
    Clock,
    CreditCard,
    Filter,
    Search,
    TrendingUp,
    Users,
    X
} from 'lucide-react';
import React from 'react';
import { getSubscriptionColumns } from '../constants/columns';
import { CompanySubscription, SubscriptionStats } from '../types';
import { StatCard } from './widgets/StatCard';

interface DesktopProps {
    subscriptions: CompanySubscription[];
    stats: SubscriptionStats | null;
    isLoading: boolean;
    pagination: PaginationData | null;
    search: string;
    setSearch: (val: string) => void;
    status: string;
    setStatus: (val: string) => void;
    page: number;
    setPage: (val: number) => void;
    sortKey: string;
    sortOrder: 'asc' | 'desc';
    onSort: (key: string) => void;
    onAdd: () => void;
    onEdit: (sub: CompanySubscription) => void;
    onDelete: (sub: CompanySubscription) => void;
    onApprove: (sub: CompanySubscription) => void;
}

export const Desktop: React.FC<DesktopProps> = ({
    subscriptions,
    stats,
    isLoading,
    pagination,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    sortKey,
    sortOrder,
    onSort,
    onAdd,
    onEdit,
    onDelete,
    onApprove
}) => {
    const columns = getSubscriptionColumns({ onEdit, onDelete, onApprove });



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Subscription Management</h1>
                    <p className="text-gray-400 text-sm">Monitor company billing and license life-cycles.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Revenue"
                    value={stats?.total_revenue || 0}
                    icon={TrendingUp}
                    color="bg-emerald-500"
                    trend="+12% VS LAST MONTH"
                />
                <StatCard
                    title="Active Licenses"
                    value={stats?.active_subscriptions || 0}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Pending Approvals"
                    value={stats?.pending_approvals || 0}
                    icon={Clock}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Total Orders"
                    value={stats?.total_subscriptions || 0}
                    icon={CreditCard}
                    color="bg-purple-500"
                />
            </div>

            {/* Filters */}
            <div className="p-6 bg-background-dark/50 border border-white/5 rounded-3xl backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by company or email..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600 shadow-inner"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer shadow-inner"
                        >
                            <option value="" className="bg-background-dark">All Status</option>
                            <option value="0" className="bg-background-dark">Pending</option>
                            <option value="1" className="bg-background-dark">Active</option>
                            <option value="2" className="bg-background-dark">Failed</option>
                        </select>
                    </div>

                    {(search || status) && (
                        <button
                            onClick={() => { setSearch(''); setStatus(''); setPage(1); }}
                            className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-black uppercase tracking-widest"
                        >
                            <X className="w-4 h-4" />
                            <span>Clear Filters</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={subscriptions}
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
