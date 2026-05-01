import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ElementType;
    actions?: React.ReactNode;
    className?: string;
}

export const PageHeader = ({ title, subtitle, icon: Icon, actions, className }: PageHeaderProps) => {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 py-6", className)}>
            <div className="space-y-1">
                <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                    {Icon && <Icon className="w-10 h-10 text-primary" />}
                    {title.toUpperCase()}
                </h1>
                {subtitle && <p className="text-gray-500 font-medium">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    );
};
