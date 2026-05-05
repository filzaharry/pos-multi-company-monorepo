'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
    CreditCard,
    type LucideIcon
} from 'lucide-react';
import { useSidebarMenus, MenuItem } from '@/lib/hooks/useSidebarMenus';
import { useLogin } from '@/lib/modules/login/store/useLogin';
import { SidebarItem } from './sidebar/SidebarItem';
import { SidebarDropdown } from './sidebar/SidebarDropdown';

const IconMap: Record<string, LucideIcon> = {
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
    const router = useRouter();
    const { logout } = useLogin();
    const { menus, isLoading: isMenusLoading, error } = useSidebarMenus();
    const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (error && error.includes('401 Unauthorized')) {
            if (typeof window !== 'undefined') {
                localStorage.clear();
                sessionStorage.clear();
                document.cookie.split(";").forEach((c) => {
                    document.cookie = c
                        .replace(/^ +/, "")
                        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                logout();
                router.push('/');
            }
        }
    }, [error, logout, router]);

    const toggleMenu = (id: number) => {
        setOpenMenus(prev => {
            const isParentOfActive = menus.find(m => m.id === id)?.children?.some(child => pathname === child.path);
            const currentState = prev[id] ?? isParentOfActive;
            return { ...prev, [id]: !currentState };
        });
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
                                {groupedMenus[groupName].map(menu => {
                                    const hasChildren = menu.children && menu.children.length > 0;
                                    const Icon = IconMap[menu.icon] || LayoutDashboard;
                                    
                                    // Calculate expansion state during render (Derived State)
                                    const isParentOfActive = menu.children?.some(child => pathname === child.path);
                                    const isExpanded = openMenus[menu.id] ?? isParentOfActive;

                                    if (hasChildren) {
                                        return (
                                            <SidebarDropdown
                                                key={menu.id}
                                                item={menu}
                                                icon={Icon}
                                                isOpen={isOpen}
                                                isExpanded={!!isExpanded}
                                                onToggle={toggleMenu}
                                            />
                                        );
                                    }

                                    return (
                                        <SidebarItem
                                            key={menu.id}
                                            id={menu.id}
                                            name={menu.name}
                                            path={menu.path}
                                            icon={Icon}
                                            isOpen={isOpen}
                                        />
                                    );
                                })}
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
