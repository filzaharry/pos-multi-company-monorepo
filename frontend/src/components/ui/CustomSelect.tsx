import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

export interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    placeholder?: string;
    variant?: 'light' | 'dark';
}

export const CustomSelect = ({ className, children, value, onChange, name, placeholder, variant = 'dark', ...props }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Extract options from children
    const options = useMemo(() => {
        const items: { value: string | number, label: string, disabled?: boolean }[] = [];
        React.Children.forEach(children, child => {
            if (React.isValidElement(child) && child.type === 'option') {
                const element = child as React.ReactElement<{ value?: string | number, children?: React.ReactNode, disabled?: boolean }>;
                items.push({
                    value: element.props.value || '',
                    label: element.props.children?.toString() || '',
                    disabled: element.props.disabled
                });
            }
        });
        return items;
    }, [children]);

    const selectedOption = useMemo(() => options.find(o => o.value == value), [options, value]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        return options.filter(o => o.label?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
    }, [options, searchTerm]);

    const handleSelect = (optionValue: string | number) => {
        if (onChange) {
            onChange({
                target: { name, value: optionValue }
            } as React.ChangeEvent<HTMLSelectElement>);
        }
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div 
                className={cn(
                    "w-full rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/50 transition-all flex items-center cursor-text",
                    variant === 'light'
                        ? "bg-slate-50 border border-slate-200 text-slate-800"
                        : "bg-background-dark border border-white/10 text-white",
                    className,
                    props.disabled ? "opacity-50 cursor-not-allowed" : ""
                )}
                onClick={() => {
                    if (!props.disabled) setIsOpen(true);
                }}
            >
                <input
                    type="text"
                    className="w-full bg-transparent border-none focus:outline-none text-sm placeholder:text-gray-500 cursor-text"
                    placeholder={selectedOption ? selectedOption.label : placeholder || 'Select...'}
                    value={isOpen ? searchTerm : (selectedOption ? selectedOption.label : '')}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                    onFocus={() => setIsOpen(true)}
                    disabled={props.disabled}
                />
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''} shrink-0`} />
            </div>

            {isOpen && (
                <div className={cn(
                    "absolute z-50 w-full mt-2 border rounded-xl shadow-2xl py-2 max-h-60 overflow-y-auto",
                    variant === 'light'
                        ? "bg-white border-slate-200"
                        : "bg-background-dark border border-white/10"
                )}>
                    {filteredOptions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found</div>
                    ) : (
                        filteredOptions.map((option, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "px-4 py-2.5 text-sm flex items-center justify-between transition-colors",
                                    option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                                    variant === 'light'
                                        ? "hover:bg-slate-50 text-slate-800"
                                        : "hover:bg-white/5 text-white",
                                    option.value == value ? "text-primary font-bold" : ""
                                )}
                                onClick={() => {
                                    if (!option.disabled) handleSelect(option.value);
                                }}
                            >
                                <span>{option.label}</span>
                                {option.value == value && <Check className="w-4 h-4 text-primary" />}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
