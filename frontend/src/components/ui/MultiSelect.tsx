import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Option {
    label: string;
    value: number;
}

interface MultiSelectProps {
    options: Option[];
    value: number[];
    onChange: (value: number[]) => void;
    placeholder?: string;
    label?: string;
    variant?: 'light' | 'dark';
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select options...',
    label,
    variant = 'dark'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (optionValue: number) => {
        const newValue = value.includes(optionValue)
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue];
        onChange(newValue);
    };

    const removeOption = (optionValue: number, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(value.filter(v => v !== optionValue));
    };

    const selectedOptions = options.filter(opt => value.includes(opt.value));

    return (
        <div className="space-y-2" ref={containerRef}>
            {label && (
                <label className={cn(
                    "text-[10px] font-bold   tracking-[0.2em] px-1",
                    variant === 'light' ? "text-slate-900" : "text-primary"
                )}>
                    {label}
                </label>
            )}
            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        `min-h-[50px] w-full px-4 py-2 border rounded-xl cursor-pointer flex flex-wrap gap-2 items-center transition-all`,
                        isOpen ? 'ring-2 ring-primary/20' : '',
                        variant === 'light'
                            ? `${isOpen ? 'border-primary/50' : 'border-slate-200'} bg-white text-slate-900`
                            : `${isOpen ? 'border-primary/50' : 'border-white/10'} bg-white/5`
                    )}
                >
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map(opt => (
                            <span
                                key={opt.value}
                                className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded-lg border border-primary/30"
                            >
                                {opt.label}
                                <X
                                    className={cn(
                                        "w-3 h-3 cursor-pointer",
                                        variant === 'light' ? "hover:text-slate-800" : "hover:text-white"
                                    )}
                                    onClick={(e) => removeOption(opt.value, e)}
                                />
                            </span>
                        ))
                    ) : (
                        <span className={cn(
                            "text-sm",
                            variant === 'light' ? "text-slate-500" : "text-gray-600"
                        )}>{placeholder}</span>
                    )}
                    <div className={cn(
                        "ml-auto flex items-center gap-2",
                        variant === 'light' ? "text-slate-500" : "text-gray-500"
                    )}>
                        {value.length > 0 && (
                            <span className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                                variant === 'light' ? "bg-slate-200 text-slate-700" : "bg-white/5 text-gray-400"
                            )}>
                                {value.length}
                            </span>
                        )}
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={cn(
                                "absolute z-50 mt-2 w-full border rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar",
                                variant === 'light'
                                    ? "bg-white border-slate-200"
                                    : "bg-[#1A1A1A] border-white/10"
                            )}
                        >
                            {options.length > 0 ? (
                                <div className="p-2 space-y-1">
                                    {options.map(opt => {
                                        const isSelected = value.includes(opt.value);
                                        return (
                                            <div
                                                key={opt.value}
                                                onClick={() => toggleOption(opt.value)}
                                                className={cn(
                                                    "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer",
                                                    isSelected
                                                        ? 'bg-primary text-white font-bold'
                                                        : variant === 'light'
                                                            ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                )}
                                            >
                                                {opt.label}
                                                {isSelected && <Check className="w-4 h-4" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className={cn(
                                    "p-8 text-center text-xs italic",
                                    variant === 'light' ? "text-slate-400" : "text-gray-600"
                                )}>
                                    No options available
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
