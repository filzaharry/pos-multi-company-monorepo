import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ClipboardList, Save } from 'lucide-react';
import { PosOrder } from '../../../../types';
import { InputDropdown, InputTextArea } from '@/components/ui/input';
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
                    className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                <ClipboardList className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 italic      ">Update Order {order.code}</h2>
                                <p className="text-sm text-slate-800">Modify order status and payment information</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-800 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-800   tracking-[0.2em] px-1">Order Status</label>
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
                                                ? 'bg-primary/10 border-primary text-slate-800 font-bold'
                                                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                                            <span className="text-xs">{s.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <InputDropdown
                            label="Payment Status"
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                        >
                            <option value="Pending" className="bg-white text-slate-800">Pending</option>
                            <option value="Paid" className="bg-white text-slate-800">Paid</option>
                            <option value="Refunded" className="bg-white text-slate-800">Refunded</option>
                            <option value="Cancelled" className="bg-white text-slate-800">Cancelled</option>
                        </InputDropdown>

                        <InputTextArea
                            label="Internal Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any internal notes here..."
                            rows={3}
                        />

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-all"
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
