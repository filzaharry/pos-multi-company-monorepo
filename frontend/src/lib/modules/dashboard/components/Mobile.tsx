'use client';

import React from 'react';
import { SalesChart } from '@/components/dashboard/charts/SalesChart';
import {
    TrendingUp,
    Users,
    CreditCard,
    Package,
} from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
    { label: 'Revenue', value: '$124.5k', icon: CreditCard, color: 'text-blue-400' },
    { label: 'Users', value: '1,240', icon: Users, color: 'text-purple-400' },
    { label: 'Orders', value: '452', icon: Package, color: 'text-orange-400' },
    { label: 'Rate', value: '3.2%', icon: TrendingUp, color: 'text-green-400' }
];

export const Mobile = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 text-sm text-balance">Overview of your business performance.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl"
                    >
                        <div className={`p-2 rounded-lg bg-slate-100 ${stat.color} w-fit mb-3`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-slate-500 text-xs mb-1">{stat.label}</p>
                        <h3 className="text-lg font-bold text-slate-900">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Sales Performance</h3>
                <div className="h-[200px]">
                    <SalesChart />
                </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                            <div>
                                <p className="text-xs font-medium text-slate-800">Order #RD-{1234 + i}</p>
                                <p className="text-[10px] text-slate-500">2m ago</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
