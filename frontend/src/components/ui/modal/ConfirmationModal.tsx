'use client';

import React from 'react';
import { AlertCircle, Loader2, LogOut, PiIcon, Trash2 } from 'lucide-react';
import { BaseModal } from './BaseModal';
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
    variant?: 'danger' | 'warning' | 'info' | 'success';
    iconType?: 'delete' | 'logout' | 'alert';
}

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    variant = 'danger',
    iconType = 'alert'
}: ConfirmationModalProps) => {
    const variantColors = {
        danger: 'bg-red-500 hover:bg-red-600 shadow-red-500/20',
        warning: 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20',
        info: 'bg-primary hover:bg-primary/90 shadow-primary/20',
        success: 'bg-green-500 hover:bg-green-600 shadow-green-500/20',
    };

    const Icon = () => {
        switch (iconType) {
            case 'delete': return <Trash2 className="w-8 h-8" />;
            case 'logout': return <LogOut className="w-8 h-8" />;
            default: return <AlertCircle className="w-8 h-8" />;
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="md"
            showCloseButton={false}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            "flex items-center gap-2 px-8 py-2.5 text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50",
                            variantColors[variant]
                        )}
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{confirmText}</span>
                    </button>
                </>
            }
        >
            <div className="flex flex-col items-center text-center py-4">
                <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                    variant === 'danger' ? "bg-red-500/10 text-red-500" :
                        variant === 'warning' ? "bg-yellow-500/10 text-yellow-500" :
                            variant === 'success' ? "bg-green-500/10 text-green-500" :
                                "bg-primary/10 text-primary"
                )}>
                    <PiIcon />
                </div>
                <p className="text-gray-400 leading-relaxed">
                    {message}
                </p>
            </div>
        </BaseModal>
    );
};
