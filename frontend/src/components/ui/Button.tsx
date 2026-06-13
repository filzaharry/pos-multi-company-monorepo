import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    icon?: LucideIcon;
    isLoading?: boolean;
    children?: React.ReactNode;
    theme?: 'light' | 'dark';
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    icon: Icon,
    isLoading,
    children,
    className,
    disabled,
    theme = 'dark',
    ...props
}: ButtonProps) => {
    const variants = {
        primary: "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20",
        secondary: theme === 'dark'
            ? "bg-white/5 hover:bg-white/10 text-white border border-white/10"
            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20",
        ghost: theme === 'dark'
            ? "hover:bg-white/5 text-gray-400 hover:text-white"
            : "hover:bg-slate-100 text-slate-500 hover:text-slate-800",
        outline: theme === 'dark'
            ? "bg-transparent border border-white/10 hover:border-primary/50 text-white"
            : "bg-transparent border border-slate-200 hover:border-primary/50 text-slate-800"
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
        icon: "p-2.5"
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2  font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : Icon && (
                <Icon className={cn("w-5 h-5", size === 'icon' ? "w-5 h-5" : "")} />
            )}
            {size !== 'icon' && children}
        </button>
    );
};
