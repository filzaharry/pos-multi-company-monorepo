import React from 'react';
import { Eye, Save } from 'lucide-react';

export const ContentHeader = () => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Content <span className="text-primary">Management</span></h1>
                <p className="text-gray-500 text-sm font-medium tracking-wide">Customize your landing page content, visuals, and messaging.</p>
            </div>

            <div className="flex items-center gap-3 self-end"></div>
        </div>
    );
};
