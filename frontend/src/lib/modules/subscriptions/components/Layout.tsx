'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '../services/subscription.service';
import {
    CompanySubscription,
    SubscriptionStats,
    SubscriptionPayload
} from '../types';
import { PaginationData } from '@/lib/modules/users/types';
import { useToast } from '@/components/ui/Toast';
import { Desktop } from './Desktop';
import { SubscriptionModal } from './widgets/SubscriptionModal';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export const Layout = () => {
    const { showToast } = useToast();

    // State
    const [subscriptions, setSubscriptions] = useState<CompanySubscription[]>([]);
    const [stats, setStats] = useState<SubscriptionStats | null>(null);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Filters
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSub, setSelectedSub] = useState<CompanySubscription | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [subToDelete, setSubToDelete] = useState<CompanySubscription | null>(null);

    // Responsiveness
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [subsRes, statsRes] = await Promise.all([
                subscriptionService.getSubscriptions({
                    page,
                    limit: 10,
                    search,
                    status,
                    sort_key: sortKey,
                    sort_order: sortOrder
                }),
                subscriptionService.getStats()
            ]);

            if (subsRes.status === 'success' || subsRes.status === 'Success') {
                console.log("subsRes.data.result");
                console.log(subsRes.data.result);

                setSubscriptions(subsRes.data.result.subscriptions);
                setPagination(subsRes.data.result.pagination);
            }

            if (statsRes.status === 'success' || statsRes.status === 'Success') {
                setStats(statsRes.data.result);
            }
        } catch (error) {
            console.error('Failed to fetch subscription data:', error);
            showToast('Failed to load data', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [page, search, status, sortKey, sortOrder, showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFormSubmit = async (values: SubscriptionPayload) => {
        try {
            if (selectedSub) {
                await subscriptionService.updateSubscription(selectedSub.id, values);
                showToast('Subscription updated successfully', 'success');
            } else {
                await subscriptionService.createSubscription(values);
                showToast('Subscription created successfully', 'success');
            }
            fetchData();
        } catch (error) {
            console.error('Submit failed:', error);
            showToast('Submission failed', 'error');
        }
    };

    const handleApprove = async (sub: CompanySubscription) => {
        try {
            await subscriptionService.approveSubscription(sub.id);
            showToast('Subscription approved successfully', 'success');
            fetchData();
        } catch (error) {
            showToast('Approval failed', 'error');
        }
    };

    const confirmDelete = async () => {
        if (!subToDelete) return;
        try {
            await subscriptionService.deleteSubscription(subToDelete.id);
            showToast('Subscription deleted', 'success');
            setIsDeleteModalOpen(false);
            setSubToDelete(null);
            fetchData();
        } catch (error) {
            showToast('Delete failed', 'error');
        }
    };

    return (
        <>
            <Desktop
                subscriptions={subscriptions}
                stats={stats}
                isLoading={isLoading}
                pagination={pagination}
                search={search} setSearch={setSearch}
                status={status} setStatus={setStatus}
                page={page} setPage={setPage}
                sortKey={sortKey} sortOrder={sortOrder}
                onSort={(key) => {
                    if (sortKey === key) {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                        setSortKey(key);
                        setSortOrder('asc');
                    }
                }}
                onAdd={() => { setSelectedSub(null); setIsModalOpen(true); }}
                onEdit={(sub) => { setSelectedSub(sub); setIsModalOpen(true); }}
                onDelete={(sub) => { setSubToDelete(sub); setIsDeleteModalOpen(true); }}
                onApprove={handleApprove}
            />

            <SubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                subscription={selectedSub}
            />

            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-background-dark border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
                            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Terminate Subscription?</h3>
                            <p className="text-gray-400 mb-8 font-medium">Are you sure you want to remove the subscription for <span className="text-white font-black">{subToDelete?.company_name}</span>? This action is irreversible.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl font-bold transition-all">Cancel</button>
                                <button onClick={confirmDelete} className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 uppercase tracking-widest">Execute</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
