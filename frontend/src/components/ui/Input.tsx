import React from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ElementType;
}

export const Input = ({ icon: Icon, className, ...props }: InputProps) => {
    return (
        <div className="relative w-full">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />}
            <input
                className={cn(
                    "w-full bg-background-dark border border-white/10 rounded-xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-500",
                    Icon ? "pl-12 pr-4" : "px-4",
                    className
                )}
                {...props}
            />
        </div>
    );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

export const Select = ({ className, children, ...props }: SelectProps) => {
    return (
        <select
            className={cn(
                "bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none",
                className
            )}
            {...props}
        >
            {children}
        </select>
    );
};

export const FilterRow = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/2 p-4 rounded-2xl border border-white/5", className)}>
            {children}
        </div>
    );
};
