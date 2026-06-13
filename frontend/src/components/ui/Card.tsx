import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
    theme?: 'light' | 'dark';
}

export const Card = ({ children, className, noPadding = false, theme = 'dark' }: CardProps) => {
    return (
        <div className={cn(
            "rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm transition-all",
            theme === 'dark' ? "bg-white/2 border border-white/5" : "bg-white border border-slate-200",
            !noPadding && "p-6",
            className
        )}>
            {children}
        </div>
    );
};

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    bg: string;
    className?: string;
}

export const StatCard = ({ label, value, icon: Icon, color, bg, className }: StatCardProps) => {
    return (
        <div className={cn("bg-white/2 border border-white/5 p-6 rounded-3xl group hover:border-white/10 transition-all", className)}>
            <div className={cn("inline-flex p-3 rounded-2xl mb-4 group-hover:scale-110 transition-transform", bg, color)}>
                <Icon className="w-6 h-6" />
            </div>
            <p className="text-gray-500 text-[10px] font-bold   tracking-[0.2em]">{label}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
        </div>
    );
};
