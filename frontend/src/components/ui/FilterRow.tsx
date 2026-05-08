import React from 'react';
import { cn } from '@/lib/utils';

export const FilterRow = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/2 p-4 rounded-2xl border border-white/5", className)}>
            {children}
        </div>
    );
};
