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
        <div className={twMerge("flex flex-col gap-3", className)}>
            {items.map((item) => {
                const isOpen = openId === item.id;
                return (
                    <div
                        key={item.id}
                        className="rounded-xl overflow-hidden transition-all duration-200"
                        style={{
                            border: isOpen ? '1px solid rgba(34,197,94,0.3)' : '1px solid #e2e8f0',
                            background: '#ffffff',
                            boxShadow: isOpen ? '0 2px 20px rgba(34,197,94,0.06)' : 'none',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => toggle(item.id)}
                            className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none"
                        >
                            <span className="text-base font-semibold text-slate-900">
                                {item.title}
                            </span>
                            <span
                                className={twMerge(
                                    "material-symbols-outlined text-slate-400 transition-transform duration-300 flex-shrink-0",
                                    isOpen ? "rotate-180" : ""
                                )}
                                style={{ color: isOpen ? '#22c55e' : undefined }}
                            >
                                expand_more
                            </span>
                        </button>
                        <div
                            className={twMerge(
                                "overflow-hidden transition-all duration-300 ease-in-out",
                                isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            )}
                        >
                            <div
                                className="px-5 pb-4 text-slate-500 text-sm leading-relaxed"
                                style={{ borderTop: '1px solid #f1f5f9' }}
                            >
                                <div className="pt-3">{item.content}</div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
