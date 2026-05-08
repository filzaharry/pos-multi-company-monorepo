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
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    value,
    onChange,
    placeholder = 'Select date',
    className,
    disabled,
    name
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
            // Mock event structure for standard onChange handlers if they expect it,
            // though typical custom date pickers just pass the string.
            // We pass the string directly for simplicity, but we can also mock if needed.
            // Some forms expect (e) => e.target.value. We'll pass the raw string and let the parent handle it,
            // but to be safe and compatible with standard handleChange, we could mock it.
            // For now, let's just pass the string. If the parent needs an event, they must wrap it.
            // Wait, standard HTML input passes an event. Let's pass the string as primary, but also provide a mock event if possible.
            // Actually, we defined onChange?: (date: string) => void; so we pass string.
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
                                ? "bg-white/10 text-white font-bold"
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
                    "w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus-within:ring-2 focus-within:ring-primary/50 transition-all flex items-center cursor-pointer",
                    className,
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                )}
                onClick={() => {
                    if (!disabled) setIsOpen(!isOpen);
                }}
            >
                <CalendarIcon className="w-4 h-4 text-gray-500 mr-3 shrink-0" />
                <span className={cn("text-sm truncate w-full", !value && "text-gray-500")}>
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
                        className="absolute z-50 mt-2 p-4 bg-background-dark border border-white/10 rounded-2xl shadow-2xl min-w-[280px]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={prevMonth}
                                className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-white font-bold text-sm">
                                {currentMonth.format('MMMM YYYY')}
                            </span>
                            <button
                                type="button"
                                onClick={nextMonth}
                                className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Weekdays */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map(day => (
                                <div key={day} className="w-8 text-center text-[10px] font-black uppercase tracking-widest text-gray-500">
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
