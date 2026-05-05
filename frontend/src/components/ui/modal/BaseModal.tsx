'use client';

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    className?: string;
    bodyClassName?: string;
    showCloseButton?: boolean;
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
};

export const BaseModal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'xl',
    className,
    bodyClassName,
    showCloseButton = true
}: BaseModalProps) => {
    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className={cn(
                            "relative w-full bg-background-dark border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
                            sizeClasses[size],
                            className
                        )}
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                            <div>
                                <h3 className="text-xl font-bold text-white leading-none">
                                    {title}
                                </h3>
                                {description && (
                                    <p className="text-sm text-gray-400 mt-2">
                                        {description}
                                    </p>
                                )}
                            </div>
                            {showCloseButton && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Body */}
                        <div className={cn("flex-1 overflow-y-auto p-8 custom-scroll", bodyClassName)}>
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="px-8 py-6 border-t border-white/5 bg-white/1 flex items-center justify-end gap-4">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
