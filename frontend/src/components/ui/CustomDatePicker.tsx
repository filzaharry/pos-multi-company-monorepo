import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CustomDatePickerProps {
    value?: string;
    onChange?: (date: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    name?: string;
    variant?: 'light' | 'dark';
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    value,
    onChange,
    placeholder = 'Select date',
    className,
    disabled,
    name,
    variant = 'dark'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(value ? moment(value) : moment());
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateSelect = (day: number) => {
        const newDate = currentMonth.clone().date(day).format('YYYY-MM-DD');
        if (onChange) {
            onChange(newDate);
        }
        setIsOpen(false);
    };

    const nextMonth = () => setCurrentMonth(prev => prev.clone().add(1, 'month'));
    const prevMonth = () => setCurrentMonth(prev => prev.clone().subtract(1, 'month'));

    const renderCalendar = () => {
        const startOfMonth = currentMonth.clone().startOf('month');
        const endOfMonth = currentMonth.clone().endOf('month');
        const daysInMonth = endOfMonth.date();
        const startDayOfWeek = startOfMonth.day(); // 0 (Sun) to 6 (Sat)

        const days = [];
        // Empty cells for days before start of month
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = currentMonth.clone().date(day).format('YYYY-MM-DD');
            const isSelected = value === dateStr;
            const isToday = moment().format('YYYY-MM-DD') === dateStr;

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all",
                        isSelected
                            ? "bg-primary text-white font-bold shadow-lg shadow-primary/20"
                            : isToday
                                ? variant === 'light'
                                    ? "bg-slate-100 text-slate-900 font-bold"
                                    : "bg-white/10 text-white font-bold"
                                : variant === 'light'
                                    ? "text-slate-800 hover:bg-slate-50 hover:text-slate-900"
                                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                    )}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div
                className={cn(
                    "w-full rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/50 transition-all flex items-center cursor-pointer",
                    variant === 'light'
                        ? "bg-white border border-slate-200 text-black"
                        : "bg-background-dark border border-white/10 text-white",
                    className,
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                )}
                onClick={() => {
                    if (!disabled) setIsOpen(!isOpen);
                }}
            >
                <CalendarIcon className="w-4 h-4 text-gray-500 mr-3 shrink-0" />
                <span className={cn(
                    "text-sm truncate w-full",
                    !value && (variant === 'light' ? "text-slate-500" : "text-gray-500"),
                    value && (variant === 'light' ? "text-black" : "text-white")
                )}>
                    {value ? moment(value).format('DD MMM YYYY') : placeholder}
                </span>
            </div>

            {/* Hidden actual input for form submission if needed */}
            {name && <input type="hidden" name={name} value={value || ''} />}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "absolute z-50 mt-2 p-4 rounded-2xl shadow-2xl min-w-[280px] border",
                            variant === 'light'
                                ? "bg-white border-slate-200 text-slate-800"
                                : "bg-background-dark border border-white/10 text-white"
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={prevMonth}
                                className={cn(
                                    "p-1 rounded-lg transition-colors",
                                    variant === 'light'
                                        ? "hover:bg-slate-100 text-slate-500 hover:text-slate-950"
                                        : "p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"
                                )}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className={cn(
                                "font-bold text-sm",
                                variant === 'light' ? "text-slate-800" : "text-white"
                            )}>
                                {currentMonth.format('MMMM YYYY')}
                            </span>
                            <button
                                type="button"
                                onClick={nextMonth}
                                className={cn(
                                    "p-1 rounded-lg transition-colors",
                                    variant === 'light'
                                        ? "hover:bg-slate-100 text-slate-500 hover:text-slate-950"
                                        : "p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"
                                )}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Weekdays */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map(day => (
                                <div key={day} className="w-8 text-center text-[10px]  font-bold text-gray-500">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {renderCalendar()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
