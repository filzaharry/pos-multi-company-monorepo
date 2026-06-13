import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { MenuItem } from '@/lib/hooks/useSidebarMenus';

interface SidebarDropdownProps {
    item: MenuItem;
    icon: LucideIcon;
    isOpen: boolean;
    isExpanded: boolean;
    onToggle: (id: number) => void;
}

export const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ 
    item, 
    icon: Icon, 
    isOpen, 
    isExpanded, 
    onToggle 
}) => {
    const pathname = usePathname();
    const isActive = item.children?.some(child => pathname === child.path);

    return (
        <div className="space-y-1">
            <button
                onClick={() => onToggle(item.id)}
                className={cn(
                    "w-full flex items-center justify-between transition-all group",
                    isActive ? "bg-white/5 text-white rounded-2xl py-3" : "text-gray-400 hover:bg-white/5 hover:text-white rounded-xl py-2",
                    isOpen ? "px-3" : "px-0 justify-center"
                )}
            >
                <div className={cn("flex items-center gap-3", !isOpen && "justify-center w-full")}>
                    <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-gray-400 group-hover:text-white")} />
                    {isOpen && <span className="font-medium text-sm">{item.name}</span>}
                </div>
                {isOpen && (
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isExpanded && "rotate-180")} />
                )}
            </button>
            
            <AnimatePresence>
                {isExpanded && isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden pl-7 space-y-1"
                    >
                        {item.children?.map(child => (
                            <SidebarItem
                                key={child.id}
                                id={child.id}
                                name={child.name}
                                path={child.path}
                                icon={Icon} // Submenus don't usually use separate icons but can pass if needed
                                isOpen={isOpen}
                                isSubmenu={true}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
