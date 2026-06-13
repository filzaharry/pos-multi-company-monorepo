import React, { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputUploadImageProps {
    label?: string;
    value?: string; // image URL or base64 preview
    onChange?: (file: File | null) => void;
    placeholder?: string;
    error?: string;
    touched?: boolean;
    className?: string;
}

export const InputUploadImage: React.FC<InputUploadImageProps> = ({
    label,
    value,
    onChange,
    placeholder = 'Click to upload or drag and drop',
    error,
    touched,
    className
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(value || null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            if (onChange) onChange(file);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onChange) onChange(null);
    };

    const triggerSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="text-xs font-bold text-slate-800       block px-0.5">
                    {label}
                </label>
            )}
            <div
                onClick={triggerSelect}
                className={cn(
                    "relative border-2 border-dashed border-slate-200 rounded-2xl bg-white p-6 hover:bg-slate-50/50 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] text-center",
                    touched && error ? "border-red-500 hover:border-red-500/50" : "",
                    className
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                {preview ? (
                    <div className="relative w-full max-w-[200px] aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute top-1.5 right-1.5 p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-full text-slate-600 transition-colors shadow-sm"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="p-3 bg-primary/10 rounded-full text-primary mb-3">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700">{placeholder}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5   tracking-wide">SVG, PNG, JPG (Max 2MB)</p>
                        </div>
                    </>
                )}
            </div>
            {touched && error && (
                <p className="text-xs text-red-500 font-medium px-0.5">*{error}</p>
            )}
        </div>
    );
};
