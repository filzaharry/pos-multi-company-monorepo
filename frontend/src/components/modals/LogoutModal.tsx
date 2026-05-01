'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, AlertTriangle } from 'lucide-react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-background-dark border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl mb-6 mx-auto">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>

                            <h3 className="text-2xl font-bold text-white text-center mb-2">
                                Sign Out
                            </h3>
                            <p className="text-gray-400 text-center mb-8">
                                Are you sure you want to sign out? You will need to login again to access your dashboard.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
