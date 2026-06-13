'use client';

import React, { useEffect, useState } from 'react';
import { SalesChart } from '@/components/dashboard/charts/SalesChart';
import {
    TrendingUp,
    Users,
    CreditCard,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { getDashboardOverview, DashboardOverviewResponse } from '../services/dashboard.service';
import { useLogin } from '@/lib/modules/login/store/useLogin';

export const Desktop = () => {
    const { user } = useLogin();
    const [data, setData] = useState<DashboardOverviewResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                // If user is a company user, use their company_id, otherwise undefined
                const res = await getDashboardOverview(user?.company_id?.toString());
                setData(res);
            } catch (error) {
                console.error("Failed to fetch dashboard overview", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOverview();
    }, [user]);

    const stats = [
        {
            label: 'Total Revenue',
            value: data ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR' }).format(data.total_revenue) : '$0',
            change: data?.total_revenue_change || '+0%',
            trend: (data?.total_revenue_change || '').startsWith('-') ? 'down' : 'up',
            icon: CreditCard,
            color: 'text-blue-400'
        },
        {
            label: 'Total Customers',
            value: data?.total_customers?.toString() || '0',
            change: data?.total_customers_change || '+0%',
            trend: (data?.total_customers_change || '').startsWith('-') ? 'down' : 'up',
            icon: Users,
            color: 'text-purple-400'
        },
        {
            label: 'Total Orders',
            value: data?.total_orders?.toString() || '0',
            change: data?.total_orders_change || '+0%',
            trend: (data?.total_orders_change || '').startsWith('-') ? 'down' : 'up',
            icon: Package,
            color: 'text-orange-400'
        },
        {
            label: 'Conversion Rate',
            value: data?.conversion_rate || '0%',
            change: data?.conversion_rate_change || '+0%',
            trend: (data?.conversion_rate_change || '').startsWith('-') ? 'down' : 'up',
            icon: TrendingUp,
            color: 'text-green-400'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <PageHeader
                title="Dashboard Overview"
                subtitle="Welcome back! Here's what's happening today."
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl hover:border-primary/50 transition-all group shadow-xs hover:shadow-md"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-slate-100 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.change}
                                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-slate-900">
                            {isLoading ? '...' : stat.value}
                        </h3>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-xs">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-slate-900">Sales Performance</h3>
                        <select className="bg-white border border-slate-200 text-xs text-slate-700 px-3 py-2 rounded-lg focus:outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        {isLoading ? (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">Loading chart...</div>
                        ) : (
                            <SalesChart data={data?.sales_chart} />
                        )}
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-xs flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Recent Subscriptions
                    </h3>
                    <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <p className="text-sm text-slate-500">Loading subscriptions...</p>
                        ) : data?.recent_subscriptions && data.recent_subscriptions.length > 0 ? (
                            data.recent_subscriptions.map((sub: any, i: number) => (
                                <div key={sub.id || i} className="flex gap-4">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shadow-[0_0_10px_rgba(34,197,94,0.3)] shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 line-clamp-1">{sub.company_name}</p>
                                        <p className="text-xs text-slate-500">{sub.package?.name || 'Package'} &bull; {new Date(sub.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">No recent subscriptions found.</p>
                        )}
                    </div>
                    <button className="w-full mt-6 py-3 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-all">
                        View All Subscriptions
                    </button>
                </div>
            </div>
        </div>
    );
};
