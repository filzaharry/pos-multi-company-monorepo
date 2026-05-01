import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    icon?: LucideIcon;
    isLoading?: boolean;
    children?: React.ReactNode;
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    icon: Icon,
    isLoading,
    children,
    className,
    disabled,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20",
        secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20",
        ghost: "hover:bg-white/5 text-gray-400 hover:text-white",
        outline: "bg-transparent border border-white/10 hover:border-primary/50 text-white"
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
                "inline-flex items-center justify-center gap-2 font-black uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100",
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
