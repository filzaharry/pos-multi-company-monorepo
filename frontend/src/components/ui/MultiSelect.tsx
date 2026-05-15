import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select options...',
    label
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
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`min-h-[50px] w-full px-4 py-2 bg-white/5 border ${isOpen ? 'border-primary/50 ring-2 ring-primary/20' : 'border-white/10'} rounded-xl cursor-pointer flex flex-wrap gap-2 items-center transition-all`}
                >
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map(opt => (
                            <span
                                key={opt.value}
                                className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded-lg border border-primary/30"
                            >
                                {opt.label}
                                <X
                                    className="w-3 h-3 cursor-pointer hover:text-white"
                                    onClick={(e) => removeOption(opt.value, e)}
                                />
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-600 text-sm">{placeholder}</span>
                    )}
                    <div className="ml-auto flex items-center gap-2 text-gray-500">
                        {value.length > 0 && (
                            <span className="text-[10px] font-bold bg-white/5 px-1.5 py-0.5 rounded text-gray-400">
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
                            className="absolute z-50 mt-2 w-full bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
                        >
                            {options.length > 0 ? (
                                <div className="p-2 space-y-1">
                                    {options.map(opt => {
                                        const isSelected = value.includes(opt.value);
                                        return (
                                            <div
                                                key={opt.value}
                                                onClick={() => toggleOption(opt.value)}
                                                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                                                    isSelected ? 'bg-primary text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                {opt.label}
                                                {isSelected && <Check className="w-4 h-4" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-600 text-xs italic">
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
