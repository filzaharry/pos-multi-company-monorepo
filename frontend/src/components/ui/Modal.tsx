import React from 'react';
import { X, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    icon: Icon,
    children,
    maxWidth = '2xl'
}: ModalProps) => {
    const maxWidths = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl'
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={cn(
                    "relative bg-background-dark border border-white/10 rounded-2xl w-full overflow-hidden shadow-2xl",
                    maxWidths[maxWidth]
                )}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/2">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {Icon && <Icon className="w-6 h-6 text-primary" />}
                        {title}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};
