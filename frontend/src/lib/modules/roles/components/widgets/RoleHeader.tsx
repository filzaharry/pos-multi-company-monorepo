'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Can } from '@/components/auth/Can';
import { cn } from '@/lib/utils';

interface RoleHeaderProps {
    title: string;
    description?: string;
    onAdd: () => void;
    isMobile?: boolean;
}

export const RoleHeader: React.FC<RoleHeaderProps> = ({ title, description, onAdd, isMobile }) => {
    if (isMobile) {
        return (
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">{title}</h1>
                <Can permission="role.create">
                    <button
                        onClick={onAdd}
                        className="p-2 bg-primary text-white rounded-lg shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </Can>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {description && <p className="text-gray-400">{description}</p>}
            </div>
            <Can permission="role.create">
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Role</span>
                </button>
            </Can>
        </div>
    );
};
