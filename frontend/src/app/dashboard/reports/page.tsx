'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
    BarChart3,
    TrendingUp,
    Users,
    ShoppingCart,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Search,
    Download,
    Eye,
    Receipt,
    Filter,
    CreditCard,
    DollarSign,
    Box,
    CheckCircle2,
    Clock,
    XCircle,
    Building2,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogin } from '@/lib/modules/login/store/useLogin';
import { apiRouter } from '@/lib/api/router';
import { PosOrder, DashboardStats } from '@/lib/modules/pos/types';
import { useToast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function SalesReportPage() {
    const { activeCompanyId } = useLogin();
    const [orders, setOrders] = useState<PosOrder[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = useCallback(async () => {
        if (!activeCompanyId) return;
        setIsLoading(true);
        try {
            const [ordersRes, statsRes] = await Promise.all([
                apiRouter.get<any>('/pos/orders'),
                apiRouter.get<any>('/pos/stats')
            ]);
            setOrders(ordersRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setIsLoading(false);
        }
    }, [activeCompanyId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredOrders = orders.filter(o =>
        o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.payment_method.toLowerCase().includes(search.toLowerCase()) ||
        String(o.id).includes(search)
    );

    if (!activeCompanyId) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                        <BarChart3 className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">No Company Selected</h2>
                    <p className="text-gray-500 mt-2 max-w-md">Please select a company to view its sales analytics.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                            <BarChart3 className="w-10 h-10 text-primary" />
                            SALES REPORTS
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Real-time performance metrics and order history</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
                            <Calendar className="w-4 h-4" />
                            Last 30 Days
                        </button>
                        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <Download className="w-4 h-4" />
                            Export Data
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Revenue', value: `Rp ${stats?.total_revenue.toLocaleString() || 0}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { label: 'Success Sales', value: stats?.total_sales || 0, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: 'Total Orders', value: stats?.total_orders || 0, icon: Receipt, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                        { label: 'Low Stock Alerts', value: stats?.low_stock || 0, icon: Box, color: 'text-red-500', bg: 'bg-red-500/10' },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/2 border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-all"
                        >
                            <div className={cn("inline-flex p-3 rounded-2xl mb-4 group-hover:scale-110 transition-transform", item.bg, item.color)}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">{item.label}</p>
                            <h3 className="text-2xl font-black text-white mt-1">{item.value}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Order History */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                            <History className="w-6 h-6 text-primary" />
                            ORDER HISTORY
                        </h2>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by customer or method..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white/2 rounded-3xl border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/2">
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Order ID</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date & Time</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Payment</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/2">
                                    {isLoading ? (
                                        [1, 2, 3].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan={6} className="px-6 py-8">
                                                    <div className="h-10 bg-white/5 rounded-xl w-full" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3 grayscale opacity-30">
                                                    <Receipt className="w-16 h-16 text-gray-500" />
                                                    <p className="text-gray-500 font-black tracking-widest uppercase text-xs">No orders found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order, index) => (
                                            <motion.tr
                                                key={order.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="px-6 py-5">
                                                    <span className="font-black text-primary text-sm uppercase">#ORD-{order.id.toString().padStart(5, '0')}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                            <Users className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                        <span className="text-white font-bold">{order.customer_name || 'Walk-in Customer'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-medium">{new Date(order.created_at!).toLocaleDateString()}</span>
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{new Date(order.created_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className={cn(
                                                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter",
                                                            order.payment_status === 'paid' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                                        )}>
                                                            {order.payment_status}
                                                        </div>
                                                        <span className="text-[10px] text-gray-500 font-bold uppercase">{order.payment_method}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-white font-black">Rp {order.total_amount.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
