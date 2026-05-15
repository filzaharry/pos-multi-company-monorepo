import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlusCircle, Save } from 'lucide-react';
import { PosExtra } from '../../../../types';
import { CustomInput } from '@/components/ui/CustomInput';

interface ExtraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<PosExtra>) => Promise<void>;
    extra?: PosExtra | null;
}

export const ExtraModal: React.FC<ExtraModalProps> = ({ isOpen, onClose, onSubmit, extra }) => {
    const [formData, setFormData] = useState<Partial<PosExtra>>({
        name: '',
        price: '0',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (extra) {
            setFormData({
                name: extra.name || '',
                price: extra.price || '0',
            });
        } else {
            setFormData({
                name: '',
                price: '0',
            });
        }
    }, [extra, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Failed to submit extra', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
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
                        className="relative w-full max-w-lg bg-background-dark border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between mb-8 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                    <PlusCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white italic uppercase tracking-wider">
                                        {extra ? 'Edit Extra' : 'New Extra'}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {extra ? 'Update add-on details and pricing' : 'Create a new add-on/topping'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1">Extra Name *</label>
                                    <CustomInput
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. Extra Cheese"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1">Price (IDR) *</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold z-10">Rp</span>
                                        <CustomInput
                                            type="number"
                                            name="price"
                                            required
                                            min="0"
                                            value={formData.price || '0'}
                                            onChange={handleChange}
                                            className="pl-12"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex gap-4 shrink-0 mt-4">
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
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-5 h-5" />
                                    <span>{isSubmitting ? 'Saving...' : 'Save Extra'}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};
