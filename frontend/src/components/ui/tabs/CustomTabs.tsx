'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Tab {
    id: string;
    label: string;
    icon?: React.ElementType;
}

interface CustomTabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

export const CustomTabs = ({ tabs, activeTab, onChange, className }: CustomTabsProps) => {
    return (
        <div className={cn("relative flex items-end overflow-x-auto no-scrollbar", className)}>
            <div className="flex gap-1 relative z-10">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className={cn(
                                "group relative min-w-[160px] py-4 transition-all duration-300 focus:outline-none",
                                isActive ? "text-slate-800" : "text-slate-600 hover:text-slate-900"
                            )}
                        >
                            {/* The Trapezoid Shape */}
                            <div
                                className={cn(
                                    "absolute inset-0 transition-all duration-300",
                                    isActive
                                        ? "bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
                                        : "bg-slate-100/70 group-hover:bg-slate-100"
                                )}
                                style={{
                                    clipPath: "polygon(15px 0%, calc(100% - 15px) 0%, 100% 100%, 0% 100%)"
                                }}
                            />

                            {/* Active Top Border/Accent */}
                            {isActive && (
                                <motion.div
                                    layoutId="tab-accent"
                                    className="absolute top-0 left-0 right-0 h-1 bg-primary"
                                    style={{
                                        clipPath: "polygon(15px 0%, calc(100% - 15px) 0%, calc(100% - 13px) 100%, 13px 100%)"
                                    }}
                                />
                            )}

                            <span className="relative z-10 flex items-center justify-center gap-2 text-xs font-bold   tracking-[0.15em] italic">
                                {tab.icon && <tab.icon className="w-4 h-4 opacity-70" />}
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Bottom line covering the whole width */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200 z-0" />
        </div>
    );
};
