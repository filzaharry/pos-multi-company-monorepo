'use client';

import React from 'react';
import { SalesChart } from '@/components/dashboard/charts/SalesChart';
import {
    TrendingUp,
    Users,
    CreditCard,
    Package,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
    {
        label: 'Total Revenue',
        value: '$124,592',
        change: '+12.5%',
        trend: 'up',
        icon: CreditCard,
        color: 'text-blue-400'
    },
    {
        label: 'Total Customers',
        value: '1,240',
        change: '+3.2%',
        trend: 'up',
        icon: Users,
        color: 'text-purple-400'
    },
    {
        label: 'Total Orders',
        value: '452',
        change: '-2.1%',
        trend: 'down',
        icon: Package,
        color: 'text-orange-400'
    },
    {
        label: 'Conversion Rate',
        value: '3.24%',
        change: '+1.5%',
        trend: 'up',
        icon: TrendingUp,
        color: 'text-green-400'
    }
];

export const Desktop = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-gray-400">{"Welcome back! Here's what's happening today."}</p>
            </div>


            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-background-dark border border-white/5 rounded-2xl hover:border-primary/50 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                {stat.change}
                                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 bg-background-dark border border-white/5 rounded-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-white">Sales Performance</h3>
                        <select className="bg-white/5 border border-white/10 text-xs text-white px-3 py-2 rounded-lg focus:outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <SalesChart />
                    </div>
                </div>

                <div className="p-6 bg-background-dark border border-white/5 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 shadow-[0_0_10px_rgba(71,140,209,0.5)]" />
                                <div>
                                    <p className="text-sm font-medium text-white">New order received #RD-{1234 + i}</p>
                                    <p className="text-xs text-gray-500">2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-all">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
};
