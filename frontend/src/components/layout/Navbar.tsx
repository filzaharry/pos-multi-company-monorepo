'use client';

import React from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { User } from '@/lib/modules/login/types';

interface NavbarProps {
    user: User | null;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, isSidebarOpen, onToggleSidebar }) => {
    const pathname = usePathname();

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm">
                    <span>Admin</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-800 font-medium capitalize">
                        {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800">{user?.name || 'Guest'}</p>
                    <p className="text-xs text-slate-500">{user?.role?.name || 'User'}</p>
                </div>
                <div className="relative group/user">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-green-600 flex items-center justify-center border-2 border-slate-200 cursor-pointer shadow-lg">
                        <span className="text-sm font-bold text-white">
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};
