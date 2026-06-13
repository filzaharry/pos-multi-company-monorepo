import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, type LucideIcon } from 'lucide-react';

interface SidebarItemProps {
    id: number;
    name: string;
    path: string;
    icon: LucideIcon;
    isOpen: boolean;
    isSubmenu?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ 
    name, 
    path, 
    icon: Icon, 
    isOpen, 
    isSubmenu = false 
}) => {
    const pathname = usePathname();
    const isActive = pathname === path;

    return (
        <Link
            href={path || '#'}
            className={cn(
                "flex items-center gap-3 transition-all group",
                isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20 rounded-2xl py-3"
                    : "text-gray-400 hover:bg-white/5 hover:text-white rounded-xl py-2",
                isOpen ? "px-3" : "px-0 justify-center",
                isSubmenu && "py-2",
                isSubmenu && isOpen && "pl-4"
            )}
        >
            {!isSubmenu && (
                <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
            )}
            {isOpen && (
                <span className={cn(
                    "font-medium text-sm", 
                    isSubmenu && "relative flex items-center gap-3"
                )}>
                    {isSubmenu && <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />}
                    {name}
                </span>
            )}
        </Link>
    );
};
