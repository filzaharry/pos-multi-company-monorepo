'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-background-dark/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
        <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 rounded-full -mr-10 -mt-10 transition-all group-hover:opacity-20", color)} />
        <div className="flex items-center justify-between mb-4">
            <div className={cn("p-3 rounded-2xl bg-white/5 text-white shadow-inner", color.replace('bg-', 'text-'))}>
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg ">
                    {trend}
                </span>
            )}
        </div>
        <div className="text-2xl font-bold text-white mb-1">
            {typeof value === 'number' && title.includes('Revenue') ? `Rp ${value.toLocaleString()}` : value}
        </div>
        <div className="text-xs text-gray-500 font-bold ">{title}</div>
    </div>
);
