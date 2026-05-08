import React from 'react';
import { cn } from '@/lib/utils';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ElementType;
}

export const CustomInput = ({ icon: Icon, className, ...props }: CustomInputProps) => {
    return (
        <div className="relative w-full">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />}
            <input
                className={cn(
                    "w-full bg-background-dark border border-white/10 rounded-xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-500",
                    Icon ? "pl-12 pr-4" : "px-4",
                    className
                )}
                {...props}
            />
        </div>
    );
};
