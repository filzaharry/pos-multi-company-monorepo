import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}

export const PageHeader = ({ title, subtitle, actions, className }: PageHeaderProps) => {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-4", className)}>
            <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
                {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">{actions}</div>}
        </div>
    );
};
