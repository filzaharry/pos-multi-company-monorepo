'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Continue',
    cancelText = 'Cancel',
    isLoading = false
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-background-dark border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Background Accent */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                <AlertCircle className="w-8 h-8 text-primary" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                {message}
                            </p>

                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center h-14 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isLoading ? 'Processing...' : confirmText}
                                </button>
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center h-14 rounded-2xl border border-white/10 text-white/60 font-bold hover:bg-white/5 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
