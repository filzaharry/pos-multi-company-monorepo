'use client';

import React from 'react';
import { BaseModal } from './BaseModal';
import { RotateCcw, Filter, X } from 'lucide-react';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReset: () => void;
    onApply: () => void;
    children: React.ReactNode;
}

export const FilterModal = ({
    isOpen,
    onClose,
    onReset,
    onApply,
    children
}: FilterModalProps) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Advanced Filters"
            description="Refine your data with specific parameters."
            size="lg"
            footer={
                <>
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset All</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onApply();
                            onClose();
                        }}
                        className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Apply Filters</span>
                    </button>
                </>
            }
        >
            <div className="space-y-6 py-2">
                {children}
            </div>
        </BaseModal>
    );
};
