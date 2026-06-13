import React from 'react';
import { cn } from '@/lib/utils';

export interface InputCurrencyProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    touched?: boolean;
    currencySymbol?: string;
}

export const InputCurrency: React.FC<InputCurrencyProps> = ({
    label,
    error,
    touched,
    currencySymbol = 'Rp',
    className,
    ...props
}) => {
    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="text-xs font-bold text-slate-800       block px-0.5">
                    {label}
                </label>
            )}
            <div className="relative w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                    {currencySymbol}
                </span>
                <input
                    type="number"
                    className={cn(
                        "w-full rounded-xl py-3 pl-12 pr-4 bg-white border border-slate-200 text-black placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm",
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
