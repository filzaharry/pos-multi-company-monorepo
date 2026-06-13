import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface InputDisabledProps {
    label?: string;
    value?: string | number;
    icon?: LucideIcon;
    className?: string;
    variant?: 'light' | 'dark';
}

export const InputDisabled: React.FC<InputDisabledProps> = ({
    label,
    value,
    icon: Icon,
    className,
    variant = 'light'
}) => {
    return (
        <div className={cn("space-y-1.5 w-full", className)}>
            {label && (
                <label className={cn(
                    "text-xs font-bold       block px-0.5",
                    variant === 'light' ? "text-slate-800" : "text-gray-300"
                )}>
                    {label}
                </label>
            )}
            <div className="relative w-full">
                {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />}
                <div className={cn(
                    "w-full rounded-xl py-3 pr-4 cursor-not-allowed text-sm flex items-center min-h-[46px]",
                    variant === 'light'
                        ? "bg-slate-50 border border-slate-200 text-slate-700"
                        : "bg-white/5 border border-white/10 text-gray-400",
                    Icon ? "pl-12" : "px-4"
                )}>
                    {value || '-'}
                </div>
            </div>
        </div>
    );
};
