import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'emerald' | 'amber' | 'red' | 'blue' | 'purple' | 'gray';
    icon?: LucideIcon;
    className?: string;
    theme?: 'light' | 'dark';
}

export const Badge = ({ children, variant = 'gray', icon: Icon, className, theme = 'dark' }: BadgeProps) => {
    const variants = {
        emerald: theme === 'dark' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border-emerald-200",
        amber: theme === 'dark' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-100 text-amber-700 border-amber-200",
        red: theme === 'dark' ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-100 text-red-700 border-red-200",
        blue: theme === 'dark' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-100 text-blue-700 border-blue-200",
        purple: theme === 'dark' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-purple-100 text-purple-700 border-purple-200",
        gray: theme === 'dark' ? "bg-white/5 text-gray-400 border-white/10" : "bg-slate-100 text-slate-600 border-slate-200"
    };

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold   rounded border   ",
            variants[variant],
            className
        )}>
            {Icon && <Icon className="w-3 h-3" />}
            {children}
        </div>
    );
};

export const Table = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn("overflow-x-auto custom-scrollbar", className)}>
            <table className="w-full text-left border-collapse">
                {children}
            </table>
        </div>
    );
};
