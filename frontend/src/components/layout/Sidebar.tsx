'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Package,
    Users,
    Settings,
    LogOut,
    Building2,
    FileText,
    Shield,
    BarChart,
    CreditCard
} from 'lucide-react';
import { useSidebarMenus, MenuItem } from '@/lib/hooks/useSidebarMenus';

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard,
    Package,
    Users,
    Settings,
    Building2,
    FileText,
    Shield,
    BarChart,
    CreditCard
};

interface SidebarProps {
    isOpen: boolean;
    onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onLogout }) => {
    const pathname = usePathname();
    const { menus, isLoading: isMenusLoading } = useSidebarMenus();

    const renderMenuItem = (item: MenuItem) => {
        const IconComponent = IconMap[item.icon] || LayoutDashboard;
        const isActive = pathname === item.path;

        return (
            <Link
                key={item.id}
                href={item.path || '#'}
                className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                    isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
            >
                <IconComponent className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                {isOpen && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
        );
    };

    const groupedMenus = menus.reduce((acc, menu) => {
        const group = menu.group_name || 'GENERAL';
        if (!acc[group]) acc[group] = [];
        acc[group].push(menu);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    return (
        <aside
            className={cn(
                "bg-background-dark border-r border-white/5 transition-all duration-300 flex flex-col z-50 h-full",
                isOpen ? "w-64" : "w-20"
            )}
        >
            <div className="h-16 flex items-center px-6 border-b border-white/5">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex shrink-0 items-center justify-center w-8 h-8">
                        <Image src="/assets/logo.png" width={32} height={32} alt="Logo" className="object-contain" />
                    </div>
                    {isOpen && <span className="font-bold text-white whitespace-nowrap">POS Admin</span>}
                </div>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto custom-scrollbar">
                {isMenusLoading ? (
                    <div className="flex flex-col gap-4 px-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    Object.keys(groupedMenus).map(groupName => (
                        <div key={groupName} className="space-y-2">
                            {isOpen && (
                                <h4 className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    {groupName}
                                </h4>
                            )}
                            <div className="space-y-1">
                                {groupedMenus[groupName].map(renderMenuItem)}
                            </div>
                        </div>
                    ))
                )}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all group"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {isOpen && <span className="font-medium text-sm">Logout</span>}
                </button>
            </div>
        </aside>
    );
};
