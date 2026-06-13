'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    // Listen for global toast events
    useEffect(() => {
        const handleGlobalToast = (event: Event) => {
            const customEvent = event as CustomEvent<{ message: string; type: ToastType }>;
            const { message, type } = customEvent.detail;
            showToast(message, type);
        };

        window.addEventListener('app:toast', handleGlobalToast);
        return () => window.removeEventListener('app:toast', handleGlobalToast);
    }, [showToast]);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-200 flex flex-col items-center gap-3 pointer-events-none w-full max-w-sm px-4">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            className={cn(
                                "pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border bg-white w-full",
                                toast.type === 'success' ? "border-green-100 text-green-600" :
                                    toast.type === 'error' ? "border-red-100 text-red-600" :
                                        "border-primary/20 text-primary"
                            )}
                        >
                            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
                            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0" />}

                            <p className="text-sm font-bold flex-1">{toast.message}</p>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
