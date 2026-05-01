import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'emerald' | 'amber' | 'red' | 'blue' | 'purple' | 'gray';
    icon?: LucideIcon;
    className?: string;
}

export const Badge = ({ children, variant = 'gray', icon: Icon, className }: BadgeProps) => {
    const variants = {
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        red: "bg-red-500/10 text-red-400 border-red-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        gray: "bg-white/5 text-gray-400 border-white/10"
    };

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-black uppercase rounded border tracking-widest",
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
