import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PosOrder } from '../../../../types';
import { posService } from '../../../../services/pos.service';
import { OrderingService } from '../../../ordering/types';
import { PosOrdering } from '../../../ordering/PosOrdering';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<PosOrder>) => Promise<void>;
    companyId: number;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onSubmit, companyId }) => {
    
    const serviceAdapter: OrderingService = {
        getCategories: async (id: number) => {
            const res = await posService.getCategories(id, { page: 1, limit: 100 });
            return { items: res.data.result.items };
        },
        getDeliveries: async (id: number) => {
            const res = await posService.getDeliveries(id, { page: 1, limit: 100 });
            return { items: res.data.result.items };
        },
        getLevels: async (id: number) => {
            const res = await posService.getLevels(id, { page: 1, limit: 100 });
            return { items: res.data.result.items };
        },
        getExtras: async (id: number) => {
            const res = await posService.getExtras(id, { page: 1, limit: 100 });
            return { items: res.data.result.items };
        },
        getProducts: async (id: number, categoryId?: number, search?: string, page?: number) => {
            const res = await posService.getItems(id, {
                page: page || 1,
                limit: 12,
                category_id: categoryId,
                search: search
            });
            return { items: res.data.result.items };
        },
        createOrder: async (id: number, data: Partial<PosOrder>) => {
            await posService.createOrder(id, data);
            await onSubmit(data); // Propagate to parent to refresh order lists
            return;
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ scale: 0.98, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.98, opacity: 0, y: 10 }}
                        className="relative w-full max-w-[95vw] h-screen bg-white border border-slate-200 rounded-[2.5rem] p-6 lg:p-10 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
                    >
                        <PosOrdering
                            companyId={companyId}
                            companyName="System POS"
                            mode="modal"
                            onClose={onClose}
                            service={serviceAdapter}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
