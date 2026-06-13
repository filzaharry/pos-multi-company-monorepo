import React, { useEffect, useState } from 'react';
import { CompanyHeader, CompanySubscription } from '../../types';
import { subscriptionService } from '../../services/subscription.service';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CompanyProfileHeader } from './CompanyProfileHeader';
import { SubscriptionHistoryTable } from './SubscriptionHistoryTable';
import { EditCompanyModal } from './EditCompanyModal';
import { CreatePaymentModal } from './CreatePaymentModal';

interface SubscriptionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    company: CompanyHeader | null;
    onManageSubscription?: (sub: CompanySubscription) => void;
    onUpdateCompany?: () => void;
    historyRefreshTrigger?: number;
}

export const SubscriptionHistoryModal: React.FC<SubscriptionHistoryModalProps> = ({
    isOpen,
    onClose,
    company,
    onManageSubscription,
    onUpdateCompany,
    historyRefreshTrigger
}) => {
    const [history, setHistory] = useState<CompanySubscription[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreatePaymentModalOpen, setIsCreatePaymentModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen && company) {
            fetchHistory();
        }
    }, [isOpen, company, historyRefreshTrigger]);

    const fetchHistory = async () => {
        if (!company) return;
        setIsLoading(true);
        try {
            const res = await subscriptionService.getHistory(company.id);
            if (res.status === 'success' || res.status === 'Success') {
                setHistory(res.data.result.result || []);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!company) return null;

    return (
        <>
            <AnimatePresence mode="wait">
                {isOpen && (
                    <div key="main-drawer" className="fixed inset-0 z-[100] flex justify-end">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-full md:w-[90vw] max-w-5xl h-full bg-background-light shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="px-8 py-6 border-b border-white/5 bg-white/2 flex items-center justify-between z-10">
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="p-2 text-gray-800 hover:text-black hover:bg-black/5 rounded-xl transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto custom-scroll">
                                <CompanyProfileHeader
                                    company={company}
                                    history={history}
                                    onOpenEditModal={() => setIsEditModalOpen(true)}
                                />

                                <div className="px-8 pb-12">
                                    <SubscriptionHistoryTable
                                        history={history}
                                        isLoading={isLoading}
                                        onManageSubscription={onManageSubscription}
                                        onOpenCreatePayment={() => setIsCreatePaymentModalOpen(true)}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <EditCompanyModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                company={company}
                onUpdateCompany={() => {
                    if (onUpdateCompany) onUpdateCompany();
                    fetchHistory();
                }}
            />

            <CreatePaymentModal
                isOpen={isCreatePaymentModalOpen}
                onClose={() => setIsCreatePaymentModalOpen(false)}
                company={company}
                onSuccess={() => fetchHistory()}
            />
        </>
    );
};
