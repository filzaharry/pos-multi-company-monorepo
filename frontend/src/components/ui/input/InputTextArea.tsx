import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface InputTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    icon?: LucideIcon;
    error?: string;
    touched?: boolean;
}

export const InputTextArea: React.FC<InputTextAreaProps> = ({
    label,
    icon: Icon,
    error,
    touched,
    className,
    ...props
}) => {
    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="text-xs font-bold text-slate-800       block px-0.5">
                    {label}
                </label>
            )}
            <div className="relative w-full">
                {Icon && <Icon className="absolute left-4 top-4 w-4 h-4 text-slate-500" />}
                <textarea
                    className={cn(
                        "w-full rounded-xl py-3 px-4 bg-white border border-slate-200 text-black placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm min-h-[120px] resize-none",
                        Icon ? "pl-12" : "",
                        touched && error ? "border-red-500 focus:ring-red-500/50" : "focus:border-primary/50",
                        className
                    )}
                    {...props}
                />
            </div>
            {touched && error && (
                <p className="text-xs text-red-500 font-medium px-0.5">*{error}</p>
            )}
        </div>
    );
};
