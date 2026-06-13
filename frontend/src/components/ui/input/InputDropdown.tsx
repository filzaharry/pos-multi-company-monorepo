import React from 'react';
import { CustomSelect, CustomSelectProps } from '../CustomSelect';
import { cn } from '@/lib/utils';

interface InputDropdownProps extends CustomSelectProps {
    label?: string;
    error?: string;
    touched?: boolean;
}

export const InputDropdown: React.FC<InputDropdownProps> = ({
    label,
    error,
    touched,
    children,
    ...props
}) => {
    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="text-xs font-bold text-slate-800       block px-0.5">
                    {label}
                </label>
            )}
            <CustomSelect variant="light" {...props}>
                {children}
            </CustomSelect>
            {touched && error && (
                <p className="text-xs text-red-500 font-medium px-0.5">*{error}</p>
            )}
        </div>
    );
};
