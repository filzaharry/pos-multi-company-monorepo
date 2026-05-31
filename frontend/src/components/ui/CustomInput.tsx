import React from 'react';
import { cn } from '@/lib/utils';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ElementType;
    variant?: 'light' | 'dark';
}

export const CustomInput = ({ icon: Icon, className, variant = 'dark', ...props }: CustomInputProps) => {
    return (
        <div className="relative w-full">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />}
            <input
                className={cn(
                    "w-full rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                    variant === 'light'
                        ? "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400"
                        : "bg-background-dark border border-white/10 text-white placeholder:text-gray-500",
                    Icon ? "pl-12 pr-4" : "px-4",
                    className
                )}
                {...props}
            />
        </div>
    );
};
