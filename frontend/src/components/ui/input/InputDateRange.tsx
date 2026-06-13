import React from 'react';
import { CustomDatePicker } from '../CustomDatePicker';

export interface InputDateRangeProps {
    label?: string;
    startDateValue?: string;
    endDateValue?: string;
    onStartDateChange?: (date: string) => void;
    onEndDateChange?: (date: string) => void;
    startDatePlaceholder?: string;
    endDatePlaceholder?: string;
    error?: string;
    touched?: boolean;
}

export const InputDateRange: React.FC<InputDateRangeProps> = ({
    label,
    startDateValue,
    endDateValue,
    onStartDateChange,
    onEndDateChange,
    startDatePlaceholder = 'Start Date',
    endDatePlaceholder = 'End Date',
    error,
    touched
}) => {
    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="text-xs font-bold text-slate-800       block px-0.5">
                    {label}
                </label>
            )}
            <div className="flex items-center gap-3 w-full">
                <CustomDatePicker
                    variant="light"
                    value={startDateValue}
                    onChange={onStartDateChange}
                    placeholder={startDatePlaceholder}
                />
                <span className="text-slate-400 text-sm font-medium">to</span>
                <CustomDatePicker
                    variant="light"
                    value={endDateValue}
                    onChange={onEndDateChange}
                    placeholder={endDatePlaceholder}
                />
            </div>
            {touched && error && (
                <p className="text-xs text-red-500 font-medium px-0.5">*{error}</p>
            )}
        </div>
    );
};
