import React from 'react';
import { LucideIcon } from 'lucide-react';

export const SectionTitle = ({ icon: Icon, title }: { icon: LucideIcon, title: string }) => (
    <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-primary/10 rounded-lg">
            <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="text-[10px] font-bold text-primary   tracking-[0.2em]">{title}</h3>
    </div>
);
