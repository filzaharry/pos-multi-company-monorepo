'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { userService } from '@/lib/modules/users/services/user.service';
import { Company } from '@/lib/modules/users/types';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Filter,
    ChevronLeft,
    ChevronRight,
    Building2,
    X,
    AlertCircle,
    Calendar,
    CreditCard,
    CheckCircle2,
    Clock,
    ShieldAlert,
    BarChart3,
    TrendingUp,
    Users,
    FileText,
    Eye,
    ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogin } from '@/lib/modules/login/store/useLogin';
import { SubscriptionModal } from './SubscriptionModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';
import { Can } from '@/components/auth/Can';
import { apiRouter } from '@/lib/api/router';

export default function SubscriptionManagementPage() {
    const { showToast } = useToast();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
    const [viewProofUrl, setViewProofUrl] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [planFilter, setPlanFilter] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [companiesRes, statsRes] = await Promise.all([
                userService.getCompanies(),
                apiRouter.get<any>('/companies/stats')
            ]);
            setCompanies(companiesRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Failed to fetch subscription data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = () => {
        setSelectedCompany(null);
        setIsModalOpen(true);
    };

    const handleEdit = (company: Company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (company: Company) => {
        setCompanyToDelete(company);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!companyToDelete) return;
        try {
            await apiRouter.delete(`/companies/${companyToDelete.id}`);
            showToast('Subscription deleted successfully', 'success');
            fetchData();
            setIsDeleteModalOpen(false);
        } catch (error) {
            showToast('Failed to delete subscription', 'error');
        }
    };

    const filteredCompanies = companies.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter ? c.subscription_status === statusFilter : true;
        const matchesPlan = planFilter ? c.subscription_plan === planFilter : true;
        return matchesSearch && matchesStatus && matchesPlan;
    });

    const getPlanBadge = (plan: string) => {
        switch (plan) {
            case 'expert': return <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase rounded border border-purple-500/20 tracking-widest">Expert</span>;
            case 'recommended': return <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase rounded border border-amber-500/20 tracking-widest">Recommended</span>;
            default: return <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded border border-blue-500/20 tracking-widest">Basic</span>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded border border-emerald-500/20 tracking-widest">
                        <CheckCircle2 className="w-3 h-3" /> Active
                    </div>
                );
            case 'pending':
                return (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase rounded border border-amber-500/20 tracking-widest">
                        <Clock className="w-3 h-3" /> Pending
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-black uppercase rounded border border-red-500/20 tracking-widest">
                        <ShieldAlert className="w-3 h-3" /> Inactive
                    </div>
                );
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                            <CreditCard className="w-10 h-10 text-primary" />
                            SUBSCRIPTIONS
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Manage platform subscribers and monitor payment status</p>
                    </div>
                    <Can permission="subscription.approve">
                        <button
                            onClick={handleAdd}
                            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            ADD NEW SUBSCRIBER
                        </button>
                    </Can>
                </div>

                {/* Statistics Report Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Subscribers', value: stats?.total || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: 'Active Plans', value: stats?.active || 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { label: 'Pending Payment', value: stats?.pending || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                        { label: 'Inactive / Expired', value: stats?.inactive || 0, icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
                    ].map((card, i) => (
                        <div key={i} className="bg-white/2 border border-white/5 p-6 rounded-3xl group hover:border-white/10 transition-all">
                            <div className={cn("inline-flex p-3 rounded-2xl mb-4 group-hover:scale-110 transition-transform", card.bg, card.color)}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{card.label}</p>
                            <h3 className="text-3xl font-black text-white mt-1">{card.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/2 p-4 rounded-2xl border border-white/5">
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search subscribers..."
                            className="w-full bg-background-dark border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <select
                        className="bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value)}
                    >
                        <option value="">All Plans</option>
                        <option value="basic">Basic</option>
                        <option value="recommended">Recommended</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>

                {/* Main Table */}
                <div className="bg-white/2 rounded-3xl border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/2">
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Subscriber</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Plan & Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Proof of Payment</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Validity</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/2">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-6 py-8">
                                                <div className="h-10 bg-white/5 rounded-xl w-full" />
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredCompanies.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 grayscale opacity-30">
                                                <Building2 className="w-16 h-16 text-gray-500" />
                                                <p className="text-gray-500 font-black tracking-widest uppercase text-xs">No records found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCompanies.map((company, index) => (
                                        <motion.tr
                                            key={company.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary/20 to-blue-500/20 border border-primary/20 flex items-center justify-center">
                                                        <Building2 className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-lg">{company.name}</p>
                                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-tight">{company.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1.5">
                                                    <div>{getPlanBadge(company.subscription_plan)}</div>
                                                    <div>{getStatusBadge(company.subscription_status)}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {company.payment_proof_url ? (
                                                    <div
                                                        onClick={() => setViewProofUrl(company.payment_proof_url!)}
                                                        className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all overflow-hidden relative group/img"
                                                    >
                                                        <img src={company.payment_proof_url} alt="Proof" className="w-full h-full object-cover opacity-50 group-hover/img:opacity-100 transition-opacity" />
                                                        <Eye className="absolute inset-0 m-auto w-4 h-4 text-white opacity-0 group-hover/img:opacity-100 transition-opacity scale-75 group-hover/img:scale-100" />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl border border-white/5 bg-white/2 flex items-center justify-center text-gray-700">
                                                        <ImageIcon className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-gray-500" />
                                                        {company.valid_until ? new Date(company.valid_until).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Expires</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleEdit(company)} className="p-2.5 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all">
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(company)} className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <SubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                company={selectedCompany}
                onSaveSuccess={fetchData}
            />

            {/* Proof Viewer */}
            <AnimatePresence>
                {viewProofUrl && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setViewProofUrl(null)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative max-w-4xl max-h-full overflow-hidden rounded-3xl border border-white/10">
                            <img src={viewProofUrl} alt="Payment Proof Large" className="w-full h-full object-contain" />
                            <button onClick={() => setViewProofUrl(null)} className="absolute top-4 right-4 p-3 bg-black/50 text-white rounded-full hover:bg-black transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-background-dark border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <ShieldAlert className="w-10 h-10 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-black text-white">REMOVE SUBSCRIBER?</h3>
                                <p className="text-gray-400 font-medium">This will permanently delete <span className="text-white font-bold">{companyToDelete?.name}</span> and disable all their child accounts.</p>
                                <div className="flex w-full gap-4 mt-4">
                                    <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-6 py-3 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/5">CANCEL</button>
                                    <button onClick={confirmDelete} className="flex-1 px-6 py-3 bg-red-500 text-white rounded-2xl font-black shadow-xl shadow-red-500/20 active:scale-95">DELETE</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
