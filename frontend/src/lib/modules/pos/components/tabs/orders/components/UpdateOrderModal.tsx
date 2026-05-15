import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ClipboardList, Save } from 'lucide-react';
import { PosOrder } from '../../../../types';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { ORDER_STATUS_LIST } from '../../../../constants';

interface UpdateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { status: number, payment_status: string, notes?: string }) => Promise<void>;
    order: PosOrder | null;
}

export const UpdateOrderModal: React.FC<UpdateOrderModalProps> = ({ isOpen, onClose, onSubmit, order }) => {
    const [status, setStatus] = useState<number>(0);
    const [paymentStatus, setPaymentStatus] = useState('Pending');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (order) {
            setStatus(order.status);
            setPaymentStatus(order.payment_status);
            setNotes(order.notes || '');
        }
    }, [order, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({
                status,
                payment_status: paymentStatus,
                notes
            });
            onClose();
        } catch (error) {
            console.error('Failed to update order status', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !order) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-background-dark border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                <ClipboardList className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white italic uppercase tracking-wider">Update Order {order.code}</h2>
                                <p className="text-sm text-gray-500">Modify order status and payment information</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1">Order Status</label>
                            <div className="grid grid-cols-2 gap-2">
                                {ORDER_STATUS_LIST.map((s) => {
                                    const Icon = s.icon;
                                    const isActive = status === s.value;
                                    return (
                                        <button
                                            key={s.value}
                                            type="button"
                                            onClick={() => setStatus(s.value)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isActive
                                                ? 'bg-primary/20 border-primary text-white font-bold'
                                                : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                                            <span className="text-xs">{s.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1">Payment Status</label>
                            <CustomSelect
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                            >
                                <option value="Pending" className="bg-background-dark">Pending</option>
                                <option value="Paid" className="bg-background-dark">Paid</option>
                                <option value="Refunded" className="bg-background-dark">Refunded</option>
                                <option value="Cancelled" className="bg-background-dark">Cancelled</option>
                            </CustomSelect>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1">Internal Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600 resize-none"
                                rows={3}
                                placeholder="Add any internal notes here..."
                            />
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                            >
                                <Save className="w-5 h-5" />
                                <span>{isSubmitting ? 'Updating...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};
