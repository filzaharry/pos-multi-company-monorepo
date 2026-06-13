'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '../services/subscription.service';
import {
    CompanyHeader,
    CompanySubscription,
    SubscriptionStats,
    SubscriptionPayload
} from '../types';
import { PaginationData } from '@/lib/modules/users/types';
import { useToast } from '@/components/ui/Toast';
import { Desktop } from './Desktop';
import { SubscriptionModal } from './widgets/SubscriptionModal';
import { SubscriptionHistoryModal } from './widgets/SubscriptionHistoryModal';
import { FilterModal } from '@/components/ui/modal';
import { SubscriptionFilter } from './widgets/SubscriptionFilter';

export const Layout = () => {
    const { showToast } = useToast();

    // State
    const [companies, setCompanies] = useState<CompanyHeader[]>([]);
    const [stats, setStats] = useState<SubscriptionStats | null>(null);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Applied Filters
    const [appliedFilters, setAppliedFilters] = useState({
        status: '',
        startDate: '',
        endDate: ''
    });

    // Modal state
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<CompanyHeader | null>(null);
    const [selectedSub, setSelectedSub] = useState<CompanySubscription | null>(null);

    // Refresh trigger
    const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [subsRes, statsRes] = await Promise.all([
                subscriptionService.getSubscriptions({
                    page,
                    limit: 10,
                    search,
                    status: appliedFilters.status,
                    start_date: appliedFilters.startDate,
                    end_date: appliedFilters.endDate,
                    sort_key: sortKey,
                    sort_order: sortOrder
                }),
                subscriptionService.getStats()
            ]);

            if (subsRes.status === 'success' || subsRes.status === 'Success') {
                setCompanies(subsRes.data.result.result);
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
    }, [page, search, appliedFilters, sortKey, sortOrder, showToast]);

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
            setHistoryRefreshTrigger(prev => prev + 1); // Trigger history refetch
        } catch (error) {
            console.error('Submit failed:', error);
            showToast('Submission failed', 'error');
        }
    };

    const handleViewDetail = (company: CompanyHeader) => {
        setSelectedCompany(company);
        setIsHistoryModalOpen(true);
    };

    const handleManageSubscription = (sub: CompanySubscription) => {
        setSelectedSub(sub);
        setIsSubModalOpen(true);
    };

    const applyFilters = () => {
        setAppliedFilters({
            status,
            startDate,
            endDate
        });
        setPage(1);
    };

    const resetFilters = () => {
        setStatus('');
        setStartDate('');
        setEndDate('');
        setAppliedFilters({
            status: '',
            startDate: '',
            endDate: ''
        });
        setPage(1);
    };

    return (
        <>
            <Desktop
                companies={companies}
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
                onViewDetail={handleViewDetail}
                onOpenFilter={() => {
                    setStatus(appliedFilters.status);
                    setStartDate(appliedFilters.startDate);
                    setEndDate(appliedFilters.endDate);
                    setIsFilterModalOpen(true);
                }}
                appliedFiltersCount={[appliedFilters.status, appliedFilters.startDate, appliedFilters.endDate].filter(Boolean).length}
            />

            {/* History Detail Modal */}
            <SubscriptionHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                company={selectedCompany}
                onManageSubscription={handleManageSubscription}
                onUpdateCompany={fetchData}
                historyRefreshTrigger={historyRefreshTrigger}
            />

            {/* Individual Subscription Modal (for Review/Update) */}
            <SubscriptionModal
                isOpen={isSubModalOpen}
                onClose={() => {
                    setIsSubModalOpen(false);
                }}
                onSubmit={handleFormSubmit}
                subscription={selectedSub}
            />

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onReset={() => {
                    resetFilters();
                    setIsFilterModalOpen(false);
                }}
                onApply={() => {
                    applyFilters();
                    setIsFilterModalOpen(false);
                }}
            >
                <SubscriptionFilter
                    status={status}
                    setStatus={setStatus}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                />
            </FilterModal>
        </>
    );
};
