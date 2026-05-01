'use client';

import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface AccordionItem {
    id: string | number;
    title: string;
    content: React.ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
    className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, className }) => {
    const [openId, setOpenId] = useState<string | number | null>(null);

    const toggle = (id: string | number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className={twMerge("flex flex-col gap-4", className)}>
            {items.map((item) => {
                const isOpen = openId === item.id;
                return (
                    <div 
                        key={item.id} 
                        className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-white/5 transition-all duration-300"
                    >
                        <button
                            type="button"
                            onClick={() => toggle(item.id)}
                            className="w-full flex justify-between items-center p-5 text-left focus:outline-hidden"
                        >
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                {item.title}
                            </span>
                            <span className={twMerge(
                                "material-symbols-outlined text-gray-400 transition-transform duration-300",
                                isOpen ? "rotate-180 text-primary" : ""
                            )}>
                                expand_more
                            </span>
                        </button>
                        <div 
                            className={twMerge(
                                "overflow-hidden transition-all duration-300 ease-in-out",
                                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                            )}
                        >
                            <div className="p-5 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">
                                {item.content}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
