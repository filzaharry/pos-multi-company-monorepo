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
        <header className="h-16 bg-background-dark/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-40">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <div className="hidden md:flex items-center gap-2 text-gray-400 text-sm">
                    <span>Admin</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white font-medium capitalize">
                        {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white">{user?.name || 'Guest'}</p>
                    <p className="text-xs text-gray-500">{user?.role?.name || 'User'}</p>
                </div>
                <div className="relative group/user">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-blue-600 flex items-center justify-center border-2 border-white/10 cursor-pointer shadow-lg shadow-primary/20">
                        <span className="text-sm font-bold text-white">
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};
