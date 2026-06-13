import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: LucideIcon;
    error?: string;
    touched?: boolean;
    variant?: 'light' | 'dark';
}

export const InputText: React.FC<InputTextProps> = ({
    label,
    icon: Icon,
    error,
    touched,
    variant = 'light',
    className,
    ...props
}) => {
    return (
        <div className="space-y-1.5 w-full">
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
                <input
                    className={cn(
                        "w-full rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm",
                        variant === 'light'
                            ? "bg-white border border-slate-200 text-black placeholder:text-slate-500"
                            : "bg-background-dark border border-white/10 text-white placeholder:text-gray-500",
                        Icon ? "pl-12" : "",
                        touched && error ? "border-red-500 focus:ring-red-500/50" : "focus:border-primary/50",
                        className
                    )}
                    {...props}
                />
            </div>
            {touched && error && (
                <p className="text-xs text-red-500 font-medium px-0.5">*{error}</p>
            )}
        </div>
    );
};
